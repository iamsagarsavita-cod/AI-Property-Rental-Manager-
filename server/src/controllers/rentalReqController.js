const RentalRequestModel = require("../models/rentalRequestModel");
const PropertyModel = require("../models/PropertyModel");
const { isValid, isValidObjectId } = require("../utils/validator");

// Send Rental Request (User)
const sendRentalRequest = async (req, res) => {
  try {
    let requestData = req.body;
    if (!requestData || Object.keys(requestData).length === 0) {
      return res.status(400).json({ msg: "Bad Request ! No Data Provided" });
    }

    let { propertyId, message } = requestData;

    if (!isValid(propertyId)) {
      return res.status(400).json({ msg: "Property Id is Required" });
    }

    if (!isValidObjectId(propertyId)) {
      return res.status(400).json({ msg: "Invalid Property Id" });
    }

    let property = await PropertyModel.findById(propertyId);

    if (!property) {
      return res.status(404).json({ msg: "Property Not Found" });
    }

    if (property.status !== "available") {
      return res
        .status(400)
        .json({ msg: "This Property is not available for rent." });
    }

    if (property.ownerId.toString() === req.userId.toString()) {
      return res.status(400).json({
        msg: "You Cannot send a rental request for your own property.",
      });
    }

    let duplicateRequest = await RentalRequestModel.findOne({
      userId: req.userId,
      propertyId,
      status: "pending",
    });

    if (duplicateRequest) {
      return res
        .status(400)
        .json({ msg: "You Already Applied for this property." });
    }

    if (message !== undefined) {
      if (message.length < 25 || message.length > 300) {
        return res
          .status(400)
          .json({ msg: "Your message must be betwwen 25 to 300 Characters." });
      }
    }

    let rentalReq = await RentalRequestModel.create({
      userId: req.userId,
      propertyId,
      ownerId: property.ownerId,
      message,
    });

    return res
      .status(201)
      .json({ msg: "Rental Request Sent Successfully", rentalReq });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Get My Rental Request (User)
const getMyRentalReq = async (req, res) => {
  try {
    let rentalRequests = await RentalRequestModel.find({
      userId: req.userId,
    })
      .populate("propertyId")
      .populate("ownerId", "-password")
      .sort({ createdAt: -1 });

    if (rentalRequests.length === 0) {
      return res.status(404).json({ msg: "No Rental Request Found" });
    }

    return res.status(200).json({
      msg: "Rental Request Fetched Successfully",
      totalRequest: rentalRequests.length,
      rentalRequests,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Track Rental Request (User)
const trackRentalReq = async (req, res) => {
  try {
    let requestId = req.params.id;
    if (!isValidObjectId(requestId)) {
      return res.status(400).json({ msg: "Invalid Request Id" });
    }

    let rentalReq = await RentalRequestModel.findById(requestId)
      .populate("propertyId")
      .populate("ownerId", "-password");

    if (!rentalReq) {
      return res.status(404).json({ msg: "Rental Request Not Found" });
    }

    if (rentalReq.userId.toString() !== req.userId.toString()) {
      return res
        .status(403)
        .json({ msg: "You Can only track your own rental request." });
    }

    return res.status(200).json({ msg: "Rental Req. Fetched", rentalReq });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Get Request For My Properties (Owner)
const getReqForMyProperties = async (req, res) => {
  try {
    let rentalRequests = await RentalRequestModel.find({
      ownerId: req.userId,
    })
      .populate("propertyId")
      .populate("userId", "-password")
      .sort({ createdAt: -1 });

    if (rentalRequests.length === 0) {
      return res.status(404).json({ msg: "No Rental Request Found" });
    }

    return res
      .status(200)
      .json({ msg: "Rental Requests fetched Successfully", rentalRequests });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Approve Rental Request (Owner)
const approveRequest = async (req, res) => {
  try {
    let requestId = req.params.id;
    if (!isValidObjectId(requestId)) {
      return res.status(400).json({ msg: "Invalid Request Id" });
    }

    const rentalReq = await RentalRequestModel.findById(requestId);

    if (!rentalReq) {
      return res.status(404).json({ msg: "Rental Request Not Found" });
    }

    if (rentalReq.ownerId.toString() !== req.userId.toString()) {
      return res
        .status(403)
        .json({ msg: "You Can only Approve requests for your own property" });
    }

    if (rentalReq.status !== "pending") {
      return res
        .status(400)
        .json({ msg: `Request is already ${rentalReq.status}` });
    }

    rentalReq.status = "approved";
    await rentalReq.save();

    await PropertyModel.findByIdAndUpdate(rentalReq.propertyId, {
      status: "rented",
    });

    await RentalRequestModel.updateMany(
      {
        propertyId: rentalReq.propertyId,
        _id: { $ne: rentalReq._id },
        status: "pending",
      },

      { status: "rejected" },
    );

    return res
      .status(200)
      .json({ msg: "Request Approved Successfully", rentalReq });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Reject Rental Request (Owner)
const rejectRequest = async (req, res) => {
  try {
    let requestId = req.params.id;
    if (!isValidObjectId(requestId)) {
      return res.status(400).json({ msg: "Invalid Request Id" });
    }

    const rentalReq = await RentalRequestModel.findById(requestId);
    if (!rentalReq) {
      return res.status(404).json({ msg: "Rental Request Not Found" });
    }

    if (rentalReq.ownerId.toString() !== req.userId.toString()) {
      return res
        .status(403)
        .json({ msg: "You Can only Reject requests for your own property" });
    }

    if (rentalReq.status !== "pending") {
      return res
        .status(400)
        .json({ msg: `Request is already ${rentalReq.status}` });
    }

    rentalReq.status = "rejected";
    await rentalReq.save();

    return res.status(200).json({ msg: "Rental Request Rejected", rentalReq });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  sendRentalRequest,
  getMyRentalReq,
  trackRentalReq,
  getReqForMyProperties,
  approveRequest,
  rejectRequest,
};
