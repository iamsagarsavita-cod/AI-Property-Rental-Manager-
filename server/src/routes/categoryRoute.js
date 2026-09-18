const router = require("express").Router();

const {
  addCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { authentication, authorization } = require("../middlewares/auth");

// Admin Routes
router.post(
  "/add-category",
  authentication,
  authorization("admin"),
  addCategory,
);
router.put(
  "/update/:id",
  authentication,
  authorization("admin"),
  updateCategory,
);

// Public Routes
router.get("/all-categories", authentication, getAllCategory);
router.get("/get-category/:id", authentication, getCategoryById);

module.exports = router;
