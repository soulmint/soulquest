/**
 * @fileoverview This file houses functions that can be used for
 * validation of form fields.
 *
 * Note that these functions should return a string error message
 * when they fail, and `undefined` when they pass.
 */

const SUCCESS = undefined;

export const hasLengthAtLeast = (value, values, minimumLength) => {
  if (!value || value.length < minimumLength) {
    const error = {
      message: `Must contain at least ${minimumLength} character(s).`
    };
    return error;
  }

  return SUCCESS;
};

export const hasLengthAtMost = (value, values, maximumLength) => {
  if (value && value.length > maximumLength) {
    const error = {
      message: `Must not exceed ${maximumLength} character(s).`
    };
    return error;
  }

  return SUCCESS;
};

export const hasLengthExactly = (value, values, length) => {
  if (value && value.length !== length) {
    const error = {
      message: `Must contain exactly ${length} character(s).`
    };
    return error;
  }

  return SUCCESS;
};

/**
 * isRequired is provided here for convenience but it is inherently ambiguous and therefore we don't recommend using it.
 * Consider using more specific validators such as `hasLengthAtLeast` or `mustBeChecked`.
 */
export const isRequired = (value) => {
  const error = {
    message: 'Is required.'
  };
  const FAILURE = error;

  // The field must have a value (no null or undefined) and
  // if it's a boolean, it must be `true`.
  if (!value) return FAILURE;

  // If it is a number or string, it must have at least one character of input (after trim).
  const stringValue = String(value).trim();
  const measureResult = hasLengthAtLeast(stringValue, null, 1);

  if (measureResult) return FAILURE;
  return SUCCESS;
};

export const mustBeChecked = (value) => {
  const error = {
    message: 'Must be checked.'
  };
  if (!value) return error;

  return SUCCESS;
};

export const validatePassword = (value) => {
  const count = {
    lower: 0,
    upper: 0,
    digit: 0,
    special: 0
  };

  for (const char of value) {
    if (/[a-z]/.test(char)) count.lower++;
    else if (/[A-Z]/.test(char)) count.upper++;
    else if (/\d/.test(char)) count.digit++;
    else if (/\S/.test(char)) count.special++;
  }

  if (Object.values(count).filter(Boolean).length < 3) {
    const error = {
      message:
        'A password must contain at least 3 of the following: lowercase, uppercase, digits, special characters.'
    };
    return error;
  }

  return SUCCESS;
};

export const isEqualToField = (value, values, fieldKey) => {
  const error = {
    message: `${fieldKey} must match.`
  };
  return value === values[fieldKey] ? SUCCESS : error;
};

export const isNotEqualToField = (value, values, fieldKey) => {
  const error = {
    message: `${fieldKey} must be different`
  };
  return value !== values[fieldKey] ? SUCCESS : error;
};
