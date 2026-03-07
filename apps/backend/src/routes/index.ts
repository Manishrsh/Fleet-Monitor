import { Express } from "express";
import { Server } from "http";
import { setupWebsocket } from "../websocket/websocket.server";
import { startTcpListener } from "../tracking/tcpListener";

export function registerRoutes(server: Server, app: Express) {

    setupWebsocket(server);

    startTcpListener();

}