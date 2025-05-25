const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const employeeRoutes = require("./routes/employeeRoutes");
app.use("/api/employees", employeeRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDB connected");
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port 3000`);
  });
});
