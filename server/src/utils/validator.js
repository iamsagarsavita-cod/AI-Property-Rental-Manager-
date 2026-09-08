const mongoose = require("mongoose");

const isValid = (input) => {
  if (typeof input === "undefined" || input === null) return false;
  if (typeof input === "string" && input.trim().length === 0) return false;
  if (typeof input === "number" && isNaN(input)) return false;

  return true;
};

const isValidFullName = (input) => /^[A-Za-z ]*$/.test(input);

const isValidEmail = (input) =>
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input);

const isValidPhone = (input) =>
  /^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/.test(
    input,
  );

const isValidPassword = (input) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,20}$/.test(
    input,
  );

const isValidObjectId = (objectId) => mongoose.Types.ObjectId.isValid(objectId);

module.exports = {
  isValid,
  isValidFullName,
  isValidEmail,
  isValidPhone,
  isValidPassword,
  isValidObjectId,
};
