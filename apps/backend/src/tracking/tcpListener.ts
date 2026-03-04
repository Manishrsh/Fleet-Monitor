import * as net from 'net';
import { storage } from '../data/storage';
import { broadcastLocationUpdate } from '../http/routes';

export function startTcpListener() {
  const PORT = 5000;

  const server = net.createServer((socket) => {
    console.log('TCP Client connected:', socket.remoteAddress, socket.remotePort);

    socket.on('data', async (data) => {
      const message = data.toString().trim();
      console.log('TCP Received:', message);

      try {

        // Ignore non SLU packets
        if (!message.startsWith('$SLU')) return;

        const parts = message.split(',');

        // Extract IMEI
        const imei = parts[0].replace('$SLU', '');

        // Extract GPS data
        const lat = parts[6];
        const lng = parts[7];
        const speed = parts[8] || "0";

        console.log("Parsed Data:", { imei, lat, lng, speed });

        if (!imei || !lat || !lng) return;

        const updateData = {
          imei,
          lat,
          lng,
          speed,
          battery: "100",
          timestamp: new Date()
        };

        let vehicle = await storage.getVehicleByImei(imei);

        if (vehicle) {

          vehicle = await storage.updateVehicleLocation(imei, {
            lat: updateData.lat,
            lng: updateData.lng,
            timestamp: updateData.timestamp
          });

        } else {

          vehicle = await storage.createVehicle({
            imei: updateData.imei,
            lat: updateData.lat,
            lng: updateData.lng,
            speed: updateData.speed,
            battery: updateData.battery,
            altitude: "0",
            timestamp: updateData.timestamp
          });

        }

        broadcastLocationUpdate(vehicle);

      } catch (err) {
        console.error('Error processing TCP message:', err);
      }
    });

    socket.on('end', () => {
      console.log('TCP Client disconnected');
    });

    socket.on('error', (err) => {
      console.error('TCP Socket error:', err);
    });

  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`TCP Listener running on port ${PORT}`);
  });

  return server;
}