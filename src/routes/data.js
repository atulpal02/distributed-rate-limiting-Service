const express = require("express");
const rateLimiter = require("../middleware/rateLimiter");

const router = express.Router();
console.log(typeof rateLimiter);

router.get("/data", rateLimiter, (req, res) => {
  res.json({ message: "Success" });
});

module.exports = router;