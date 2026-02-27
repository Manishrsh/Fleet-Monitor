## Packages
leaflet | Map rendering engine
react-leaflet | React components for Leaflet maps
@types/leaflet | TypeScript definitions for Leaflet
date-fns | Formatting relative times for vehicle updates

## Notes
WebSocket connects to /ws for realtime vehicle location updates.
Leaflet requires specific CSS imported in index.css to render correctly.
We use L.divIcon to render custom glowing CSS markers instead of default image pins to avoid asset hashing issues and provide a sleeker look.
