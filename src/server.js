require("dotenv").config();
const app = require("./app");
const { connectRedis } = require("./redis/client");

const PORT = process.env.PORT || process.argv[2] || 3000;
async function start() {
  await connectRedis();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});