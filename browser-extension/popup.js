// DOM Elements
const authSection = document.getElementById('auth-section');
const profileSection = document.getElementById('profile-section');
const settingsSection = document.getElementById('settings-section');

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const clerkBtn = document.getElementById('clerk-btn');
const loginError = document.getElementById('login-error');
const syncBtn = document.getElementById('sync-btn');
const logoutBtn = document.getElementById('logout-btn');
const autofillBtn = document.getElementById('autofill-btn');

const userName = document.getElementById('user-name');
const userEmail = document.getElementById('user-email');
const profileAvatar = document.getElementById('avatar');
const profileHeadline = document.getElementById('profile-headline');
const profileLocation = document.getElementById('profile-location');
const profileRole = document.getElementById('profile-role');
const experienceCount = document.getElementById('experience-count');
const skillTags = document.getElementById('skill-tags');

const formStatus = document.getElementById('form-status');
const formInfo = document.getElementById('form-info');
const detectedPlatform = document.getElementById('detected-platform');
const detectedFields = document.getElementById('detected-fields');
const fieldsList = document.getElementById('fields-list');
const fieldsContainer = document.getElementById('fields-container');

const apiUrlInput = document.getElementById('api-base-url');
const autoFillEnabled = document.getElementById('auto-fill-enabled');
const confirmBeforeFill = document.getElementById('confirm-before-fill');
const fillDelay = document.getElementById('fill-delay');
const fillDelayValue = document.getElementById('fill-delay-value');

const autofillResult = document.getElementById('autofill-result');
const toastContainer = document.getElementById('toast-container');

// State
let currentProfile = null;
let currentSettings = {
  apiBaseUrl: 'http://localhost:3000',
  autoFillEnabled: false,
  confirmBeforeFill: true,
  fillDelay: 100,
  excludedDomains: [],
  fieldMappings: [],
  lastSyncAt: undefined,
};
let isAuthenticated = false;
let accessToken = null;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadState();
  updateUI();
  setupEventListeners();
});

// Load state from storage
async function loadState() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['settings'], (result) => {
      if (result.settings) {
        currentSettings = { ...currentSettings, ...result.settings };
      }
      chrome.storage.local.get(['authState', 'profile', 'authToken'], (result) => {
        if (result.authState) {
          isAuthenticated = result.authState.isAuthenticated;
        }
        if (result.profile) {
          currentProfile = result.profile;
        }
        if (result.authToken) {
          accessToken = result.authToken;
        }
        resolve();
      });
    });
  });
}

// Save state to storage
async function saveState() {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ settings: currentSettings }, () => {
      chrome.storage.local.set({
        authState: { isAuthenticated },
        profile: currentProfile,
        authToken: accessToken,
      }, resolve);
    });
  });
}

// Update UI based on state
function updateUI() {
  authSection.style.display = isAuthenticated ? 'none' : 'block';
  profileSection.style.display = isAuthenticated ? 'block' : 'none';

  if (isAuthenticated && currentProfile) {
    userName.textContent = currentProfile.firstName + ' ' + currentProfile.lastName;
    userEmail.textContent = currentProfile.email;
    profileAvatar.textContent = (currentProfile.firstName[0] + currentProfile.lastName[0]).toUpperCase();
    profileHeadline.textContent = currentProfile.headline || 'Not set';
    profileLocation.textContent = currentProfile.location || 'Not set';

    const currentExp = (currentProfile.experience || []).find(function (e) { return e.current; }) || (currentProfile.experience || [])[0];
    profileRole.textContent = currentExp ? currentExp.title + ' at ' + currentExp.company : 'Not set';
    experienceCount.textContent = (currentProfile.experience || []).length + ' entries';

    const skills = (currentProfile.skills || []).slice(0, 10);
    skillTags.innerHTML = skills.length
      ? skills.map(function (s) { return '<span class="skill-tag">' + escapeHtml(s) + '</span>'; }).join('')
      : '<span class="empty">No skills added</span>';

    detectForm();
  }

  apiUrlInput.value = currentSettings.apiBaseUrl;
  autoFillEnabled.checked = currentSettings.autoFillEnabled;
  confirmBeforeFill.checked = currentSettings.confirmBeforeFill;
  fillDelay.value = String(currentSettings.fillDelay);
  fillDelayValue.textContent = currentSettings.fillDelay + 'ms';
}

