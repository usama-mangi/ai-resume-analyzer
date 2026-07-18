// Default settings
const DEFAULT_SETTINGS = {
  apiBaseUrl: 'http://localhost:3000',
  autoFillEnabled: false,
  confirmBeforeFill: true,
  fillDelay: 100,
  excludedDomains: [],
  fieldMappings: [],
};

// Default field mappings
const DEFAULT_FIELD_MAPPINGS = [
  { formFieldId: '', profileField: 'firstName', confidence: 0.9 },
  { formFieldId: '', profileField: 'lastName', confidence: 0.9 },
  { formFieldId: '', profileField: 'email', confidence: 0.95 },
  { formFieldId: '', profileField: 'phone', confidence: 0.9 },
  { formFieldId: '', profileField: 'location', confidence: 0.8 },
  { formFieldId: '', profileField: 'linkedinUrl', confidence: 0.85 },
  { formFieldId: '', profileField: 'githubUrl', confidence: 0.85 },
  { formFieldId: '', profileField: 'portfolioUrl', confidence: 0.85 },
  { formFieldId: '', profileField: 'currentTitle', confidence: 0.8 },
  { formFieldId: '', profileField: 'currentCompany', confidence: 0.8 },
  { formFieldId: '', profileField: 'yearsOfExperience', confidence: 0.7 },
  { formFieldId: '', profileField: 'desiredSalaryMin', confidence: 0.7 },
  { formFieldId: '', profileField: 'desiredSalaryMax', confidence: 0.7 },
];

// In-memory state (persisted to storage)
let currentProfile = null;
let currentSettings = DEFAULT_SETTINGS;
let authState = { isAuthenticated: false };

// Initialize on install
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    await initializeExtension();
    chrome.tabs.create({ url: chrome.runtime.getURL('welcome.html') });
  } else if (details.reason === 'update') {
    await migrateSettings();
  }
});

async function initializeExtension() {
  const stored = await chrome.storage.sync.get(['settings', 'fieldMappings']);
  currentSettings = { ...DEFAULT_SETTINGS, ...(stored.settings || {}) };
  currentSettings.fieldMappings = stored.fieldMappings || DEFAULT_FIELD_MAPPINGS;

  const auth = await chrome.storage.local.get(['authState']);
  if (auth.authState) {
    authState = auth.authState;
  }

  if (authState.isAuthenticated) {
    await syncProfile();
  }

  console.log('Extension initialized');
}

async function migrateSettings() {
  const stored = await chrome.storage.sync.get(['settings']);
  if (stored.settings) {
    currentSettings = { ...DEFAULT_SETTINGS, ...stored.settings };
    await chrome.storage.sync.set({ settings: currentSettings });
  }
}

// Message handler
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender, sendResponse);
  return true;
});

async function handleMessage(message, sender, sendResponse) {
  try {
    switch (message.type) {
      case 'GET_FORM_FIELDS': {
        const response = await sendToContentScript(message);
        sendResponse(response);
        break;
      }
      case 'AUTOFILL_REQUEST': {
        const payload = {
          ...message.payload,
          profile: currentProfile,
          fieldMappings: currentSettings.fieldMappings,
          settings: currentSettings,
        };
        const response = await sendToContentScript({ ...message, payload });
        sendResponse(response);
        break;
      }
      case 'SYNC_PROFILE': {
        const result = await syncProfile();
        sendResponse(result);
        break;
      }
      case 'AUTH_STATUS': {
        sendResponse({ isAuthenticated: authState.isAuthenticated, userId: authState.userId });
        break;
      }
      case 'LOGOUT': {
        await logout();
        sendResponse({ success: true });
        break;
      }
      case 'SETTINGS_UPDATE': {
        currentSettings = { ...currentSettings, ...message.payload };
        await chrome.storage.sync.set({ settings: currentSettings });
        sendResponse({ success: true });
        break;
      }
      case 'PING': {
        sendResponse({ pong: true });
        break;
      }
      default:
        sendResponse({ error: 'Unknown message type' });
    }
  } catch (error) {
    console.error('Background message handler error:', error);
    sendResponse({ error: error.message });
  }
}

