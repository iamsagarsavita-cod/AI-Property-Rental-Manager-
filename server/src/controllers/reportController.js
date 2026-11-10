const PropertyModel = require("../models/PropertyModel");
const ReportModel = require("../models/reportModel");
const { isValidObjectId } = require("../utils/validator");

const allowedReasons = [
  "misleading_listing",
  "incorrect_price",
  "duplicate_listing",
  "scam_or_suspicious",
  "inappropriate_content",
  "other",
];

const createPropertyReport = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { reason, message = "" } = req.body;

    if (!isValidObjectId(propertyId)) {
      return res.status(400).json({ msg: "Invalid Property Id" });
    }
    if (!allowedReasons.includes(reason)) {
      return res.status(400).json({ msg: "Choose a valid report reason" });
    }
    if (typeof message !== "string" || message.trim().length > 500) {
      return res.status(400).json({ msg: "Details must be 500 characters or less" });
    }

    const property = await PropertyModel.findById(propertyId).select("ownerId");
    if (!property) {
      return res.status(404).json({ msg: "Property Not Found" });
    }
    if (property.ownerId.toString() === req.userId.toString()) {
      return res.status(403).json({ msg: "You cannot report your own property" });
    }

    const alreadyOpen = await ReportModel.exists({
      propertyId,
      reporterId: req.userId,
      status: "open",
    });
    if (alreadyOpen) {
      return res.status(409).json({ msg: "You already reported this property" });
    }

    const report = await ReportModel.create({
      propertyId,
      reporterId: req.userId,
      reason,
      message: message.trim(),
    });

    return res.status(201).json({ msg: "Report submitted to admin", report });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = { createPropertyReport };
