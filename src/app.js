const express = require("express");
const dataRoutes = require("./routes/data");
const { client } = require("./metrics/metrics");



const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.use("/api", dataRoutes);

module.exports = app;