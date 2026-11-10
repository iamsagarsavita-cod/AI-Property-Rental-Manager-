const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      enum: [
        "misleading_listing",
        "incorrect_price",
        "duplicate_listing",
        "scam_or_suspicious",
        "inappropriate_content",
        "other",
      ],
      required: true,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    status: {
      type: String,
      enum: ["open", "reviewed", "dismissed"],
      default: "open",
    },
  },
  { timestamps: true },
);

reportSchema.index({ propertyId: 1, reporterId: 1, status: 1 });

module.exports = mongoose.model("Report", reportSchema);
