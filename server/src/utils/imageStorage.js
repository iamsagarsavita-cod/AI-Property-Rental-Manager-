const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");

const bucketName = "propertyImages";

const getBucket = async () => {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connection.asPromise();
  }

  return new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName,
  });
};

const isGridFsId = (value) => /^[a-f\d]{24}$/i.test(value || "");

const uploadImage = async (file) => {
  const bucket = await getBucket();
  const extension = path.extname(file.originalname).toLowerCase() || ".jpg";
  const filename = `${crypto.randomUUID()}${extension}`;
  const uploadStream = bucket.openUploadStream(filename, {
    metadata: {
      contentType: file.mimetype,
    },
  });

  return new Promise((resolve, reject) => {
    uploadStream.once("error", reject);
    uploadStream.once("finish", () => resolve(uploadStream.id.toString()));
    uploadStream.end(file.buffer);
  });
};

const deleteStoredImage = async (image) => {
  if (isGridFsId(image)) {
    const bucket = await getBucket();
    const objectId = new mongoose.Types.ObjectId(image);
    const fileExists = await bucket.find({ _id: objectId }).hasNext();
    if (fileExists) await bucket.delete(objectId);
    return;
  }

  // Older records store local filenames instead of GridFS ids.
  if (!image || path.basename(image) !== image) return;
  const filePath = path.join(__dirname, "../uploads", image);
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
};

const serveStoredImage = async (req, res, next) => {
  const { imageId } = req.params;
  if (!isGridFsId(imageId)) return next();

  try {
    const bucket = await getBucket();
    const objectId = new mongoose.Types.ObjectId(imageId);
    const [file] = await bucket.find({ _id: objectId }).limit(1).toArray();
    if (!file) return res.status(404).json({ msg: "Image Not Found" });

    res.set(
      "Content-Type",
      file.metadata?.contentType || "application/octet-stream",
    );
    res.set("Cache-Control", "public, max-age=31536000, immutable");

    const downloadStream = bucket.openDownloadStream(objectId);
    downloadStream.once("error", next);
    downloadStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadImage, deleteStoredImage, serveStoredImage };
