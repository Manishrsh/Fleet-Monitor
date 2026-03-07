import * as net from "net";
import { storage } from "../data/storage";
import { broadcastLocationUpdate } from "../websocket/websocket.server";

export function startTcpListener() {

  const server = net.createServer((socket) => {

    console.log("TCP Client connected");

    socket.on("data", async (data) => {

      const message = data.toString().trim();

      if (!message.startsWith("$SLU")) return;

      const parts = message.split(",");

      const imei = parts[0].replace("$SLU", "");
      const lat = parts[6];
      const lng = parts[7];
      const speed = parts[8] || "0";

      if (!imei || !lat || !lng) return;

      let vehicle = await storage.getVehicleByImei(imei);

      if (vehicle) {

        vehicle = await storage.updateVehicleLocation(imei, {
          lat,
          lng,
          timestamp: new Date()
        });

      } else {

        vehicle = await storage.createVehicle({
          imei,
          lat,
          lng,
          speed,
          battery: "100",
          altitude: "0",
          timestamp: new Date()
        });

      }

      broadcastLocationUpdate(vehicle);

    });

  });

  server.listen(5000, "0.0.0.0", () => {
    console.log("TCP Listener running on 5000");
  });

}