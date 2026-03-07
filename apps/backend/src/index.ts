import express from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import { serveStatic } from "./platform/static";

const app = express();
const httpServer = createServer(app);

app.use(express.json());

async function startServer() {

  registerRoutes(httpServer, app);

  if (process.env.NODE_ENV === "production") {

    serveStatic(app);

  } else {

    const { setupVite } = await import("./platform/vite");
    await setupVite(httpServer, app);

  }

  httpServer.listen(5001, "0.0.0.0", () => {
    console.log("Server running on port 5001");
  });

}

startServer();