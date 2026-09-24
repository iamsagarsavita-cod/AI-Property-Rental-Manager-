const router = require("express").Router();

const { addProperty, updateProperty, deleteProperty, getAllProperty, getMyProperties, getPropertyById } = require("../controllers/propertyController");

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

router.delete(
  "/delete/:id",
  authentication,
  authorization("owner"),
  deleteProperty,
);

router.get(
  "/my-properties",
  authentication,
  authorization("owner"),
  getMyProperties,
);

// Public Routes
router.get("/all-properties", authentication, getAllProperty);
router.get("/get-property/:id", authentication, getPropertyById);

module.exports = router;
