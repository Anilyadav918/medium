module.exports = {
  Ok: ok,
  Created: created,
  BadRequest: bad_request,
  Forbidden: forbidden,
  UnAuthorized: unauthorized,
  NotFound: not_found,
  MethodNotAllowed: method_not_allowed,
  InternalServerError: internal_server_error,
  Custom: custom,
};

/**
 *
 * HTTP RESPONSE - OK (200)
 *
 * @param {object} data - optional data
 * @param {string} message - optional message
 *
 * @returns {object} ok response
 */
function ok(data, message) {
  return {
    success: true,
    status: 200,
    data: data || null,
    error: null,
    message: message || 'Everything OK.',
  };
}

/**
 *
 * HTTP RESPONSE - CREATED (201)
 *
 * @param {object} data - optional data
 * @param {string} message - optional message
 *
 * @returns {object} created response
 */
function created(data, message) {
  return {
    success: true,
    status: 201,
    data: data || null,
    error: null,
    message: message || 'Everything OK.',
  };
}

/**
 *
 * HTTP RESPONSE - BAD REQUEST (400)
 *
 * @param {object} error - optional error description
 * @param {string} message - optional message
 *
 * @returns {object} bad request response
 */
function bad_request(error, message) {
  return {
    success: false,
    status: 400,
    data: null,
    error: error || null,
    message: message || 'Bad Request.',
  };
}

/**
 *
 * HTTP RESPONSE - FORBIDDEN (403)
 *
 * @param {object} error - optional error
 * @param {string} message - optional message
 *
 * @returns {object} forbidden response
 */
function forbidden(error, message) {
  return {
    success: false,
    status: 403,
    data: null,
    error: error || null,
    message:
      message || "You don't have enough permissions to access this content.",
  };
}

/**
 *
 * HTTP RESPONSE - UNAUTHORIZED (401)
 *
 * @param {object} error - optional error
 * @param {string} message - optional message
 *
 * @returns {object} unauthorized response
 */
function unauthorized(error, message) {
  return {
    success: false,
    status: 401,
    data: null,
    error: error || null,
    message: message || 'You are not authorized.',
  };
}

/**
 *
 * HTTP RESPONSE - NOT FOUND (401)
 *
 * @param {object} error - optional error
 * @param {string} message - optional message
 *
 * @returns {object} not found response
 */
function not_found(error, message) {
  return {
    success: false,
    status: 404,
    data: null,
    error: error || null,
    message: message || 'Content not found.',
  };
}

/**
 *
 * HTTP RESPONSE - METHOD NOT ALLOWED (405)
 *
 * @param {object} error - optional error
 * @param {string} message - optional message
 *
 * @returns {object} method not allowed response
 */
function method_not_allowed(error, message) {
  return {
    success: false,
    status: 405,
    data: null,
    error: error || null,
    message: message || 'Method not allowed.',
  };
}

/**
 *
 * HTTP RESPONSE - INTERNAL SERVER ERROR (500)
 *
 * @param {object} error - optional error
 * @param {string} message - optional message
 *
 * @returns {object} internal server error response
 */
function internal_server_error(error, message) {
  return {
    success: false,
    status: 500,
    data: null,
    error: error || null,
    message: message || 'Internal Server Error.',
  };
}

/**
 * CUSTOM HTTP RESPONSE
 *
 * @param {boolean} success
 * @param {number} status
 * @param {object} data
 * @param {object} error
 * @param {string} message
 *
 * @returns {object} Custom Response
 */
function custom(success, status, data, error, message) {
  return {
    success: success,
    status: status,
    data: data || null,
    error: error || null,
    message: message,
  };
}
