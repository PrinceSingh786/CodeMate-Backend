const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // filepath: c:\Users\PRINCE SINGH\OneDrive\Documents\Desktop\Dev\Projects\DevTinder\src\models\user.js
const jwt = require("jsonwebtoken"); // filepath: c:\Users\PRINCE SINGH\OneDrive\Documents\Desktop\Dev\Projects\DevTinder\src\models\user.js
const validator = require("validator"); // filepath: c:\Users\PRINCE SINGH\OneDrive\Documents\Desktop\Dev\Projects\DevTinder\src\models\user.js
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "Anonymous",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error(" Invalid email format");
          res.send("Invalid email format");
        }
        if (!validator.isLength(value, { min: 5, max: 50 })) {
          throw new Error("Email must be between 5 and 50 characters");
        }
        if (!validator.isAlphanumeric(value.replace(/[@.]/g, ""))) {
          throw new Error("Email must contain only alphanumeric characters");
        }
        if (!validator.isLowercase(value)) {
          throw new Error("Email must be in lowercase");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!/[a-z]/.test(value)) {
          throw new Error(
            "Password must contain at least one lowercase letter"
          );
        }
        if (!/[A-Z]/.test(value)) {
          throw new Error(
            "Password must contain at least one uppercase letter"
          );
        }
        if (!/[0-9]/.test(value)) {
          throw new Error("Password must contain at least one number");
        }
      },
    },
    age: {
      type: Number,
      validate(value) {
        if (value > 100) {
          throw new Error("Age must be less than 100");
        }
      },
    },
    gender: {
      type: String,
      validate(value) {
        if (!(value === "male" || value === "female" || value === "other")) {
          throw new Error("Gender must be male , female or other");
        }
      },
    },
    newpassword: {
      type: String,
      default: "No  set 9",
      validate(value) {
        if (value.length < 6) {
          throw new Error("New password must be at least 6 characters long");
        }
        if (value.length > 20) {
          throw new Error("New password cannot exceed 20 characters");
        }
        if (!/[a-z]/.test(value)) {
          throw new Error(
            "New password must contain at least one lowercase letter"
          );
        }
        if (!/[A-Z]/.test(value)) {
          throw new Error(
            "New password must contain at least one uppercase letter"
          );
        }
        if (!/[0-9]/.test(value)) {
          throw new Error("New password must contain at least one number");
        }
      },
    },
    photo: {
      type: String,
      default:
        "https://img.freepik.com/premium-vector/illustration-web_498740-19362.jpg?semt=ais_hybrid&w=740",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL for photo");
        }
      },
    },

    bio: {
      type: String,
      default: "No bio available",
      validate(value) {
        if (value.length > 200) {
          throw new Error("Bio cannot exceed 200 characters");
        }
        if (value.length < 10) {
          throw new Error("Bio must be at least 10 characters long");
        }
        if (!/^[a-zA-Z0-9\s.,!?'"-]+$/.test(value)) {
          throw new Error(
            "Bio can only contain letters, numbers, spaces, and basic punctuation"
          );
        }
      },
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ email: user.email }, "mysecretkey", {
    expiresIn: "1d",
  });
  return token;
};

userSchema.index({ name: 1, email: 1 });

userSchema.methods.validatekrobhai = async function (passwordInput) {
  const user = this;
  return await bcrypt.compare(passwordInput, user.password);
};

module.exports = mongoose.model("USER", userSchema);
