const express = require("express");
require("./config/database");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken"); // For generating JWT tokens
const cors = require("cors"); // For handling CORS

const app = express();
const connectDB = require("./config/database");

app.use(
  cors({
    origin: "https://code-mate-backend.vercel.app/", // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent with requests
  })
);

app.use(express.json());
// Middleware to parse JSON request bodies
app.use(cookieParser());

const authrouter = require("./routes/authRouter");
const userrouter = require("./routes/userRouter");
const connectionrouter = require("./routes/connectionRouter");
const profilerouter = require("./routes/profileRouter");

app.use("/", authrouter);
app.use("/", userrouter);
app.use("/", connectionrouter);
app.use("/", profilerouter);

connectDB()
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.listen(3333, () => {
  console.log("Server is running on port 3333");
});