function sendToContentScript(message) {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]?.id) {
        reject(new Error('No active tab'));
        return;
      }
      chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    });
  });
}

async function syncProfile() {
  if (!authState.isAuthenticated || !authState.accessToken) {
    return { profile: null, success: false, error: 'Not authenticated' };
  }

  try {
    const response = await fetch(`${currentSettings.apiBaseUrl}/api/extension/profile`, {
      headers: {
        'Authorization': `Bearer ${authState.accessToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        await logout();
        return { profile: null, success: false, error: 'Session expired' };
      }
      throw new Error(`Failed to sync profile: ${response.statusText}`);
    }

    const profile = await response.json();
    currentProfile = profile;
    await chrome.storage.local.set({ cachedProfile: profile });
    return { profile, success: true };
  } catch (error) {
    console.error('Profile sync error:', error);
    return { profile: null, success: false, error: error.message };
  }
}

async function authenticate(email, password) {
  try {
    const response = await fetch(`${currentSettings.apiBaseUrl}/api/extension/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Login failed' }));
      return { success: false, error: error.message };
    }

    const data = await response.json();
    authState = { isAuthenticated: true, accessToken: data.accessToken, userId: data.userId };
    await chrome.storage.local.set({ authState });
    await syncProfile();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function logout() {
  authState = { isAuthenticated: false };
  currentProfile = null;
  await chrome.storage.local.set({ authState });
  await chrome.storage.local.remove(['cachedProfile']);
}

async function handleClerkAuth(clerkToken) {
  try {
    const response = await fetch(`${currentSettings.apiBaseUrl}/api/extension/auth/clerk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clerkToken }),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Clerk auth failed' }));
      return { success: false, error: error.message };
    }

    const data = await response.json();
    authState = { isAuthenticated: true, accessToken: data.accessToken, userId: data.userId };
    await chrome.storage.local.set({ authState });
    await syncProfile();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Context menu
if (chrome.contextMenus) {
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: 'autofill-form',
      title: 'Auto-fill Application Form',
      contexts: ['page'],
      documentUrlPatterns: ['*://*.linkedin.com/*', '*://*.indeed.com/*', '*://*.greenhouse.io/*', '*://*.lever.co/*'],
    });
    chrome.contextMenus.create({
      id: 'sync-profile',
      title: 'Sync Profile from AI Resume Analyzer',
      contexts: ['page'],
    });
    chrome.contextMenus.create({ id: 'separator', type: 'separator', contexts: ['page'] });
    chrome.contextMenus.create({
      id: 'open-dashboard',
      title: 'Open AI Resume Analyzer Dashboard',
      contexts: ['page'],
    });
  });

  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (!tab || !tab.id) return;
    switch (info.menuItemId) {
      case 'autofill-form':
        if (!currentProfile) await syncProfile();
        if (currentProfile) {
          await chrome.tabs.sendMessage(tab.id, {
            type: 'AUTOFILL_REQUEST',
            payload: { profile: currentProfile, fieldMappings: currentSettings.fieldMappings, settings: currentSettings },
          });
        }
        break;
      case 'sync-profile':
        await syncProfile();
        break;
    case 'open-dashboard':
      chrome.tabs.create({ url: currentSettings.apiBaseUrl.replace('/api', '') });
      break;
    }
  });
}

// Keyboard shortcut
if (chrome.commands && chrome.commands.onCommand) {
  chrome.commands.onCommand.addListener(async (command) => {
    if (command === 'autofill') {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.id && currentProfile) {
        await chrome.tabs.sendMessage(tab.id, {
          type: 'AUTOFILL_REQUEST',
          payload: { profile: currentProfile, fieldMappings: currentSettings.fieldMappings, settings: currentSettings },
        });
      }
    }
  });
}

// Periodic profile sync (every 30 minutes)
setInterval(async () => {
  if (authState.isAuthenticated) await syncProfile();
}, 30 * 60 * 1000);
