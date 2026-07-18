// Platform detection patterns
const PLATFORM_PATTERNS = {
  linkedin: [/linkedin\.com\/jobs\/apply/, /linkedin\.com\/comm\/jobs\/apply/],
  indeed: [/indeed\.com\/apply/, /indeed\.com\/jobapply/, /indeed\.com\/viewjob/, /indeed\.com\/jobs/, /smartapply\.indeed\.com/],
  greenhouse: [/boards\.greenhouse\.io/, /greenhouse\.io\/jobs/],
  lever: [/jobs\.lever\.co/, /lever\.co\/jobs/],
  workday: [/myworkdayjobs\.com/, /workday\.com\/jobs/],
  icims: [/icims\.com\/jobs/, /jobs\.icims\.com/],
  jobvite: [/jobs\.jobvite\.com/, /jobvite\.com\/jobs/],
  bamboohr: [/bamboohr\.com\/jobs/, /jobs\.bamboohr\.com/],
  smartrecruiters: [/smartrecruiters\.com\/jobs/, /jobs\.smartrecruiters\.com/],
  recruitee: [/recruitee\.com\/jobs/, /jobs\.recruitee\.com/],
  ashbyhq: [/ashbyhq\.com\/jobs/, /jobs\.ashbyhq\.com/],
  eightfold: [/eightfold\.ai\/careers/, /careers\.eightfold\.ai/],
  workable: [/workable\.com\/jobs/, /apply\.workable\.com/],
  unknown: [],
};

function detectPlatform(url) {
  for (const [platform, patterns] of Object.entries(PLATFORM_PATTERNS)) {
    if (patterns.some((pattern) => pattern.test(url))) return platform;
  }
  return 'unknown';
}

// Common field selectors by platform
const PLATFORM_SELECTORS = {
  linkedin: [
    'input[data-automation-id*="text-input"]',
    'input[data-automation-id*="email-input"]',
    'input[data-automation-id*="phone-input"]',
    'textarea[data-automation-id*="textarea"]',
    'select[data-automation-id*="select"]',
    'input[type="file"]',
    '.jobs-apply-form__field input',
    '.jobs-apply-form__field textarea',
    '.jobs-apply-form__field select',
  ],
  indeed: [
    'input[data-qa*="input"]',
    'textarea[data-qa*="textarea"]',
    'select[data-qa*="select"]',
    'input[type="file"]',
    '.ia-continueButton',
  ],
  greenhouse: [
    'input[id*="question_"]',
    'textarea[id*="question_"]',
    'select[id*="question_"]',
    'input[type="file"]',
    '.application-form input',
    '.application-form textarea',
    '.application-form select',
  ],
  lever: [
    'input[name*="question"]',
    'textarea[name*="question"]',
    'select[name*="question"]',
    'input[type="file"]',
    '.application-form input',
    '.application-form textarea',
    '.application-form select',
  ],
  workday: [
    'input[data-automation-id*="textInput"]',
    'input[data-automation-id*="emailInput"]',
    'input[data-automation-id*="phoneInput"]',
    'textarea[data-automation-id*="textArea"]',
    'select[data-automation-id*="promptValue"]',
    'input[type="file"]',
  ],
  icims: [
    'input.iCIMS_TextInput',
    'textarea.iCIMS_TextArea',
    'select.iCIMS_Select',
    'input[type="file"]',
    '.iCIMS_FormField input',
    '.iCIMS_FormField textarea',
    '.iCIMS_FormField select',
  ],
  jobvite: [
    'input.jv-form-field-input',
    'textarea.jv-form-field-textarea',
    'select.jv-form-field-select',
    'input[type="file"]',
    '.jv-application-form input',
    '.jv-application-form textarea',
    '.jv-application-form select',
  ],
  bamboohr: [
    'input.bamboo-input',
    'textarea.bamboo-textarea',
    'select.bamboo-select',
    'input[type="file"]',
    '.applicant-form input',
    '.applicant-form textarea',
    '.applicant-form select',
  ],
  smartrecruiters: [
    'input[data-qa*="input"]',
    'textarea[data-qa*="textarea"]',
    'select[data-qa*="select"]',
    'input[type="file"]',
    '.smartrecruiters-application-form input',
    '.smartrecruiters-application-form textarea',
    '.smartrecruiters-application-form select',
  ],
  recruitee: [
    'input[data-testid*="input"]',
    'textarea[data-testid*="textarea"]',
    'select[data-testid*="select"]',
    'input[type="file"]',
    '.recruitee-application-form input',
    '.recruitee-application-form textarea',
    '.recruitee-application-form select',
  ],
  ashbyhq: [
    'input[data-test-id*="input"]',
    'textarea[data-test-id*="textarea"]',
    'select[data-test-id*="select"]',
    'input[type="file"]',
    '.ashby-application-form input',
    '.ashby-application-form textarea',
    '.ashby-application-form select',
  ],
  eightfold: [
    'input.ef-input',
    'textarea.ef-textarea',
    'select.ef-select',
    'input[type="file"]',
    '.eightfold-application-form input',
    '.eightfold-application-form textarea',
    '.eightfold-application-form select',
  ],
  workable: [
    'input[data-ui*="input"]',
    'textarea[data-ui*="textarea"]',
    'select[data-ui*="select"]',
    'input[type="file"]',
    '.workable-application-form input',
    '.workable-application-form textarea',
    '.workable-application-form select',
  ],
  unknown: [
    'form input[type="text"]',
    'form input[type="email"]',
    'form input[type="tel"]',
    'form input[type="url"]',
    'form textarea',
    'form select',
    'form input[type="file"]',
    'input[type="text"]',
    'input[type="email"]',
    'input[type="tel"]',
    'input[type="url"]',
    'textarea',
    'select',
    '[role="textbox"]',
    '[contenteditable="true"]',
  ],
};

