const express = require("express");

const { auth } = require("../Middlewares/auth");
const User = require("../models/user");
const Connection = require("../models/Connection");
const userrouter = express.Router();

userrouter.get("/user/requests", auth, async (req, res) => {
  console.log("Fetching user requests");
  try {
    const loggedInUser = req.user;
    const userRequests = await Connection.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["name", "age", "gender", "photo", "bio"]);
    if (!userRequests || userRequests.length === 0) {
      return res.status(404).send("No user requests found");
    }
    res.json({
      message: "User requests fetched successfully",
      data: userRequests,
    });
  } catch (err) {
    console.error("Error fetching user requests:", err);
    res.status(500).send("Internal server error");
  }
});

userrouter.get("/user/connections", auth, async (req, res) => {
  console.log("Fetching user connections");
  try {
    const loggedInUser = req.user;
    const userConnections = await Connection.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", ["name", "age", "gender", "photo", "bio"])
      .populate("toUserId", ["name", "age", "gender", "photo", "bio"]);

    if (!userConnections || userConnections.length === 0) {
      return res.status(404).send("No user connections found");
    }

    const abc = userConnections.map((x) => {
      if (x.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return x.toUserId;
      } else {
        return x.fromUserId;
      }
    });

    res.json({
      message: "User connections fetched successfully",
      data: abc,
    });
  } catch (err) {
    console.error("Error fetching user connections:", err);
    res.status(500).send("Internal server error");
  }
});

userrouter.get("/feed", auth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    // Limit to a maximum of 10 per page
    if (limit > 10) limit = 10;
    const skip = (page - 1) * limit;

    // Only hide users who are connected (accepted) or have pending requests
    const userConnections = await Connection.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideusers = new Set();
    userConnections.forEach((x) => {
      hideusers.add(x.fromUserId);
      hideusers.add(x.toUserId);
    });
    hideusers.add(loggedInUser._id);

    const feeds = await User.find({
      _id: { $nin: Array.from(hideusers) },
    })
      .select("name bio  age gender photo _id  ")
      .skip(skip)
      .limit(limit);
    if (!feeds || feeds.length === 0)
      return res.status(404).send("No feeds available");
    res.json({
      message: "User feed fetched successfully",
      data: feeds,
    });
  } catch (err) {
    console.error("Error fetching feed:", err);
    res.status(500).send("Internal server error");
  }
});

module.exports = userrouter;
