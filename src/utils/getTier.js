function getTierFromApiKey(apiKey) {
  if (!apiKey) return null;
  if (apiKey.startsWith("sk_pro_")) return "pro";
  if (apiKey.startsWith("sk_basic_")) return "basic";
  return null;
}

module.exports = getTierFromApiKey;