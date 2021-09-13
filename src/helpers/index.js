import sgMail from "@sendgrid/mail";
sgMail.setApiKey(
  process.env.SENDGRID_API_KEY
);
/**
 * @param {string | number} PORT The port to listen on.
 * @return {number} The normalized port number.
 */

export function normalizePort(PORT) {
  if (isNaN(Number(PORT))) PORT = 8080;

  return PORT;
}

/**
 * @param {string} message The message to parse.
 * @return The parsed JSON object or null.
 */

export function safeParseJSON(message) {
  try {
    return JSON.parse(message);
  } catch (error) {
    return null;
  }
}

/**
 * @typedef ErrorReason
 * @type {Object}
 * @param {string} reason - The reason for the error
 * @param {string} message - The error reason message
 * @param {any} data The data received at the location of the error.
 * @param {string} location - The location of the error reason.
 */

/**
 * @typedef ErrorMessage
 * @type {Object}
 * @param {string} error - The error message.
 * @param {Array.<ErrorReason>} reasons - The reasons for the error.
 */

/**
 * @param {ErrorMessage}
 * @return The rendered error message
 */

export const generateError = ({ error, method, reasons }) => {
  return {
    type: "error",
    message: error,
    code: error.split(" ").join("_").toLowerCase(),
    date: new Date(),
    method: method,
    context_info: {
      errors: reasons.map(
        ({ reason, message, data, location, description, requestContent }) => {
          return {
            reason,
            message,
            data: data || null,
            location,
            description,
            requestContent,
          };
        }
      ),
    },
  };
};

export const safeVerifyError = (error, keys) => {
  if (keys.length > 0) {
    if (error && error[keys[0]]) {
      const newError = error[keys[0]];
      keys.shift();
      return safeVerifyError(newError, keys);
    } else {
      return false;
    }
  }
  return error;
};

export const ResponseError = (err, path) => {
  const error = {};
  console.log(err);
  error.path = getPathOfRequest(path);
  error.method = safeVerifyError(err, ["requestResult", "method"]);
  error.statusCode = safeVerifyError(err, ["requestResult", "statusCode"]);
  error.reason = safeVerifyError(err, [
    "requestResult",
    "responseContent",
    "errors",
    0,
    "cause",
    0,
    "code",
  ]);
  error.description = safeVerifyError(err, [
    "requestResult",
    "responseContent",
    "errors",
    0,
    "cause",
    0,
    "description",
  ]);
  error.type = safeVerifyError(err, ["name"]);
  error.data = safeVerifyError(err, [
    "requestResult",
    "responseContent",
    "errors",
    0,
    "description",
  ]);
  error.requestContent = safeVerifyError(err, [
    "requestResult",
    "requestContent",
  ]);
  error.path = path;
  if (error.reason === "instance not unique" && error.path === "register") {
    error.description = "An account with that e-mail already exists";
  } else if (error.description === "Invalid e-mail provided") {
    error.description = "Invalid e-mail format";
  } else if (error.description === "Invalid password") {
    error.description = "Invalid password, please provide at least 8 chars";
  } else if (error.reason === "Rate limiting" && error.path === "createPost") {
    error.description = "You are posting too fast";
  } else if (error.reason === "Rate limiting" && error.path === "getPosts") {
    error.description = "You are reloading too fast";
  } else if (error.description === "email doesnt exist") {
    error.description = "Invalid Email";
  } else if (
    error.reason === "Rate limiting" &&
    error.path === "getPostsByTag"
  ) {
    error.description = "You are reloading too fast";
  } else if (error.description === "Value not found at path [0].") {
    error.description = "This user doesnt exist";
  } else if (error.reason === "permission denied") {
    error.description = "Permission denied";
  } else if (error.reason === "missing identity") {
    error.reason = "Permission denied";
    error.description = "You are not authorized to access this";
  }
  return error;
};

export const SendMail = (templateType, data, code) => {
  const templates = {
    welcome: "d-1d68481152cc4588835e187f22948558",
    forgotPassword: "d-552df62d798944b0bfc1e7b7cc07271b",
  };

  const msg = {
    // extract the email details
    to: data.email,
    from: "ittestmail.test@gmail.com",
    templateId: templates[templateType],

    // extract the custom fields
    dynamic_template_data: {
      fullname: data.fullname,
      unique_name: data.username,
      email: data.email,
    },
  };

  if (templateType === "forgotPassword") {
    msg.dynamic_template_data.username = data.username;
    msg.dynamic_template_data.code = code;
  }

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
      return error;
    });
};

export function findHashtags(searchText) {
  const regexp = /\B#\w\w+\b/g;
  const result = searchText.match(regexp);
  if (result) {
    return result;
  } else {
    return [];
  }
}

export function getPathOfRequest(path) {
  const pathStr = path.split("/")[1];
  return pathStr;
}
