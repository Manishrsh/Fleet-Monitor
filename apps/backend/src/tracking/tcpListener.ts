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

      const imei = parts[0].replace("$SLU", "").trim();

      const eventId = parts[1];
      const messageRef = parts[2];

      const deviceTime = parts[3];
      const gpsStatus = parts[4];
      const gpsTime = parts[5];

      const lat = parts[6];
      const lng = parts[7];
      const speed = parts[8];

      const odometer = parts[9];
      const heading = parts[10];
      const altitude = parts[11];

      const ignition = parts[12];
      const engine = parts[13];

      console.log({
        imei,
        lat,
        lng,
        speed,
        ignition,
        engine
      });

      if (!imei || !lat || !lng) return;

      let vehicle = await storage.getVehicleByImei(imei);

      if (vehicle) {

        vehicle = await storage.updateVehicleLocation(imei, {
          lat,
          lng,
          speed,
          altitude,
          timestamp: new Date(gpsTime)
        });

      } else {

        vehicle = await storage.createVehicle({
          imei,
          lat,
          lng,
          speed,
          altitude,
          battery: "100",
          timestamp: new Date(gpsTime)
        });

      }

      broadcastLocationUpdate(vehicle);

    });

  });

  server.listen(5000, "0.0.0.0", () => {
    console.log("TCP Listener running on 5000");
  });

}