// Setup event listeners
function setupEventListeners() {
  emailInput.addEventListener('input', validateLoginForm);
  passwordInput.addEventListener('input', validateLoginForm);
  loginBtn.addEventListener('click', handleLogin);
  clerkBtn.addEventListener('click', handleClerkLogin);
  syncBtn.addEventListener('click', handleSyncProfile);
  logoutBtn.addEventListener('click', handleLogout);
  autofillBtn.addEventListener('click', handleAutofill);

  apiUrlInput.addEventListener('change', function () {
    currentSettings.apiBaseUrl = apiUrlInput.value || 'http://localhost:3000';
  });
  autoFillEnabled.addEventListener('change', function () {
    currentSettings.autoFillEnabled = autoFillEnabled.checked;
    saveState();
  });
  confirmBeforeFill.addEventListener('change', function () {
    currentSettings.confirmBeforeFill = confirmBeforeFill.checked;
    saveState();
  });
  fillDelay.addEventListener('input', function () {
    currentSettings.fillDelay = parseInt(fillDelay.value, 10) || 100;
    fillDelayValue.textContent = currentSettings.fillDelay + 'ms';
  });
  fillDelay.addEventListener('change', function () {
    saveState();
  });
}

// Validate login form
function validateLoginForm() {
  var email = emailInput.value.trim();
  var password = passwordInput.value;
  var valid = email.includes('@') && password.length >= 6;
  loginBtn.disabled = !valid;
}

// Handle email/password login via POST to backend
async function handleLogin() {
  var email = emailInput.value.trim();
  var password = passwordInput.value;
  if (!email || !password) return;

  loginBtn.disabled = true;
  loginBtn.querySelector('.btn-text').classList.add('hidden');
  loginBtn.querySelector('.btn-loading').classList.remove('hidden');
  loginError.classList.add('hidden');

  try {
    var response = await fetch(currentSettings.apiBaseUrl + '/api/extension/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password }),
      credentials: 'include',
    });

    if (!response.ok) {
      var err = await response.json().catch(function () { return { message: 'Login failed' }; });
      throw new Error(err.message || 'Login failed');
    }

    var data = await response.json();
    accessToken = data.accessToken;
    isAuthenticated = true;

    // Fetch profile via background script
    try {
      var profileResponse = await sendMessage({ type: 'SYNC_PROFILE' });
      if (profileResponse.success && profileResponse.profile) {
        currentProfile = profileResponse.profile;
      }
    } catch (e) {
      // Profile sync failed but login succeeded — user can sync manually
    }

    await saveState();
    updateUI();
    showToast('Logged in successfully', 'success');
  } catch (error) {
    showError(error.message || 'Login failed');
  } finally {
    loginBtn.disabled = false;
    loginBtn.querySelector('.btn-text').classList.remove('hidden');
    loginBtn.querySelector('.btn-loading').classList.add('hidden');
  }
}

// Handle Clerk login — opens the main app in a new tab for Clerk OAuth
function handleClerkLogin() {
  chrome.tabs.create({ url: currentSettings.apiBaseUrl.replace('/api', '') + '/login', active: true });
  showError('Sign in through the app, then click Sync Profile.');
}

// Handle profile sync
async function handleSyncProfile() {
  if (!isAuthenticated) {
    showToast('Please log in first', 'error');
    return;
  }

  syncBtn.disabled = true;
  var originalText = syncBtn.innerHTML;
  syncBtn.innerHTML = '<svg class="spinner" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path></svg> Syncing...';

  try {
    var response = await sendMessage({ type: 'SYNC_PROFILE' });

    if (response.success && response.profile) {
      currentProfile = response.profile;
      currentSettings.lastSyncAt = new Date().toISOString();
      await saveState();
      updateUI();
      showToast('Profile synced successfully', 'success');
    } else {
      showToast('Failed to sync: ' + (response.error || 'Unknown error'), 'error');
    }
  } catch (error) {
    showToast('Sync failed: ' + error.message, 'error');
  } finally {
    syncBtn.disabled = false;
    syncBtn.innerHTML = originalText;
  }
}

// Handle logout
async function handleLogout() {
  isAuthenticated = false;
  currentProfile = null;
  accessToken = null;
  await chrome.storage.local.remove(['authState', 'profile', 'authToken']);
  await saveState();
  updateUI();
  showToast('Logged out successfully');
}

