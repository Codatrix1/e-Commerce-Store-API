const mongoose = require("mongoose");
const validator = require("validator"); // package for custom validation intergated with mongoose Custom Validation Options
const bcrypt = require("bcryptjs");

//-----------------------
// Defining User Schema
//-----------------------
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 50,
  },

  email: {
    type: String,
    // Technically NOT a Validator: Just Checks for Indexes while Querying Data
    unique: true,
    required: [true, "Please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide valid email",
    },
  },

  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },

  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

//---------------------------
// Handling Password Hashing
//---------------------------
// IMP INFO: next() is NOT REQUIRED in latest Mongoose package Version 6: From the Docs
// Step 1: Adding salt and hashing w/ Pre-Hooks
UserSchema.pre("save", async function () {
  // console.log(this.modifiedPaths());
  // console.log(this.isModified("name"));

  // Below Line Ensures: DO NOT RUN THE PASSWORD HASHING AGAIN if "password" is not getting updated
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Step 2: Comparing hashed password to inputted password for Authentication w/ Instance Method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

//---------------------
// Create Model using the defined Schema and Export the Model
//---------------------
module.exports = mongoose.model("User", UserSchema);
