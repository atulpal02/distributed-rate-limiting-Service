import http from "k6/http";
import { sleep } from "k6";

export default function () {
  http.get("http://host.docker.internal:3000/api/data", {
    headers: {
      "x-api-key": "sk_pro_123"
    }
  });

  sleep(0.2); // 5 requests/sec per user
}

// import http from "k6/http";

// export default function () {
//   http.get("http://host.docker.internal:3000/api/data", {
//     headers: {
//       "x-api-key": "sk_pro_123"
//     }
//   });
// }