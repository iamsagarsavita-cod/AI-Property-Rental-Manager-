const UserModel = require("../models/userModel");
const PropertyModel = require("../models/PropertyModel");
const CategoryModel = require("../models/categoryModel");
const RentalReqModel = require("../models/rentalRequestModel");

// Dashboard Analytics (Admin)
const getDashboardStats = async (req, res) => {
  try {
    let totalUsers = await UserModel.countDocuments({ role: "user" });
    let totalOwners = await UserModel.countDocuments({ role: "owner" });
    let totalCategories = await CategoryModel.countDocuments();
    let totalProperties = await PropertyModel.countDocuments();
    let availableProperties = await PropertyModel.countDocuments({
      status: "available",
    });

    let rentedProperties = await PropertyModel.countDocuments({
      status: "rented",
    });

    let inactiveProperties = await PropertyModel.countDocuments({
      status: "inactive",
    });

    let totalRentelRequests = await RentalReqModel.countDocuments();
    let pendingRequests = await RentalReqModel.countDocuments({
      status: "pending",
    });

    let approveRequests = await RentalReqModel.countDocuments({
      status: "approved",
    });

    let rejectedRequests = await RentalReqModel.countDocuments({
      status: "rejected",
    });

    let stats = {
      users: {
        totalUsers,
        totalOwners,
      },
      categories: {
        totalCategories,
      },
      properties: {
        totalProperties,
        availableProperties,
        rentedProperties,
        inactiveProperties,
      },
      rentalRequests: {
        totalRentelRequests,
        pendingRequests,
        approveRequests,
        rejectedRequests,
      },
    };

    return res
      .status(200)
      .json({ msg: "Dashboard Stats Fetched Successfully", stats });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Get All Properties - Platform wide (Admin) - all statuses, all owners
const getAllPropertiesAdmin = async (req, res) => {
  try {
    let { status } = req.query;
    let filter = {};

    if (status !== undefined) {
      if (!["available", "rented", "inactive"].includes(status)) {
        return res.status(400).json({ msg: "Invalid Status" });
      }
      filter.status = status;
    }

    let properties = await PropertyModel.find(filter)
      .populate("categoryId")
      .populate("ownerId", "-password")
      .sort({ createdAt: -1 });

    if (properties.length === 0) {
      return res.status(404).json({ msg: "No Properties Found" });
    }

    return res
      .status(200)
      .json({ msg: "Properties Fetched Successfully", properties });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Get All Rental Requests (Admin)
const getAllRentalRequestsAdmin = async (req, res) => {
  try {
    let { status } = req.query;
    let filter = {};

    if (status !== undefined) {
      if (!["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ msg: "Invalid Status" });
      }

      filter.status = status;
    }

    let rentalRequests = await RentalReqModel.find(filter)
      .populate("propertyId")
      .populate("userId", "-password")
      .populate("ownerId", "-password")
      .sort({ createdAt: -1 });

    if (rentalRequests.length === 0) {
      return res.status(404).json({ msg: "No Rental Requests Found" });
    }
    return res
      .status(200)
      .json({ msg: "Rental Requests Fetched Successfully", rentalRequests });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
module.exports = {
  getDashboardStats,
  getAllPropertiesAdmin,
  getAllRentalRequestsAdmin,
};
