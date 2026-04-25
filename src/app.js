const express = require("express");
const dataRoutes = require("./routes/data");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", dataRoutes);

module.exports = app;