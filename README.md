# Distributed Rate Limiting Service

A production-grade distributed rate limiting system built using Node.js, Redis, and Docker, with real-time observability powered by Prometheus and Grafana.

This system enforces multi-level rate limiting (global, IP, API key) using a token bucket algorithm implemented with Redis Lua scripting, ensuring atomic operations under high concurrency.
## Key Features

🔹 Distributed Rate Limiting
- Stateless Node.js instances
- Shared state via Redis
- Consistent throttling across all instances

🔹 Token Bucket Algorithm (Lua Script)
- Atomic operations using Redis Lua scripting
- Prevents race conditions under concurrency
- Supports burst traffic with controlled refill rate

🔹 Multi-Level Throttling
- Global limit → protects entire system
- IP-based limit → prevents abuse from a source
- API key limit → enforces business-tier usage

🔹 Tier-Based Access Control
- Basic and Pro API tiers
- Dynamic limits based on API key

🔹 Horizontal Scalability
- Multiple Node.js instances (Dockerized)
- Stateless design enables easy scaling

🔹 Observability (Production-Grade)
Prometheus metrics:
- Total requests
- Rate-limited requests
- Per-tier traffic
- Request latency
- Grafana dashboards for real-time monitoring

🔹 Load Tested System
- Tested using k6
- Handles ~7K+ requests/sec
- Maintains low latency (~1–7 ms avg)
- Correctly enforces rate limits under load

## Tech Stack

```bash

Backend 	- Node.js, Express
Caching / State	- Redis
Concurrency Control	- Lua scripting (Redis)
Containerization - Docker, Docker Compose
Load Testing	- k6
Monitoring	- Prometheus
Visualization	- Grafana
```


## 📦 Project Structure

```bash

src/
 ├── middleware/
 │    └── rateLimiter.js
 ├── redis/
 │    └── client.js
 ├── routes/
 │    └── data.js
 ├── metrics/
 │    └── metrics.js
 ├── config/
 │    └── limits.js
 ├── utils/
 │    └── getTier.js
 ├── app.js
 └── server.js

docker-compose.yml
Dockerfile
prometheus.yml
load-test.js
```

## 📌 Architecture Overview

```python
Client → Load (k6 / curl)
          ↓
   Node.js App (x3 instances)
          ↓
        Redis (shared state)
          ↓
   Prometheus (metrics scraping)
          ↓
     Grafana (visualization)
```

## 📦 Project Structure

🔹 1. Clone the repository

```bash

git clone https://github.com/your-username/rate-limiter.git
cd rate-limiter

```
🔹 2. Run with Docker

```bash

docker-compose up --build
```

🔹 3. Services

```bash

| Service      | URL                                                            |
| ------------ | -------------------------------------------------------------- |
| API          | [http://localhost:3000](http://localhost:3000)                 |
| Health Check | [http://localhost:3000/health](http://localhost:3000/health)   |
| Metrics      | [http://localhost:3000/metrics](http://localhost:3000/metrics) |
| Prometheus   | [http://localhost:9090](http://localhost:9090)                 |
| Grafana      | [http://localhost:3003](http://localhost:3003)                 |

```

🔹 4. Test API

```bash

curl -H "x-api-key: sk_basic_123" http://localhost:3000/api/data

```


🔹 5. Generate Load

```bash

docker run --rm -i grafana/k6 run --vus 10 --duration 20s - < load-test.js

```

## Performance Insights
- Handles high concurrency (~7K RPS)
- Maintains sub-10ms latency
- Correctly rejects excess traffic using HTTP 429
- No system degradation under load

<img width="1073" height="668" alt="Screenshot 2026-04-25 at 9 01 29 PM" src="https://github.com/user-attachments/assets/4a4f62ee-35cb-45ab-bd45-c7a389578226" />
<img width="1073" height="668" alt="Screenshot 2026-04-25 at 9 02 40 PM" src="https://github.com/user-attachments/assets/db3cb8c0-4a2e-44bc-bc81-249df4679fa9" />
<img width="1073" height="668" alt="Screenshot 2026-04-25 at 9 02 04 PM" src="https://github.com/user-attachments/assets/b953866f-0abf-418e-8bb9-b031de088aa0" />

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
