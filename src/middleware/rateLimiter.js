const { redisClient } = require("../redis/client");
const RATE_LIMITS = require("../config/limits");
const getTierFromApiKey = require("../utils/getTier");

const LUA_SCRIPT = `
local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local refillRate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])

local data = redis.call("HMGET", key, "tokens", "lastRefill")
local tokens = tonumber(data[1])
local lastRefill = tonumber(data[2])

if tokens == nil then
  tokens = capacity
  lastRefill = now
end

local delta = math.max(0, now - lastRefill)
local refill = delta * refillRate
tokens = math.min(capacity, tokens + refill)

if tokens < 1 then
  redis.call("HMSET", key, "tokens", tokens, "lastRefill", now)
  return 0
end

tokens = tokens - 1
redis.call("HMSET", key, "tokens", tokens, "lastRefill", now)
redis.call("EXPIRE", key, math.ceil(capacity / refillRate))
return 1
`;

async function rateLimiter(req, res, next) {
  const apiKey = req.header("x-api-key");
  if (!apiKey) {
    return res.status(401).json({ error: "API key required" });
  }

  const tier = getTierFromApiKey(apiKey);
  if (!tier) {
    return res.status(403).json({ error: "Invalid API key" });
  }

  const limit = RATE_LIMITS[tier];
  const redisKey = `rate_limit:${apiKey}`;
  const now = Math.floor(Date.now() / 1000);

  try {
    const allowed = Number(
      await redisClient.eval(LUA_SCRIPT, {
        keys: [redisKey],
        arguments: [
          limit.capacity.toString(),
          limit.refillRate.toString(),
          now.toString()
        ]
      })
    );

    if (allowed === 0) {
      return res.status(429).json({ error: "Rate limit exceeded", tier });
    }

    next();
  } catch (err) {
    console.error("Rate limiter error:", err);
    return res.status(500).json({ error: "Rate limiter failure" });
  }
}

module.exports = rateLimiter;