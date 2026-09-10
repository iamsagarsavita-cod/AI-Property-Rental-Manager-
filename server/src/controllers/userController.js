const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const {
  isValid,
  isValidFullName,
  isValidEmail,
  isValidPassword,
  isValidPhone,
} = require("../utils/validator");

//Signup
const signup = async (req, res) => {
  try {
    let userData = req.body;

    if (!userData || Object.keys(userData).length === 0) {
      return res.status(400).json({ msg: "Bad Request ! No Data provided" });
    }

    let { fullName, email, password, phone, bio, role } = userData;

    //Full Name Validation
    if (!isValid(fullName)) {
      return res.status(400).json({ msg: "Full Name is Required" });
    }

    if (!isValidFullName(fullName)) {
      return res.status(400).json({ msg: "Invalid Fullname" });
    }

    // Email Validation
    if (!isValid(email)) {
      return res.status(400).json({ msg: "Email is Required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ msg: "Invalid Email" });
    }

    let duplicateEmail = await UserModel.findOne({ email });
    if (duplicateEmail) {
      return res.status(400).json({ msg: "Email Already Exists" });
    }

    //PassWord Validation
    if (!isValid(password)) {
      return res.status(400).json({ msg: "Password is Required" });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ msg: "Invalid Password" });
    }

    //Phone Number Validation
    if (!isValid(phone)) {
      return res.status(400).json({ msg: "Phone Number is Required" });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({ msg: "Invalid Phone Number" });
    }
    let duplicatephone = await UserModel.findOne({ phone });
    if (duplicatephone) {
      return res.status(400).json({ msg: "Phone Number Already Exists" });
    }

    //Bio Validation
    if (bio !== undefined) {
      if (bio.length < 15) {
        return res
          .status(400)
          .json({ msg: "Bio Cannot be less than 15 characters." });
      }
    }

    //Role Validation
    if (role !== undefined) {
      if (role !== "user" && role !== "owner") {
        return res.status(400).json({ msg: "Invalid Role" });
      }
    }

    //Password Hashing
    const hashedpassword = await bcrypt.hash(password, 10);
    userData.password = hashedpassword;

    const user = await UserModel.create(userData);
    return res.status(201).json({ msg: "Signup Successfull", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

//Login
const login = async (req, res) => {
  try {
    let userData = req.body;
    if (!userData || Object.keys(userData).length == 0) {
      return res.status(400).json({ msg: "Bad Request ! No Data Provided" });
    }

    let { email, password } = userData;

    if (!isValid(email)) {
      return res.status(400).json({ msg: "Email is Required" });
    }

    if (!isValid(password)) {
      return res.status(400).json({ msg: "Password is Required" });
    }

    let user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User Not Found" });
    }

    let token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "3d" },
    );
    return res.status(200).json({
      msg: "Login Successfull",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = { signup, login };
