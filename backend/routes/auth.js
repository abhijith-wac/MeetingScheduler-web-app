const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }


    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { sub: googleId, name, email, picture } = payload; // `sub` is the Google ID

    if (!googleId || !email) {
      return res.status(400).json({ error: "Invalid Google token" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ googleId, name, email, avatar: picture }); // ✅ Include googleId
      await user.save();
    } else {
    }

    const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ user, token: authToken });

  } catch (error) {
    console.error("❌ Google login error:", error);
    res.status(500).json({ error: "Authentication failed", details: error.message });
  }
});


module.exports = router;
