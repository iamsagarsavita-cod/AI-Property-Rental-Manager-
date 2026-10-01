const router = require("express").Router();

const {
  getDashboardStats,
  getAllPropertiesAdmin,
  getAllRentalRequestsAdmin,
} = require("../controllers/adminController");

const { authentication, authorization } = require("../middlewares/auth");

router.get(
  "/dashboard-stats",
  authentication,
  authorization("admin"),
  getDashboardStats,
);

router.get(
  "/all-properties",
  authentication,
  authorization("admin"),
  getAllPropertiesAdmin,
);

router.get(
  "/all-rental-requests",
  authentication,
  authorization("admin"),
  getAllRentalRequestsAdmin,
);

module.exports = router;
