const express = require("express");
const rateLimiter = require("../middleware/rateLimiter");

const router = express.Router();

router.get("/data", rateLimiter, (req, res) => {
  res.json({ message: "Success" });
});

module.exports = router;