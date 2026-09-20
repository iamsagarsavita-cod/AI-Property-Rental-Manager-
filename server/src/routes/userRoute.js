const router = require("express").Router();

const {
  signup,
  login,
  getMyProfile,
  updateProfile,
  deleteProfile,
  getAllUsers,
  deleteAnyUser,
} = require("../controllers/userController");

const { authentication, authorization } = require("../middlewares/auth");
const upload = require("../config/multer");

router.post("/signup", upload.single("profileImage"), signup);
router.post("/login", login);
router.get("/my-profile", authentication, getMyProfile);
router.put(
  "/update",
  authentication,
  upload.single("profileImage"),
  updateProfile,
);
router.delete("/delete", authentication, deleteProfile);

// Admin Routes
router.get("/all-users", authentication, authorization("admin"), getAllUsers);
router.delete(
  "/delete-user/:id",
  authentication,
  authorization("admin"),
  deleteAnyUser,
);

module.exports = router;