// Detect form on current page
async function detectForm() {
  formStatus.className = 'form-status detecting';
  formStatus.innerHTML = '<svg class="spinner" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path></svg> Detecting form...';
  formInfo.style.display = 'none';
  fieldsList.style.display = 'none';
  autofillBtn.disabled = true;

  try {
    var response = await sendMessage({ type: 'GET_FORM_FIELDS' });
    var platformName = formatPlatform(response.platform);
    detectedPlatform.textContent = platformName;
    detectedFields.textContent = String(response.fields.length);

    if (response.fields.length > 0) {
      formStatus.className = 'form-status detected';
      formStatus.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Form detected on ' + platformName;
      formInfo.style.display = 'flex';
      fieldsList.style.display = 'block';
      autofillBtn.disabled = false;

      fieldsContainer.innerHTML = response.fields.map(function (field) {
        return '<div class="field-item"><span class="field-label">' + escapeHtml(field.label || 'Unlabeled field') + '</span><span class="field-type">' + field.type + '</span>' + (field.required ? '<span class="field-required">Required</span>' : '') + '</div>';
      }).join('');
    } else {
      formStatus.className = 'form-status none';
      formStatus.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg> No form fields detected on this page';
    }
  } catch (error) {
    formStatus.className = 'form-status error';
    formStatus.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg> Detection failed: ' + escapeHtml(error.message);
  }
}

// Handle autofill
async function handleAutofill() {
  if (!currentProfile) {
    showToast('Please sync your profile first', 'error');
    return;
  }

  if (currentSettings.confirmBeforeFill) {
    if (!confirm('This will fill the detected form fields with your profile data. Continue?')) return;
  }

  autofillBtn.disabled = true;
  var originalText = autofillBtn.innerHTML;
  autofillBtn.innerHTML = '<svg class="spinner" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path></svg> Filling...';
  autofillResult.classList.add('hidden');

  try {
    var response = await sendMessage({
      type: 'AUTOFILL_REQUEST',
      payload: {
        profile: currentProfile,
        fieldMappings: currentSettings.fieldMappings,
        settings: currentSettings,
      },
    });

    autofillResult.classList.remove('hidden');

    var resultSuccess = document.getElementById('result-success');
    if (response.success) {
      resultSuccess.textContent = 'Success!';
      resultSuccess.className = 'result-success success';
      showToast('Filled ' + response.filledFields + ' of ' + response.totalFields + ' fields', 'success');
    } else {
      resultSuccess.textContent = 'Partial';
      resultSuccess.className = 'result-success warning';
      showToast('Filled ' + response.filledFields + ' fields, ' + response.errors.length + ' errors', 'warning');
    }

    document.getElementById('result-filled').textContent = String(response.filledFields);
    document.getElementById('result-total').textContent = String(response.totalFields);

    var errorsContainer = document.getElementById('result-errors');
    if (response.errors.length) {
      errorsContainer.innerHTML = response.errors.map(function (e) { return '<li>' + escapeHtml(e) + '</li>'; }).join('');
    } else {
      errorsContainer.innerHTML = '<li class="empty">No errors</li>';
    }

    var skippedContainer = document.getElementById('result-skipped');
    if (response.skippedFields.length) {
      skippedContainer.innerHTML = response.skippedFields.map(function (s) { return '<li>' + escapeHtml(s) + '</li>'; }).join('');
    } else {
      skippedContainer.innerHTML = '<li class="empty">None</li>';
    }
  } catch (error) {
    showToast('Autofill failed: ' + error.message, 'error');
  } finally {
    autofillBtn.disabled = false;
    autofillBtn.innerHTML = originalText;
  }
}

// Send message to content script
function sendMessage(message) {
  return new Promise(function (resolve, reject) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (!tabs[0] || !tabs[0].id) {
        reject(new Error('No active tab'));
        return;
      }
      chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    });
  });
}

// Utility functions
function escapeHtml(text) {
  var div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatPlatform(platform) {
  var names = {
    linkedin: 'LinkedIn', indeed: 'Indeed', greenhouse: 'Greenhouse', lever: 'Lever',
    workday: 'Workday', icims: 'iCIMS', jobvite: 'Jobvite', bamboohr: 'BambooHR',
    smartrecruiters: 'SmartRecruiters', recruitee: 'Recruitee', ashbyhq: 'Ashby',
    eightfold: 'Eightfold', workable: 'Workable', unknown: 'Unknown',
  };
  return names[platform] || platform;
}

function showToast(message, type) {
  var toast = document.createElement('div');
  toast.className = 'toast toast-' + (type || 'info');
  toast.textContent = message;
  toastContainer.appendChild(toast);
  requestAnimationFrame(function () { toast.classList.add('show'); });
  setTimeout(function () {
    toast.classList.remove('show');
    setTimeout(function () { toast.remove(); }, 300);
  }, 3000);
}

function showError(message) {
  loginError.textContent = message;
  loginError.classList.remove('hidden');
}
