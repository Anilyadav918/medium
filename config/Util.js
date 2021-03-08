/* eslint-disable no-useless-escape */
module.exports = {
  IsNullOrUndefined: isNullOrUndefined,
  IsNull: isNull,
  IsEmailValid: isEmailValid,
};

const Email_Tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

/**
 *
 * @param {object} value
 *
 * @returns {boolean}
 */
function isNullOrUndefined(value) {
  return value === undefined || value === null;
}

/**
 *
 * @param {object} value
 *
 * @returns {boolean}
 */
function isNull(value) {
  return value === null;
}

/**
 *
 * @param {string} email
 *
 * @returns {boolean}
 */
function isEmailValid(email) {
  if (!isNullOrUndefined(email)) {
    if (email.length > 254) return false;

    let valid = Email_Tester.test(email);
    if (!valid) return false;

    let parts = email.split('@');
    if (parts[0].length > 64) return false;

    let domainParts = parts[1].split('.');
    return !domainParts.some(function (part) {
      return part.length > 63;
    });
  } else {
    return false;
  }
}
