import * as net from 'net';
import { storage } from './storage';
import { broadcastLocationUpdate } from './routes';

// Example message: $1,AEPL,0.0.1,NR,2,H,860738079276675,...,18.465794,N,73.782791,E,...
export function startTcpListener() {
  let PORT = 5001;
  const server = net.createServer((socket) => {
    console.log('TCP Client connected:', socket.remoteAddress, socket.remotePort);

    socket.on('data', async (data) => {
      const message = data.toString().trim();
      console.log('TCP Received:', message);

      try {
        const parts = message.split(',');
        // Extract IMEI
        let imei = parts[6];
        if (!imei || !/^\d{15}$/.test(imei)) {
          const match = parts.find(p => /^\d{15}$/.test(p));
          if (match) imei = match;
        }

        // Extract lat, lng based on N/S, E/W markers
        let latStr = "0";
        let lngStr = "0";
        for (let i = 0; i < parts.length; i++) {
          if (parts[i] === 'N' || parts[i] === 'S') {
            latStr = parts[i - 1];
            if (parts[i] === 'S') latStr = "-" + latStr;
          }
          if (parts[i] === 'E' || parts[i] === 'W') {
            lngStr = parts[i - 1];
            if (parts[i] === 'W') lngStr = "-" + lngStr;
          }
        }

        if (imei && latStr !== "0" && lngStr !== "0") {
          const updateData = {
            imei,
            lat: latStr,
            lng: lngStr,
            speed: "0",
            battery: "100",
            timestamp: new Date(),
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
        }
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

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${PORT} is already in use, trying ${PORT + 1}...`);
      PORT++;
      setTimeout(() => startTcpListener(), 1000);
    } else {
      console.error('TCP Server error:', err);
    }
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`TCP Listener running on port ${PORT}`);
  });

  return server;
}
