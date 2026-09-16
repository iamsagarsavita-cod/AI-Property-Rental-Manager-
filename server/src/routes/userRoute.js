const router = require("express").Router();

const {
  signup,
  login,
  getMyProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/userController");
const { authentication, authorization } = require("../middlewares/auth");

router.post("/signup", signup);
router.post("/login", login);
router.get("/my-profile", authentication, getMyProfile);
router.put("/update", authentication, updateProfile);
router.delete("/delete", authentication, deleteProfile);

module.exports = router;
