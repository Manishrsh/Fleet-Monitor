import { useMemo, useState } from "react";
import type { Vehicle } from "@shared/schema";
import { Search, MapPin, Navigation, SignalHigh, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface VehicleListProps {
  vehicles: Vehicle[];
  selectedImei: string | null;
  onSelect: (imei: string) => void;
  isLoading: boolean;
}

export function VehicleList({ vehicles, selectedImei, onSelect, isLoading }: VehicleListProps) {
  const [search, setSearch] = useState("");

  const filteredVehicles = useMemo(() => {
    if (!search) return vehicles;
    return vehicles.filter(v => 
      v.imei.toLowerCase().includes(search.toLowerCase())
    );
  }, [vehicles, search]);

  const movingCount = vehicles.filter(v => Number(v.speed) > 0).length;
  const stoppedCount = vehicles.length - movingCount;

  return (
    <div className="flex flex-col h-full bg-card/95 backdrop-blur-xl border-r border-border/50 shadow-2xl">
      {/* Header & Stats */}
      <div className="p-6 border-b border-border/50 bg-gradient-to-b from-slate-800/50 to-transparent">
        <h1 className="text-2xl font-display font-bold text-white tracking-tight flex items-center gap-2 mb-6">
          <Navigation className="text-primary" fill="currentColor" />
          Fleet Command
        </h1>
        
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5">
            <div className="text-2xl font-bold font-mono text-white">{vehicles.length}</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total</div>
          </div>
          <div className="bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/20">
            <div className="text-2xl font-bold font-mono text-emerald-400">{movingCount}</div>
            <div className="text-xs text-emerald-500/70 font-medium uppercase tracking-wider">Moving</div>
          </div>
          <div className="bg-rose-500/10 rounded-xl p-3 border border-rose-500/20">
            <div className="text-2xl font-bold font-mono text-rose-400">{stoppedCount}</div>
            <div className="text-xs text-rose-500/70 font-medium uppercase tracking-wider">Stopped</div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search IMEI..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <SignalHigh className="w-8 h-8 animate-pulse mb-3 opacity-50" />
            <p className="text-sm">Establishing connection...</p>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <MapPin className="w-8 h-8 mb-3 opacity-20" />
            <p className="text-sm">No vehicles found</p>
          </div>
        ) : (
          filteredVehicles.map((vehicle) => {
            const isMoving = Number(vehicle.speed) > 0;
            const isSelected = selectedImei === vehicle.imei;
            
            return (
              <button
                key={vehicle.id}
                onClick={() => onSelect(vehicle.imei)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200 group relative overflow-hidden
                  ${isSelected 
                    ? 'bg-primary/10 border-primary/30 shadow-[0_0_20px_rgba(0,180,255,0.1)]' 
                    : 'bg-slate-800/30 border-white/5 hover:bg-slate-800/60 hover:border-white/10'
                  } border
                `}
              >
                {/* Active Indicator Line */}
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_#00b4ff]" />
                )}

                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${isMoving ? 'bg-emerald-400 text-emerald-400' : 'bg-rose-400 text-rose-400'}`} />
                    <span className="font-display font-bold text-slate-200 tracking-wide">{vehicle.imei}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium tracking-wide uppercase border
                    ${isMoving 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }
                  `}>
                    {isMoving ? 'Moving' : 'Stopped'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mt-3">
                  <div className="flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 opacity-70" />
                    <span className="font-mono">{Number(vehicle.speed || 0).toFixed(1)} <span className="opacity-50 text-[10px]">km/h</span></span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <Clock className="w-3.5 h-3.5 opacity-70" />
                    <span>
                      {vehicle.timestamp ? formatDistanceToNow(new Date(vehicle.timestamp), { addSuffix: true }) : 'N/A'}
                    </span>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
