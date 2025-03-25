const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
  try {
    console.log("Received Google token from frontend:", req.body.token);

    const { token } = req.body;

    if (!token) {
      console.error("No token received.");
      return res.status(400).json({ error: "Token is required" });
    }

    // Verify Google token
    console.log("Verifying Google token...");
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    console.log("Google token verified successfully");

    const payload = ticket.getPayload();
    console.log("Decoded Google token payload:", payload);

    const { sub: googleId, name, email, picture } = payload; // `sub` is the Google ID

    if (!googleId || !email) {
      console.error("Invalid token payload:", { googleId, email });
      return res.status(400).json({ error: "Invalid Google token" });
    }

    console.log("Searching for user with email:", email);
    let user = await User.findOne({ email });

    if (!user) {
      console.log("User not found. Creating a new user...");

      user = new User({ googleId, name, email, avatar: picture }); // ✅ Include googleId
      await user.save();

      console.log("New user created:", user);
    } else {
      console.log("User found:", user);
    }

    const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log("JWT Token generated:", authToken);

    res.json({ user, token: authToken });
    console.log("Response sent to frontend");
  } catch (error) {
    console.error("❌ Google login error:", error);
    res.status(500).json({ error: "Authentication failed", details: error.message });
  }
});

module.exports = router;
