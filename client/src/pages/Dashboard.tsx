import { useState } from "react";
import { useVehicles, useVehicleWebSocket } from "@/hooks/use-vehicles";
import { VehicleList } from "@/components/VehicleList";
import { FleetMap } from "@/components/FleetMap";

export default function Dashboard() {
  const [selectedImei, setSelectedImei] = useState<string | null>(null);
  
  // Fetch initial data and setup 15s polling
  const { data: vehicles = [], isLoading } = useVehicles();
  
  // Initialize WebSocket connection for realtime updates
  useVehicleWebSocket();

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-background overflow-hidden">
      {/* Left Panel: Vehicle List */}
      <div className="w-full md:w-[400px] h-[45vh] md:h-full flex-shrink-0 z-20 md:z-10 shadow-2xl relative">
        <VehicleList 
          vehicles={vehicles} 
          selectedImei={selectedImei}
          onSelect={setSelectedImei}
          isLoading={isLoading}
        />
      </div>

      {/* Right Panel: Interactive Map */}
      <div className="flex-1 relative h-[55vh] md:h-full z-0">
        <FleetMap 
          vehicles={vehicles}
          selectedImei={selectedImei}
          onVehicleSelect={setSelectedImei}
        />
        
        {/* Subtle vignette for depth */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] z-[400]" />
      </div>
    </div>
  );
}
