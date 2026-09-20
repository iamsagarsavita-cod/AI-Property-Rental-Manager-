const router = require("express").Router();

const { addProperty, updateProperty } = require("../controllers/propertyController");

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

router.put(
  "/update-property/:id",
  authentication,
  authorization("owner"),
  upload.array("images", 5),
  updateProperty,
);

module.exports = router;
