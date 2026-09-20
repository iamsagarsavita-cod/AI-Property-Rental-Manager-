const PropertyModel = require("../models/PropertyModel");
const CategoryModel = require("../models/categoryModel");
const UserModel = require("../models/userModel");

const { isValid, isValidObjectId } = require("../utils/validator");

// Add Property (Owner)
const addProperty = async (req, res) => {
  try {
    let propertyData = req.body;

    if (!propertyData || Object.keys(propertyData).length === 0) {
      return res.status(400).json({ msg: "Bad Request ! No Data Provided" });
    }

    let {
      title,
      description,
      categoryId,
      location,
      price,
      bedRooms,
      bathRooms,
      area,
      status,
    } = propertyData;

    // Title Validation
    if (!isValid(title)) {
      return res.status(400).json({ msg: "Property Title is Required" });
    }

    // Description Validation
    if (!isValid(description)) {
      return res.status(400).json({ msg: "Description is Required" });
    }

    if (description.length < 10 || description.length > 1000) {
      return res.status(400).json({
        msg: "Description should be less than 1000 Character and greater than 10 Character.",
      });
    }

    // Category Id Validation
    if (!isValid(categoryId)) {
      return res.status(400).json({ msg: "Category Id is Required" });
    }

    if (!isValidObjectId(categoryId)) {
      return res.status(400).json({ msg: "Invalid Category Id" });
    }

    let categoryExists = await CategoryModel.findById(categoryId);
    if (!categoryExists) {
      return res.status(404).json({ msg: "Category Not Found" });
    }

    // Location Validation
    if (!isValid(location)) {
      return res.status(400).json({ msg: "Location is Required" });
    }

    // Price Validation
    if (!isValid(price)) {
      return res.status(400).json({ msg: "Price is Required" });
    }

    if (Number(price) <= 0) {
      return res.status(400).json({ msg: "Invalid Price" });
    }

    // BedRooms Validation
    if (!isValid(bedRooms)) {
      return res.status(400).json({ msg: "Bedrooms is Required" });
    }

    if (Number(bedRooms) <= 0) {
      return res.status(400).json({ msg: "Invalid Bedrooms" });
    }

    // BathRooms Validation
    if (!isValid(bathRooms)) {
      return res.status(400).json({ msg: "Bathrooms is Required" });
    }

    if (Number(bathRooms) <= 0) {
      return res.status(400).json({ msg: "Invalid Bathrooms" });
    }

    // Area Validation
    if (!isValid(area)) {
      return res.status(400).json({ msg: "Area is Required" });
    }

    if (Number(area) <= 0) {
      return res.status(400).json({ msg: "Invalid Area" });
    }

    // Status Validation
    if (status !== undefined) {
      if (!["available", "rented", "inactive"].includes(status)) {
        return res.status(400).json({ msg: "Invalid Status" });
      }
    }

    propertyData.ownerId = req.userId;

    // Images
    if (req.files && req.files.length > 0) {
      propertyData.images = req.files.map((file) => file.filename);
    }

    let propertyAdded = await PropertyModel.create(propertyData);
    return res
      .status(201)
      .json({ msg: "Property Added Successfully", propertyAdded });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Update Property (Owner)
const updateProperty = async (req, res) => {
  try {
    let propertyId = req.params.id;

    if (!isValidObjectId(propertyId)) {
      return res.status(400).json({ msg: "Invalid Property Id" });
    }

    let propertyData = req.body;

    if (!propertyData || Object.keys(propertyData).length === 0) {
      return res
        .status(400)
        .json({ msg: "Bad Request ! Enter Data to Update" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Delete Property (Owner)
const deleteProperty = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Get My Properties
const getMyProperties = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  addProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
};
