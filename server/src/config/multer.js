const multer = require("multer");
// Keep incoming files in memory until validation completes. The upload helper
// sends them to durable cloud storage when configured, or writes them locally
// for development.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  let allowedFiles = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
  if (allowedFiles.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed", false));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

module.exports = upload;
