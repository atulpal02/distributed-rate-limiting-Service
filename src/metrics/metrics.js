const client = require("prom-client");

// collect default metrics (CPU, memory, etc.)
client.collectDefaultMetrics();

// Total requests
const totalRequests = new client.Counter({
  name: "http_requests_total",
  help: "Total number of requests"
});

// Rate limited requests
const rateLimitedRequests = new client.Counter({
  name: "rate_limited_requests_total",
  help: "Total number of rate limited requests",
  labelNames: ["type"] // global / ip / api
});

// Requests per tier
const tierRequests = new client.Counter({
  name: "tier_requests_total",
  help: "Requests per API tier",
  labelNames: ["tier"]
});

// Request latency
const requestLatency = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Request latency",
  buckets: [0.005, 0.01, 0.05, 0.1, 0.5]
});

module.exports = {
  client,
  totalRequests,
  rateLimitedRequests,
  tierRequests,
  requestLatency
};