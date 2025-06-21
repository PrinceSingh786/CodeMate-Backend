const validator = require("validator");
const { findOne } = require("../models/user");
const User = require("../models/user");
const validateSignupData = (req) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new Error("All fields are required: name, email, and password.");
  }

  if (!validator.isEmail(req.body.email)) {
    throw new Error("kya be ! Invalid email format");
  }
};

const validateEditprofile = (edituser) => {
  const { name, bio, age, gender, photo } = edituser;
  const allowedFields = ["name", "gender", "photo", "age", "bio"];

  Object.keys(edituser).forEach((key) => {
    if (!allowedFields.includes(key)) {
      throw new Error(
        `Invalid field: ${key}. Allowed fields are: ${allowedFields.join(", ")}`
      );
    }
  });

  if (
    name &&
    (typeof name !== "string" || name.length < 2 || name.length > 50)
  ) {
    throw new Error("Name must be a string between 2 and 50 characters");
  }

  if (bio) {
    if (typeof bio !== "string") throw new Error("Bio must be a string");
    if (bio.length < 10)
      throw new Error("Bio must be at least 10 characters long");
    if (bio.length > 200) throw new Error("Bio cannot exceed 200 characters");
    if (!/^[a-zA-Z0-9\s.,!?'"-]+$/.test(bio)) {
      throw new Error(
        "Bio can only contain letters, numbers, spaces, and basic punctuation"
      );
    }
  }

  if (typeof age !== "undefined") {
    if (typeof age !== "number" || age > 100) {
      throw new Error("Age must be less than 100");
    }
  }

  if (gender && !["male", "female", "other"].includes(gender)) {
    throw new Error("Gender must be 'male', 'female', or 'other'");
  }

  if (photo && !validator.isURL(photo)) {
    throw new Error("Photo must be a valid URL");
  }

  return true;
};

const validateNewPassword = (newpassword) => {
  if (typeof newpassword !== "string" || newpassword.length < 6) {
    return false;
  }
  return true;
};

module.exports = {
  validateSignupData,
  validateEditprofile,
  validateNewPassword,
};
