import express from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";

const app = express();
const server = createServer(app);

app.use(express.json());

registerRoutes(server, app);

server.listen(5001, "0.0.0.0", () => {
  console.log("Server running on port 5001");
});