// Label mapping for common fields
const FIELD_LABEL_MAP = {
  firstName: ['first name', 'given name', 'firstname', 'first_name'],
  lastName: ['last name', 'surname', 'family name', 'lastname', 'last_name'],
  email: ['email', 'email address', 'e-mail', 'email_address'],
  phone: ['phone', 'telephone', 'mobile', 'cell', 'phone number', 'phone_number', 'mobile_number'],
  location: ['location', 'city', 'address', 'city/state', 'city, state'],
  linkedinUrl: ['linkedin', 'linkedin profile', 'linkedin url', 'linkedin_url'],
  githubUrl: ['github', 'github profile', 'github url', 'github_url'],
  portfolioUrl: ['portfolio', 'portfolio url', 'website', 'personal website', 'portfolio_url'],
  currentTitle: ['current title', 'current position', 'job title', 'current_role'],
  currentCompany: ['current company', 'current employer', 'employer', 'current_company'],
  yearsOfExperience: ['years of experience', 'experience', 'years experience', 'total experience'],
  desiredSalaryMin: ['desired salary', 'salary expectation', 'expected salary', 'min salary'],
  desiredSalaryMax: ['max salary', 'maximum salary', 'salary max'],
  resume: ['resume', 'cv', 'upload resume', 'upload cv', 'attach resume'],
  coverLetter: ['cover letter', 'coverletter', 'motivation letter', 'letter'],
};

function getFieldType(input) {
  if (input instanceof HTMLSelectElement) return 'select';
  if (input instanceof HTMLTextAreaElement) return 'textarea';
  if (input instanceof HTMLInputElement) {
    switch (input.type.toLowerCase()) {
      case 'email': return 'email';
      case 'tel': return 'tel';
      case 'url': return 'url';
      case 'date': return 'date';
      case 'file': return 'file';
      case 'radio': return 'radio';
      case 'checkbox': return 'checkbox';
      case 'hidden': return 'hidden';
      default: return 'text';
    }
  }
  return 'text';
}

