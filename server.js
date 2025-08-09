require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const adminRoute = require("./routes/adminRoute");
const blogRoute = require("./routes/blogRoute");
const connectDB = require("./config/ConnectDB");

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
  })
);
app.use(express.json());

app.use("/api/admin", adminRoute);
app.use("/api/blog", blogRoute);

app.listen(port, async () => {
  console.log("Server now running on port " + port);
  await connectDB();
});
