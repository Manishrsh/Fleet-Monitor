import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { Vehicle } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { Navigation2, Battery, Signal, Activity } from "lucide-react";

// Fly to selected vehicle
function MapController({ center, zoom }: { center: [number, number] | null; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
    }
  }, [center, zoom, map]);

  return null;
}

// Custom vehicle marker
const createVehicleIcon = (isMoving: boolean) => {
  const colorClass = isMoving
    ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] border-emerald-200"
    : "bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.8)] border-rose-200";

  return L.divIcon({
    className: "bg-transparent border-0",
    html: `
      <div class="relative flex items-center justify-center w-6 h-6">
        <div class="absolute inset-0 rounded-full opacity-40 animate-ping ${
          isMoving ? "bg-emerald-500" : "bg-rose-500"
        }"></div>
        <div class="relative w-4 h-4 rounded-full border-2 ${colorClass} transition-all duration-500 z-10"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

interface FleetMapProps {
  vehicles: Vehicle[];
  selectedImei: string | null;
  onVehicleSelect: (imei: string) => void;
}

export function FleetMap({ vehicles, selectedImei, onVehicleSelect }: FleetMapProps) {
  const selectedVehicle = useMemo(
    () => vehicles.find((v) => v.imei === selectedImei),
    [vehicles, selectedImei]
  );

  const mapCenter = useMemo<[number, number] | null>(() => {
    if (selectedVehicle && selectedVehicle.lat && selectedVehicle.lng) {
      return [Number(selectedVehicle.lat), Number(selectedVehicle.lng)];
    }
    return null;
  }, [selectedVehicle]);

  const defaultCenter: [number, number] =
    vehicles.length > 0 && vehicles[0].lat
      ? [Number(vehicles[0].lat), Number(vehicles[0].lng)]
      : [20.5937, 78.9629]; // Center of India

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={mapCenter || defaultCenter}
        zoom={selectedImei ? 15 : 5}
        className="w-full h-full"
        zoomControl={false}
        preferCanvas={true}
      >
        {/* Light Map Tile */}
       <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />

        <MapController center={mapCenter} zoom={16} />

        {vehicles.map((vehicle) => {
          if (!vehicle.lat || !vehicle.lng) return null;

          const isMoving = Number(vehicle.speed) > 0;

          return (
            <Marker
              key={vehicle.id}
              position={[Number(vehicle.lat), Number(vehicle.lng)]}
              icon={createVehicleIcon(isMoving)}
              eventHandlers={{
                click: () => onVehicleSelect(vehicle.imei),
              }}
            >
              <Popup minWidth={220}>
                <div className="p-1 text-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isMoving ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    />
                    <h3 className="font-bold text-lg m-0">{vehicle.imei}</h3>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <Activity size={14} /> Status
                      </span>
                      <span
                        className={`font-medium ${
                          isMoving ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {isMoving ? "Moving" : "Stopped"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <Navigation2 size={14} /> Speed
                      </span>
                      <span className="font-mono">
                        {Number(vehicle.speed || 0).toFixed(1)} km/h
                      </span>
                    </div>

                    {vehicle.battery && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-gray-500">
                          <Battery size={14} /> Battery
                        </span>
                        <span className="font-mono">
                          {Number(vehicle.battery).toFixed(0)}%
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2 pt-2 border-t">
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <Signal size={14} /> Updated
                      </span>
                      <span className="text-xs">
                        {vehicle.timestamp
                          ? formatDistanceToNow(new Date(vehicle.timestamp), {
                              addSuffix: true,
                            })
                          : "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}