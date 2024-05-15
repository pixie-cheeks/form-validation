import './index.css';

class FormField {
  constructor(selector) {
    if (!selector) throw new Error('A selector param is required');
    this.field = document.querySelector(selector);
    this.errorElem = this.field.nextElementSibling;
    this.validIcon = this.errorElem.nextElementSibling;
    this.active = false;
    this.rules = [];
    this.init();
  }

  init() {
    this.field.addEventListener('blur', this.validateOnBlur.bind(this));
    this.field.addEventListener('input', this.validateOnInput.bind(this));
  }

  validateOnBlur() {
    if (!this.active) this.active = true;
    this.validate();
  }

  validateOnInput() {
    if (!this.active) return;
    this.validate();
  }

  addRule(checkIfValid, errorMessage) {
    this.rules.unshift({ checkIfValid, errorMessage });
  }

  validate() {
    const firstInvalid = this.rules.find(
      (rule) => !rule.checkIfValid(this.field.value),
    );

    if (firstInvalid) {
      this.showMessage(false, firstInvalid.errorMessage);
    } else {
      this.showMessage(true);
    }
  }

  showMessage(isValid, errorMessage) {
    this.errorElem.textContent = '';
    if (isValid) {
      this.validIcon.style.display = 'block';
      this.field.classList.remove('is-invalid');
      this.field.classList.add('is-valid');
    } else {
      this.validIcon.style.display = 'none';
      this.field.classList.remove('is-valid');
      this.field.classList.add('is-invalid');
      this.errorElem.textContent = errorMessage;
    }
  }
}

const emailField = new FormField('.js-email');
const passwordField = new FormField('.js-password');
const confirmPasswordField = new FormField('.js-password-confirm');
const countrySelectField = new FormField('.js-country');
const zipCodeField = new FormField('.js-zip-code');

emailField.addRule(
  (fieldValue) => /^\S+@\S+\.\S+$/g.test(fieldValue),
  'Invalid email address.',
);

emailField.addRule(
  (fieldValue) => fieldValue.trim() !== '',
  'Email is required.',
);

passwordField.addRule(
  (fieldValue) => /[^0-9a-zA-Z]/.test(fieldValue),
  'Password must contain at least one special character.',
);

passwordField.addRule(
  (fieldValue) => /[A-Z]/.test(fieldValue),
  'Password must contain at least one uppercase letter.',
);

passwordField.addRule(
  (fieldValue) => /[0-9]/.test(fieldValue),
  'Password must contain at least one number.',
);

passwordField.addRule((fieldValue) => {
  confirmPasswordField.validateOnInput();
  return /^.{8,}$/.test(fieldValue);
}, 'Password must be at least 8 characters long.');

confirmPasswordField.addRule(
  (fieldValue) => fieldValue === passwordField.field.value,
  "Password doesn't match",
);

const checkZIP = (fieldValue) => {
  const constraints = {
    ch: /^(CH-)?\d{4}$/i,
    fr: /^(F-)?\d{5}$/i,
    de: /^(D-)?\d{5}$/i,
    nl: /^(NL-)?\d{4}\s*([A-RT-Z][A-Z]|S[BCE-RT-Z])$/i,
  };

  return constraints[countrySelectField.field.value].test(fieldValue);
};
const zipErrorMessage = Object.create({
  toString() {
    const messages = {
      ch: 'Switzerland ZIPs must have exactly 4 digits: e.g. CH-1950 or 1950',
      fr: 'France ZIPs must have exactly 5 digits: e.g. F-75012 or 75012',
      de: 'Germany ZIPs must have exactly 5 digits: e.g. D-12345 or 12345',
      nl: 'Netherland ZIPs must have exactly 4 digits, followed by 2 letters except SA, SD and SS',
    };

    return messages[countrySelectField.field.value];
  },
});
zipCodeField.addRule((fieldValue) => checkZIP(fieldValue), zipErrorMessage);
zipCodeField.addRule(
  (fieldValue) => fieldValue.trim() !== '',
  'Zip Code is required.',
);

countrySelectField.field.addEventListener('change', () =>
  zipCodeField.validateOnInput(),
);

const showCongratulations = () => {
  document.querySelector('.js-congrats').classList.remove('card--hidden');
};

const hideCongratulations = () => {
  document.querySelector('.js-congrats').classList.add('card--hidden');
};

document.querySelector('.js-submit').addEventListener('click', (event) => {
  event.preventDefault();
  const fields = [
    emailField,
    passwordField,
    confirmPasswordField,
    countrySelectField,
    zipCodeField,
  ];
  fields.forEach((field) => field.validateOnBlur());

  console.log(document.querySelector('.is-invalid'));
  if (document.querySelector('.is-invalid')) return;

  showCongratulations();
  fields.forEach((field) => {
    const callback = () => {
      hideCongratulations();
      field.field.removeEventListener('input', callback);
    };
    field.field.addEventListener('input', callback);
  });
});
