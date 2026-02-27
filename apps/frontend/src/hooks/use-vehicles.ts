import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { api } from "@shared/routes";
import type { Vehicle } from "@shared/schema";

// Custom hook to fetch vehicles with auto-refresh every 15s
export function useVehicles() {
  return useQuery({
    queryKey: [api.vehicles.list.path],
    queryFn: async () => {
      const res = await fetch(api.vehicles.list.path);
      if (!res.ok) {
        throw new Error("Failed to fetch vehicles");
      }
      return (await res.json()) as Vehicle[];
    },
    // Auto refresh vehicle location every 15 seconds
    refetchInterval: 15000,
  });
}

// WebSocket hook for realtime location updates
export function useVehicleWebSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Determine WS protocol based on current HTTP protocol
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    let socket: WebSocket | null = null;
    let reconnectTimer: NodeJS.Timeout;

    const connect = () => {
      socket = new WebSocket(wsUrl);

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'location_update' && data.payload) {
            const updatedVehicle = data.payload as Vehicle;
            
            // Optimistically update the query cache with the new location
            queryClient.setQueryData(
              [api.vehicles.list.path], 
              (oldData: Vehicle[] | undefined) => {
                if (!oldData) return [updatedVehicle];
                
                // Replace the existing vehicle or add it if new
                const exists = oldData.some(v => v.imei === updatedVehicle.imei);
                if (exists) {
                  return oldData.map(v => 
                    v.imei === updatedVehicle.imei ? { ...v, ...updatedVehicle } : v
                  );
                } else {
                  return [...oldData, updatedVehicle];
                }
              }
            );
          }
        } catch (e) {
          console.error("Failed to parse WebSocket message:", e);
        }
      };

      socket.onclose = () => {
        // Attempt to reconnect after 5 seconds
        reconnectTimer = setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      if (socket) {
        socket.onclose = null; // Prevent reconnect on unmount
        socket.close();
      }
    };
  }, [queryClient]);
}
