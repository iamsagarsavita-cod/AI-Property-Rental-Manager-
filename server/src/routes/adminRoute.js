const router = require("express").Router();

const {
  getDashboardStats,
  getAllPropertiesAdmin,
  getAllRentalRequestsAdmin,
  setPropertyVerification,
  setOwnerVerification,
  getAllReports,
  updateReportStatus,
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

router.patch(
  "/properties/:id/verification",
  authentication,
  authorization("admin"),
  setPropertyVerification,
);

router.patch(
  "/owners/:id/verification",
  authentication,
  authorization("admin"),
  setOwnerVerification,
);

router.get("/reports", authentication, authorization("admin"), getAllReports);
router.patch(
  "/reports/:id/status",
  authentication,
  authorization("admin"),
  updateReportStatus,
);

module.exports = router;
