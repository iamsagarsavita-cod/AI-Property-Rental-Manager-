const router = require("express").Router();

const {
  generateDescription,
  generateSummary,
  analysisRequirement,
  recommendProperty,
} = require("../controllers/aiController");

const { authentication, authorization } = require("../middlewares/auth");

// Owner Routes
router.post(
  "/generate-description",
  authentication,
  authorization("owner"),
  generateDescription,
);

// User Route
router.post(
  "/analyse-requirement",
  authentication,
  authorization("user"),
  analysisRequirement,
);

router.get(
  "/recommend",
  authentication,
  authorization("user"),
  recommendProperty,
);

// Logged-In User Route
router.get("/summary/:id", authentication, generateSummary);

module.exports = router;
