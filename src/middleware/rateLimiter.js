const getTierFromApiKey = require("../utils/getTier");
const { redisClient } = require("../redis/client");
const RATE_LIMITS = require("../config/limits");

const LUA_SCRIPT = `
local tokens_key = KEYS[1]
local capacity = tonumber(ARGV[1])
local refill_rate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])

local data = redis.call("HMGET", tokens_key, "tokens", "last_refill")
local tokens = tonumber(data[1]) or capacity
local last_refill = tonumber(data[2]) or now

-- Refill tokens
local elapsed = now - last_refill
local refill_amount = math.floor(elapsed * refill_rate)
tokens = math.min(tokens + refill_amount, capacity)

if tokens > 0 then
  -- Consume a token
  tokens = tokens - 1
  redis.call("HMSET", tokens_key, "tokens", tokens, "last_refill", now)
  return 1
else
  -- No tokens left
  redis.call("HMSET", tokens_key                        
    , "tokens", tokens, "last_refill", now)
  return 0
end
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

  const ip = req.ip;

  const keys = {
    api: `rate_limit:api:${apiKey}`,
    ip: `rate_limit:ip:${ip}`,
    global: `rate_limit:global`
  };

  const now = Math.floor(Date.now() / 1000);

  async function checkLimit(key, limit) {
    return Number(
      await redisClient.eval(LUA_SCRIPT, {
        keys: [key],
        arguments: [
          limit.capacity.toString(),
          limit.refillRate.toString(),
          now.toString()
        ]
      })
    );
  }

  try {
    // 1. Global limit
    const globalAllowed = await checkLimit(keys.global, RATE_LIMITS.global);
    if (!globalAllowed) {
      return res.status(429).json({ error: "Global rate limit exceeded" });
    }

    // 2. IP limit
    const ipAllowed = await checkLimit(keys.ip, RATE_LIMITS.ip);
    if (!ipAllowed) {
      return res.status(429).json({ error: "IP rate limit exceeded" });
    }

    // 3. API key limit
    const apiAllowed = await checkLimit(keys.api, RATE_LIMITS[tier]);
    if (!apiAllowed) {
      return res.status(429).json({
        error: "API rate limit exceeded",
        tier
      });
    }

    next();
  } catch (err) {
    console.error("Rate limiter error:", err);
    return res.status(500).json({ error: "Rate limiter failure" });
  }
}

module.exports = rateLimiter;