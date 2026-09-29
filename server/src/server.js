require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const express = require("express");
const connectDB = require("./config/db");
const path = require("path");

// Routes
const userRoute = require("./routes/userRoute");
const categoryRoute = require("./routes/categoryRoute");
const propertyRoute = require("./routes/propertyRoute");
const rentalReqRoute = require("./routes/rentalReqRoute");
const aiRoute = require("./routes/aiRoute");

const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", userRoute);
app.use("/categories", categoryRoute);
app.use("/properties", propertyRoute);
app.use("/rental-requests", rentalReqRoute);
app.use("/ai", aiRoute);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({ msg: "Hello From Property Rental Manager" });
});

const PORT = process.env.PORT;

app.listen(PORT, (err) =>
  err ? console.log(err) : console.log(`Server is Running at Port ${PORT}`),
);
