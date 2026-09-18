const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const {
  isValid,
  isValidFullName,
  isValidEmail,
  isValidPassword,
  isValidPhone,
  isValidObjectId
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

// Get My Profile
const getMyProfile = async (req, res) => {
  try {
    let userId = req.userId;

    let user = await UserModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User Not Found" });
    }

    return res.status(200).json({ msg: "Profile Fetched Successfully", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    let userId = req.userId;
    let userData = req.body;

    if (!userData || Object.keys(userData).length === 0) {
      return res
        .status(400)
        .json({ msg: "Bad Request ! Enter Data to Update" });
    }

    let { fullName, email, password, phone, bio } = userData;

    if (fullName !== undefined) {
      if (!isValid(fullName)) {
        return res.status(400).json({ msg: "Full Name is Required" });
      }

      if (!isValidFullName(fullName)) {
        return res.status(400).json({ msg: "Invalid Fullname" });
      }
    }

    if (email !== undefined) {
      if (!isValid(email)) {
        return res.status(400).json({ msg: "Email is Required" });
      }

      if (!isValidEmail(email)) {
        return res.status(400).json({ msg: "Invalid Email" });
      }

      let duplicateEmail = await UserModel.findOne({
        email,
        _id: { $ne: userId },
      });
      if (duplicateEmail) {
        return res.status(400).json({ msg: "Email Already Exists" });
      }
    }

    if (password !== undefined) {
      if (!isValid(password)) {
        return res.status(400).json({ msg: "Password is Required" });
      }

      if (!isValidPassword(password)) {
        return res.status(400).json({ msg: "Invalid Password" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      userData.password = hashedPassword;
    }

    if (phone !== undefined) {
      if (!isValid(phone)) {
        return res.status(400).json({ msg: "Phone Number is Required" });
      }

      if (!isValidPhone(phone)) {
        return res.status(400).json({ msg: "Invalid Phone Number" });
      }

      let duplicatePhone = await UserModel.findOne({
        phone,
        _id: { $ne: userId },
      });
      if (duplicatePhone) {
        return res.status(400).json({ msg: "Phone Number Already Exists" });
      }
    }

    if (bio !== undefined) {
      if (bio.length < 15 && bio.length > 200) {
        return res
          .status(400)
          .json({ msg: "Bio Cannot be less than 15 Characters." });
      }
    }

    let updatedUserProfile = await UserModel.findByIdAndUpdate(
      userId,
      userData,
      { new: true },
    ).select("-password");

    return res
      .status(200)
      .json({ msg: "Profile Updated Successfully", updatedUserProfile });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Delete Profile
const deleteProfile = async (req, res) => {
  try {
    let userId = req.userId;

    let deletedUser = await UserModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ msg: "User Not Found or Already Deleted" });
    }
    return res.status(200).json({ msg: "Profile Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

//Get All Users(Admin)
const getAllUsers = async (req, res) => {
  try {
    let { role } = req.query;
    let filter = {};

    if (role !== undefined) {
      if (role !== "user" && role !== "owner" && role !== "admin") {
        return res.status(400).json({ msg: "Invalid Roles" });
      }
      filter.role = role;
    }

    let users = await UserModel.find(filter).select("-password");

    if (users.length === 0) {
      return res.status(404).json({ msg: "No Users Found" });
    }

    return res.status(200).json({ msg: "Users Fetched Successfully", users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

//Delete Any Users(Admin)
const deleteAnyUser = async (req, res) => {
  try {
    let userId = req.params.id;
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ msg: "Invalid User Id" });
    }

    let user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User Not Found" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ msg: "Admin Cannot be Deleted" });
    }
    await UserModel.findByIdAndDelete(userId);
    return res.status(200).json({ msg: "User Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  signup,
  login,
  getMyProfile,
  updateProfile,
  deleteProfile,
  getAllUsers,
  deleteAnyUser,
};
