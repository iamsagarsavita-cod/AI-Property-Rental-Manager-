const UserModel = require("../models/userModel");
const PropertyModel = require("../models/PropertyModel");
const CategoryModel = require("../models/categoryModel");
const RentalReqModel = require("../models/rentalRequestModel");
const ReportModel = require("../models/reportModel");
const { isValidObjectId } = require("../utils/validator");

// Dashboard Analytics (Admin)
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalOwners,
      pendingOwnerVerifications,
      totalCategories,
      totalProperties,
      availableProperties,
      rentedProperties,
      inactiveProperties,
      pendingPropertyReviews,
      totalRentalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      openReports,
    ] = await Promise.all([
      UserModel.countDocuments({ role: "user" }),
      UserModel.countDocuments({ role: "owner" }),
      UserModel.countDocuments({ role: "owner", isVerified: false }),
      CategoryModel.countDocuments(),
      PropertyModel.countDocuments(),
      PropertyModel.countDocuments({ status: "available" }),
      PropertyModel.countDocuments({ status: "rented" }),
      PropertyModel.countDocuments({ status: "inactive" }),
      PropertyModel.countDocuments({ isVerified: false }),
      RentalReqModel.countDocuments(),
      RentalReqModel.countDocuments({ status: "pending" }),
      RentalReqModel.countDocuments({ status: "approved" }),
      RentalReqModel.countDocuments({ status: "rejected" }),
      ReportModel.countDocuments({ status: "open" }),
    ]);

    const stats = {
      users: {
        totalUsers,
        totalOwners,
        pendingOwnerVerifications,
      },
      categories: {
        totalCategories,
      },
      properties: {
        totalProperties,
        availableProperties,
        rentedProperties,
        inactiveProperties,
        pendingPropertyReviews,
      },
      rentalRequests: {
        totalRentalRequests,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
      },
      reports: { openReports },
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
    let { status, verification } = req.query;
    let filter = {};

    if (status !== undefined) {
      if (!["available", "rented", "inactive"].includes(status)) {
        return res.status(400).json({ msg: "Invalid Status" });
      }
      filter.status = status;
    }

    if (verification !== undefined) {
      if (!["pending", "verified"].includes(verification)) {
        return res.status(400).json({ msg: "Invalid verification filter" });
      }
      filter.isVerified =
        verification === "pending" ? false : { $ne: false };
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

const setPropertyVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ msg: "Invalid Property Id" });
    }
    if (typeof isVerified !== "boolean") {
      return res.status(400).json({ msg: "isVerified must be true or false" });
    }

    const existingProperty = await PropertyModel.findById(id).select("ownerId");
    if (!existingProperty) {
      return res.status(404).json({ msg: "Property Not Found" });
    }

    if (isVerified) {
      const owner = await UserModel.findById(existingProperty.ownerId).select(
        "isVerified",
      );
      if (owner && !owner.isVerified) {
        return res.status(409).json({
          msg: "Verify the property owner before publishing this listing",
        });
      }
    }

    const property = await PropertyModel.findByIdAndUpdate(
      id,
      { isVerified },
      { returnDocument: "after" },
    )
      .populate("categoryId")
      .populate("ownerId", "fullName email");

    if (!property) {
      return res.status(404).json({ msg: "Property Not Found" });
    }

    return res.status(200).json({
      msg: isVerified ? "Property approved and published" : "Property unpublished",
      property,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const setOwnerVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ msg: "Invalid Owner Id" });
    }
    if (typeof isVerified !== "boolean") {
      return res.status(400).json({ msg: "isVerified must be true or false" });
    }

    const owner = await UserModel.findOneAndUpdate(
      { _id: id, role: "owner" },
      { isVerified },
      { returnDocument: "after" },
    ).select("-password");

    if (!owner) {
      return res.status(404).json({ msg: "Owner Not Found" });
    }

    if (!isVerified) {
      await PropertyModel.updateMany({ ownerId: id }, { isVerified: false });
    }

    return res.status(200).json({
      msg: isVerified
        ? "Owner verified"
        : "Owner verification removed and their listings unpublished",
      owner,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const getAllReports = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status !== undefined) {
      if (!["open", "reviewed", "dismissed"].includes(status)) {
        return res.status(400).json({ msg: "Invalid report status" });
      }
      filter.status = status;
    }

    const reports = await ReportModel.find(filter)
      .populate("propertyId")
      .populate("reporterId", "fullName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ reports });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ msg: "Invalid Report Id" });
    }
    if (![
      "open",
      "reviewed",
      "dismissed",
    ].includes(status)) {
      return res.status(400).json({ msg: "Invalid report status" });
    }

    const report = await ReportModel.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: "after" },
    )
      .populate("propertyId")
      .populate("reporterId", "fullName email");

    if (!report) {
      return res.status(404).json({ msg: "Report Not Found" });
    }

    return res.status(200).json({ msg: "Report status updated", report });
  } catch (error) {
    console.error(error);
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
  setPropertyVerification,
  setOwnerVerification,
  getAllReports,
  updateReportStatus,
};
