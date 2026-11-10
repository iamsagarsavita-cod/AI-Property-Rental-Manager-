const router = require("express").Router();
const { createPropertyReport } = require("../controllers/reportController");
const { authentication } = require("../middlewares/auth");

router.post("/properties/:propertyId", authentication, createPropertyReport);

module.exports = router;