function getLabelForElement(element) {
  if (element.id) {
    const label = document.querySelector(`label[for="${element.id}"]`);
    if (label) return label.textContent?.trim() || '';
  }
  const parentLabel = element.closest('label');
  if (parentLabel) return parentLabel.textContent?.trim() || '';
  if (element.getAttribute('aria-label')) return element.getAttribute('aria-label') || '';
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelEl = document.getElementById(labelledBy);
    if (labelEl) return labelEl.textContent?.trim() || '';
  }
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    if (element.placeholder) return element.placeholder;
  }
  const prev = element.previousElementSibling;
  if (prev && (prev.tagName === 'LABEL' || prev.tagName === 'SPAN' || prev.tagName === 'DIV')) {
    return prev.textContent?.trim() || '';
  }
  return '';
}

function isFieldRequired(element) {
  if (element.hasAttribute('required')) return true;
  if (element.getAttribute('aria-required') === 'true') return true;
  const label = element.closest('label') || document.querySelector(`label[for="${element.id}"]`);
  if (label && label.textContent?.includes('*')) return true;
  return false;
}

function generateFieldId(element, index) {
  return element.id || element.name || `field_${index}_${Date.now()}`;
}

function findFormFields(platform) {
  const selectors = PLATFORM_SELECTORS[platform] || PLATFORM_SELECTORS.unknown;
  const fields = [];
  let index = 0;

  for (const selector of selectors) {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => {
        if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) {
          if (el.type === 'hidden') return;
          if (el.type === 'submit' || el.type === 'button') return;

          const label = getLabelForElement(el);
          const type = getFieldType(el);
          const required = isFieldRequired(el);
          const fieldId = generateFieldId(el, index++);

          let options;
          if (el instanceof HTMLSelectElement) {
            options = Array.from(el.options).map(opt => opt.value).filter(v => v);
          }

          fields.push({
            id: fieldId,
            label,
            type,
            selector,
            required,
            options,
            placeholder: el instanceof HTMLInputElement ? el.placeholder : undefined,
            autocomplete: el.getAttribute('autocomplete') || undefined,
          });
        }
      });
    } catch (e) {
      // Selector might be invalid, continue
    }
  }

  const seen = new Set();
  return fields.filter(f => {
    const key = `${f.selector}:${f.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function matchFieldToProfile(field) {
  const label = field.label.toLowerCase();
  const placeholder = (field.placeholder || '').toLowerCase();
  const autocomplete = (field.autocomplete || '').toLowerCase();
  const searchText = `${label} ${placeholder} ${autocomplete}`;

  if (autocomplete) {
    const autoMap = {
      'given-name': 'firstName',
      'family-name': 'lastName',
      'email': 'email',
      'tel': 'phone',
      'url': 'portfolioUrl',
      'address-line1': 'location',
      'address-city': 'location',
      'address-state': 'location',
      'address-country': 'location',
      'postal-code': 'location',
    };
    if (autoMap[autocomplete]) {
      return { profileField: autoMap[autocomplete], confidence: 0.95 };
    }
  }

  for (const [profileField, keywords] of Object.entries(FIELD_LABEL_MAP)) {
    for (const keyword of keywords) {
      if (searchText.includes(keyword)) {
        return { profileField, confidence: 0.85 };
      }
    }
  }

  if (searchText.includes('name') && !searchText.includes('company') && !searchText.includes('university')) {
    if (searchText.includes('first') || searchText.includes('given')) {
      return { profileField: 'firstName', confidence: 0.7 };
    }
    if (searchText.includes('last') || searchText.includes('family') || searchText.includes('surname')) {
      return { profileField: 'lastName', confidence: 0.7 };
    }
    return { profileField: 'firstName', confidence: 0.5 };
  }

  return null;
}

function getProfileValue(profile, fieldPath) {
  const parts = fieldPath.split('.');
  let value = profile;
  for (const part of parts) {
    const arrayMatch = part.match(/^(\w+)\.(\d+)$/);
    if (arrayMatch) {
      const [, arrayName, index] = arrayMatch;
      value = value?.[arrayName]?.[parseInt(index)];
    } else {
      value = value?.[part];
    }
    if (value === undefined) return null;
  }
  return value;
}

function formatValueForField(value, fieldType) {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (fieldType === 'date' && value instanceof Date) return value.toISOString().split('T')[0];
  return String(value);
}

function fillField(element, value, fieldType, delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        if (element instanceof HTMLInputElement) {
          if (element.type === 'file') {
            console.warn('Cannot auto-fill file input:', element);
            resolve(false);
            return;
          }
          if (element.type === 'checkbox' || element.type === 'radio') {
            element.checked = value.toLowerCase() === 'true' || value === '1' || value.toLowerCase() === 'yes';
          } else {
            element.value = value;
          }
          element.dispatchEvent(new Event('input', { bubbles: true }));
          element.dispatchEvent(new Event('change', { bubbles: true }));
          element.dispatchEvent(new Event('blur', { bubbles: true }));
        } else if (element instanceof HTMLTextAreaElement) {
          element.value = value;
          element.dispatchEvent(new Event('input', { bubbles: true }));
          element.dispatchEvent(new Event('change', { bubbles: true }));
          element.dispatchEvent(new Event('blur', { bubbles: true }));
        } else if (element instanceof HTMLSelectElement) {
          const option = Array.from(element.options).find(opt =>
            opt.value.toLowerCase() === value.toLowerCase() ||
            opt.text.toLowerCase().includes(value.toLowerCase())
          );
          if (option) {
            element.value = option.value;
            element.dispatchEvent(new Event('change', { bubbles: true }));
            element.dispatchEvent(new Event('blur', { bubbles: true }));
          } else {
            element.value = value;
            element.dispatchEvent(new Event('change', { bubbles: true }));
          }
        } else if (element.isContentEditable) {
          element.textContent = value;
          element.dispatchEvent(new Event('input', { bubbles: true }));
        }
        resolve(true);
      } catch (e) {
        console.error('Error filling field:', e);
        resolve(false);
      }
    }, delay);
  });
}

// Main content script class
class AutofillContentScript {
  constructor() {
    this.platform = 'unknown';
    this.fields = [];
    this.fieldMappings = [];
    this.settings = {
      apiBaseUrl: 'http://localhost:3000',
      autoFillEnabled: false,
      confirmBeforeFill: true,
      fillDelay: 100,
      excludedDomains: [],
      fieldMappings: [],
    };
    this.profile = null;
    this.init();
  }

  async init() {
    await this.loadSettings();

    if (this.settings.excludedDomains.some(d => window.location.hostname.includes(d))) {
      console.log('Domain excluded from autofill');
      return;
    }

    this.platform = detectPlatform(window.location.href);

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sendResponse);
      return true;
    });

    if (this.settings.autoFillEnabled) {
      this.detectAndPrepareForm();
    }

    let lastUrl = window.location.href;
    new MutationObserver(() => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        this.platform = detectPlatform(window.location.href);
        this.detectAndPrepareForm();
      }
    }).observe(document.body, { childList: true, subtree: true });
  }

  loadSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(['settings'], (result) => {
        if (result.settings) {
          this.settings = { ...this.settings, ...result.settings };
        }
        resolve();
      });
    });
  }

  async handleMessage(message, sendResponse) {
    switch (message.type) {
      case 'GET_FORM_FIELDS': {
        const response = await this.getFormFields();
        sendResponse(response);
        break;
      }
      case 'AUTOFILL_REQUEST': {
        const result = await this.performAutofill(message.payload);
        sendResponse(result);
        break;
      }
      case 'SYNC_PROFILE': {
        const result = await this.syncProfile();
        sendResponse(result);
        break;
      }
      case 'SETTINGS_UPDATE': {
        this.settings = { ...this.settings, ...message.payload };
        sendResponse({ success: true });
        break;
      }
      case 'PING': {
        sendResponse({ pong: true, platform: this.platform });
        break;
      }
      default:
        sendResponse({ error: 'Unknown message type' });
    }
  }

  detectAndPrepareForm() {
    this.fields = findFormFields(this.platform);
    console.log(`[Resume Analyzer] Platform: ${this.platform}, Detected ${this.fields.length} form fields on ${window.location.href}`);
    if (this.fields.length > 0) {
      console.log('[Resume Analyzer] Fields:', this.fields.map(f => `${f.label || f.id} (${f.type})`));
    }
    chrome.runtime.sendMessage({
      type: 'FORM_DETECTED',
      payload: { platform: this.platform, fieldCount: this.fields.length, url: window.location.href },
    });
  }

  getFormFields() {
    this.fields = findFormFields(this.platform);
    return { fields: this.fields, platform: this.platform, url: window.location.href };
  }

  async syncProfile() {
    try {
      const response = await fetch(`${this.settings.apiBaseUrl}/api/extension/profile`, {
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) throw new Error(`Failed to sync profile: ${response.statusText}`);
      const profile = await response.json();
      this.profile = profile;
      return { profile, success: true };
    } catch (error) {
      return { profile: null, success: false, error: error.message };
    }
  }

  getAuthToken() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['authToken'], (result) => {
        resolve(result.authToken || '');
      });
    });
  }

  async performAutofill(payload) {
    this.profile = payload.profile;
    this.fieldMappings = payload.fieldMappings;
    this.settings = payload.settings;
    this.fields = findFormFields(this.platform);
    console.log(`[Resume Analyzer] Starting autofill: ${this.fields.length} fields detected, ${payload.profile ? 'profile loaded' : 'NO PROFILE'}`);

    const errors = [];
    const skippedFields = [];
    let filledCount = 0;

    // Build effective mappings: use pre-configured ones where formFieldId is set,
    // otherwise auto-map remaining fields using matchFieldToProfile
    const effectiveMappings = [];
    const mappedFieldIds = new Set();

    for (const mapping of this.fieldMappings) {
      if (!mapping.formFieldId) continue;
      const field = this.fields.find(f => f.id === mapping.formFieldId);
      if (field) {
        effectiveMappings.push({ field, profileField: mapping.profileField, confidence: mapping.confidence });
        mappedFieldIds.add(field.id);
      }
    }

    for (const field of this.fields) {
      if (mappedFieldIds.has(field.id)) continue;
      const match = matchFieldToProfile(field);
      if (match) {
        effectiveMappings.push({ field, profileField: match.profileField, confidence: match.confidence });
      }
    }

    effectiveMappings.sort((a, b) => b.confidence - a.confidence);
    console.log(`[Resume Analyzer] Effective mappings: ${effectiveMappings.length}`, effectiveMappings.map(m => `${m.field.label || m.field.id} → ${m.profileField} (${m.confidence})`));

    for (const { field, profileField } of effectiveMappings) {
      const profileValue = getProfileValue(this.profile, profileField);
      if (profileValue === null || profileValue === undefined || profileValue === '') {
        skippedFields.push(field.label || field.id);
        continue;
      }

      const value = formatValueForField(profileValue, field.type);
      const elements = document.querySelectorAll(field.selector);
      let filled = false;

      for (const el of elements) {
        if (el instanceof HTMLElement) {
          const success = await fillField(el, value, field.type, this.settings.fillDelay);
          if (success) {
            filled = true;
            filledCount++;
            break;
          }
        }
      }

      if (!filled) errors.push(`Failed to fill: ${field.label || field.id}`);
    }

    console.log(`[Resume Analyzer] Autofill complete: ${filledCount} filled, ${skippedFields.length} skipped, ${errors.length} errors`);
    return { success: filledCount > 0, filledFields: filledCount, totalFields: this.fields.length, errors, skippedFields };
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new AutofillContentScript());
} else {
  new AutofillContentScript();
}
