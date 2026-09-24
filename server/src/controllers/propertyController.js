const PropertyModel = require("../models/PropertyModel");
const CategoryModel = require("../models/categoryModel");

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
    let property = await PropertyModel.findById(propertyId);

    if (!property) {
      return res.status(404).json({ msg: "property Not Found" });
    }

    if (property.ownerId.toString() != req.userId.toString()) {
      return res
        .status(403)
        .json({ msg: "You can only update your own property" });
    }

    const {
      title,
      description,
      categoryId,
      location,
      price,
      bedRooms,
      bathRooms,
      area,
      status,
    } = req.body;

    // Update only provided fields
    if (title !== undefined) property.title = title;
    if (description !== undefined) property.description = description;
    if (categoryId !== undefined) property.categoryId = categoryId;
    if (location !== undefined) property.location = location;
    if (price !== undefined) property.price = price;
    if (bedRooms !== undefined) property.bedRooms = bedRooms;
    if (bathRooms !== undefined) property.bathRooms = bathRooms;
    if (area !== undefined) property.area = area;
    if (status !== undefined) property.status = status;

    // New images
    if (req.files && req.files.length > 0) {
      property.images = req.files.map((file) => file.filename);
    }

    await property.save();

    return res.status(200).json({
      msg: "Property Updated Successfully",
      property,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Delete Property (Owner)
const deleteProperty = async (req, res) => {
  try {
    let propertyId = req.params.id;
    if (!isValidObjectId(propertyId)) {
      return res.status(400).json({ msg: "Invalid Property Id" });
    }
    let property = await PropertyModel.findById(propertyId);

    if (!property) {
      return res.status(404).json({ msg: "Property Not Found" });
    }

    if (property.ownerId.toString() !== req.userId.toString()) {
      return res
        .status(403)
        .json({ msg: "You can only delete your own property." });
    }

    await PropertyModel.findByIdAndDelete(propertyId);
    return res.status(200).json({ msg: "Property Data Deleted Successfully" });
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Get My Properties
const getMyProperties = async (req, res) => {
  try {
    let properties = await PropertyModel.find({ ownerId: req.userId })
      .populate("categoryId")
      .sort({ createdAt: -1 });

    if (properties.length === 0) {
      return res.status(404).json({ msg: "No Properties Found" });
    }

    return res.status(200).json({
      msg: "Properties Data Fetched Successfully",
      totalNoOfProperty: properties.length,
      properties,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Get All Properties (Search, Filter and Pagination)
const getAllProperty = async (req, res) => {
  try {
    let {
      search,
      categoryId,
      location,
      minPrice,
      maxPrice,
      status,
      page = 1,
      limit = 5,
    } = req.query;

    page = Number(page);
    limit = Number(limit);

    if (page < 1) {
      return res.status(400).json({ msg: "Page must be greater than 0" });
    }

    if (limit < 1 || limit > 20) {
      return res.status(400).json({ msg: "Limit must be between 1 and 20" });
    }

    let filter = {};

    // Search By Title or Location
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    // Filter By Category
    if (categoryId) {
      if (!isValidObjectId(categoryId)) {
        return res.status(400).json({ msg: "Invalid Category Id" });
      }
      filter.categoryId = categoryId;
    }

    // Filter By Location
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    // Filter By Price
    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        if (isNaN(minPrice) || Number(minPrice) < 0) {
          return res.status(400).json({ msg: "Invalid Min Price" });
        }
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        if (isNaN(maxPrice) || Number(maxPrice) < 0) {
          return res.status(400).json({ msg: "Invalid Max Price" });
        }
        filter.price.$lte = Number(maxPrice);
      }
    }

    // Filter By Status
    if (status) {
      if (!["available", "rented", "inactive"].includes(status)) {
        return res.status(400).json({ msg: "Invalid Status" });
      }
      filter.status = status;
    }

    // Total Properties
    let totalProperties = await PropertyModel.countDocuments(filter);

    // Skip
    let skip = (page - 1) * limit;

    let properties = await PropertyModel.find(filter)
      .populate("categoryId")
      .populate("ownerId", "-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (properties.length === 0) {
      return res.status(404).json({ msg: "No Properties Found" });
    }

    let totalPages = Math.ceil(totalProperties / limit);

    return res.status(200).json({
      msg: "Properties Fetched Successfully",
      page,
      limit,
      totalPages,
      totalProperties,
      properties,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Get Property By Id
const getPropertyById = async (req, res) => {
  try {
    let propertyId = req.params.id;
    if (!isValidObjectId(propertyId)) {
      return res.status(400).json({ msg: "Invalid Property Id" });
    }

    let property = await PropertyModel.findById(propertyId)
      .populate("categoryId")
      .populate("ownerId", "-password");

    if (!property) {
      return res.status(404).json({ msg: "Property Not Found" });
    }
    return res.status(200).json({ msg: "Property Data Fetched", property });
  } catch (error) {
    console.
    log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
module.exports = {
  addProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
  getAllProperty,
  getPropertyById,

};
