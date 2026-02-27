import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "../data/storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { WebSocketServer, WebSocket } from "ws";
import { startTcpListener } from "../tracking/tcpListener";

const clients = new Set<WebSocket>();

export function broadcastLocationUpdate(vehicle: any) {
  const message = JSON.stringify({ type: 'location_update', payload: vehicle });
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
    clients.add(ws);
    
    ws.on('close', () => {
      clients.delete(ws);
    });
  });

  app.get(api.vehicles.list.path, async (req, res) => {
    const vehicles = await storage.getVehicles();
    res.json(vehicles);
  });

  app.put(api.vehicles.updateLocation.path, async (req, res) => {
    try {
      const imei = req.params.imei;
      const input = api.vehicles.updateLocation.input.parse(req.body);
      
      let vehicle = await storage.getVehicleByImei(imei);
      
      const updateData = {
        lat: String(input.lat),
        lng: String(input.lng),
        speed: input.speed ? String(input.speed) : undefined,
        battery: input.battery ? String(input.battery) : undefined,
        altitude: input.altitude ? String(input.altitude) : undefined,
        timestamp: input.timestamp ? new Date(input.timestamp) : new Date(),
      };
      
      if (vehicle) {
        vehicle = await storage.updateVehicleLocation(imei, updateData);
      } else {
        vehicle = await storage.createVehicle({
          imei,
          lat: updateData.lat,
          lng: updateData.lng,
          speed: updateData.speed || "0",
          battery: updateData.battery || "100",
          altitude: updateData.altitude || "0",
          timestamp: updateData.timestamp
        });
      }
      
      broadcastLocationUpdate(vehicle);
      res.status(200).json(vehicle);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  startTcpListener();
  
  seedDatabase().catch(console.error);

  return httpServer;
}

async function seedDatabase() {
  const existing = await storage.getVehicles();
  if (existing.length === 0) {
    await storage.createVehicle({
      imei: "860738079276675",
      lat: "18.465794",
      lng: "73.782791",
      speed: "45",
      battery: "90",
      altitude: "100",
      timestamp: new Date()
    });
    await storage.createVehicle({
      imei: "860738079276676",
      lat: "18.520430",
      lng: "73.856743",
      speed: "0",
      battery: "85",
      altitude: "95",
      timestamp: new Date()
    });
  }
}
