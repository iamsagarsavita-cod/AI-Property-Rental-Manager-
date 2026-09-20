const router = require("express").Router();

const { addProperty } = require("../controllers/propertyController");

const { authentication, authorization } = require("../middlewares/auth");
const upload = require("../config/multer");

// Owner Routes
router.post(
  "/add-property",
  authentication,
  authorization("owner"),
  upload.array("images", 5),
  addProperty,
);

module.exports = router;
