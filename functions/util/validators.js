// Check if supplied email is a valid email
const isEmail = email => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) {
    return true;
  } else {
    return false;
  }
};

// Check if supplied string is empty
const isEmpty = string => {
  if (string.trim() === "") {
    return true;
  } else {
    return false;
  }
};

exports.validateSignUpData = data => {
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = "Must not be empty.";
  } else if (!isEmail(data.email)) {
    errors.email = "Email must be valid.";
  }

  if (isEmpty(data.password)) {
    errors.password = "Must not be empty.";
  }
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (isEmpty(data.userHandle)) {
    errors.userHandle = "Must not be empty.";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.validateLoginData = data => {
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = "Must not be empty.";
  } else if (!isEmail(data.email)) {
    errors.email = "Email must be valid.";
  }

  if (isEmpty(data.password)) {
    errors.password = "Must not be empty.";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};
