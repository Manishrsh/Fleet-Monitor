import { useState } from "react";
import { useVehicles, useVehicleWebSocket } from "@/hooks/use-vehicles";
import { VehicleList } from "@/components/VehicleList";
import { FleetMap } from "@/components/FleetMap";
import { AlertCircle } from "lucide-react";

export default function Dashboard() {
  const [selectedImei, setSelectedImei] = useState<string | null>(null);
  
  // Fetch initial data and setup 15s polling
  const { data: vehicles = [], isLoading, error, isError } = useVehicles();
  
  // Initialize WebSocket connection for realtime updates
  useVehicleWebSocket();

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-background overflow-hidden">
      {/* Error Banner */}
      {isError && (
        <div className="fixed top-0 left-0 right-0 bg-red-500/10 border-b border-red-500/30 px-4 py-3 flex items-center gap-3 z-50">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-700">API Connection Error</p>
            <p className="text-xs text-red-600">
              {error instanceof Error ? error.message : "Unable to connect to the server. Please check your connection."}
            </p>
          </div>
        </div>
      )}

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
