import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";

const clients = new Set<WebSocket>();

export function setupWebsocket(server: Server) {
    const wss = new WebSocketServer({ server, path: "/ws" });

    wss.on("connection", (ws) => {
        console.log("New WebSocket connection");

        clients.add(ws);

        ws.on("close", () => {
            clients.delete(ws);
        });
    });
}

export function broadcastLocationUpdate(vehicle: any) {
    const message = JSON.stringify({
        type: "location_update",
        payload: vehicle,
    });

    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}