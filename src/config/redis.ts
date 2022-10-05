import { createClient } from "redis";

const client = createClient();

client.on("error", (err) => console.log("Redis Client Error", err));

(async () => {
  await client.connect();
  console.log("Cache is connected and ready");
})();

export default client;
