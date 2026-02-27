# Quick Start Guide

## Project Layout
- Frontend: `apps/frontend`
- Backend: `apps/backend/src`
- Shared contracts/types: `packages/shared`

## To Run the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database (if local PostgreSQL)
```bash
# Create .env file with:
DATABASE_URL=postgresql://username:password@localhost:5432/fleet_tracker

# Push schema
npm run db:push
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open Browser
```
http://localhost:5000
```

**You should see:**
- Vehicle list on the left (with search box)
- Interactive Leaflet map on the right
- Real-time vehicle location updates
- Click any vehicle to pan the map

---

## To Test TCP Listener

Send a message via TCP to port 5001:

```powershell
# PowerShell
$tcpClient = New-Object Net.Sockets.TcpClient "localhost", 5001
$networkStream = $tcpClient.GetStream()
$writer = New-Object System.IO.StreamWriter $networkStream
$writer.WriteLine('$1,AEPL,0.0.1,NR,2,H,860738079276675,data,18.465794,N,73.782791,E,more,data')
$writer.Flush()
$tcpClient.Close()
```

**The map will update in real-time!**

---

## What's Already Implemented ✅

✅ TCP Listener on port 5001 - parses IoT device messages
✅ PostgreSQL database - stores IMEI, location, battery, speed, altitude, timestamp
✅ REST API - GET /api/vehicles and PUT /api/vehicles/:imei/location
✅ React Dashboard - split view with vehicle list and interactive map
✅ Real-time Updates - WebSocket + fallback polling
✅ Error Handling - graceful API failure display
✅ TypeScript - type-safe throughout
✅ Clean Code - modular, separated concerns

---

## For Interview Deployment

### Option 1: AWS EC2
1. Launch Ubuntu instance
2. Install Node.js and PostgreSQL
3. Clone repo, install dependencies
4. Set DATABASE_URL environment variable
5. Run `npm run build && npm start`
6. Share IP:5000 with interviewer

### Option 2: Azure App Service
1. Create App Service with Node.js
2. Create PostgreSQL database
3. Set DATABASE_URL in app settings
4. Deploy with git push or GitHub Actions
5. URL: https://your-app.azurewebsites.net

### Option 3: DigitalOcean
1. Create Droplet (Ubuntu)
2. Create PostgreSQL database
3. Deploy app same way as AWS
4. Share IP:5000

---

## Troubleshooting

**Port 5001 already in use?**
```bash
netstat -ano | findstr :5001
taskkill /PID <PID> /F
npm run dev
```

**Database error?**
- Check DATABASE_URL in .env
- Ensure PostgreSQL is running
- Try: `npm run db:push`

**Map not showing vehicles?**
- Check browser console (F12) for errors
- Try sending test data via TCP listener
- Verify API is returning data: `curl http://localhost:5000/api/vehicles`

**WebSocket not connecting?**
- Check if frontend shows error banner
- WebSocket will fall back to 15s polling automatically
- Check Network tab (F12) for /ws connection

---

## Assignment Checklist ✅

- [x] STEP 1: TCP Listener on port 5001, parses IoT message format
- [x] STEP 2: PostgreSQL database with IMEI, location, telemetry
- [x] STEP 3: REST API endpoints (GET /api/vehicles, PUT /api/vehicles/:imei/location)
- [x] STEP 4: React dashboard with split view, real-time updates
- [x] Code quality - modular, typed, clean
- [x] Error handling - user-friendly error UI
- [x] Architecture - RESTful, WebSocket, TCP, database
- [x] GitHub ready - removed Replit markers

**Status: 100% Complete** ✅
