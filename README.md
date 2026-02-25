# Fleet Tracking Application

A full stack fleet tracking dashboard with realtime updates via WebSockets and a raw TCP listener for IoT devices.

## Tech Stack
- **Backend:** Node.js, Express, WebSockets (ws), Drizzle ORM
- **Database:** PostgreSQL
- **Frontend:** React, React Query, Wouter, Tailwind CSS, shadcn/ui
- **Maps:** Leaflet, React Leaflet

## Database Setup
The application uses Replit's built-in PostgreSQL database.
The schema is automatically pushed to the database on start (`npm run db:push`).

If setting up locally or manually, you can use the schema provided in `database_schema.sql` (generated below) or just use Drizzle:
```bash
npm run db:push
```

## How to Run the Frontend & Backend
The project is built on Replit and uses Vite for the frontend and Express for the backend.
To run the entire stack (Frontend + Backend HTTP Server + WebSocket Server + TCP Listener):

```bash
npm run dev
```

The Express server will start on port 5000 (which also serves the Vite frontend in dev mode) and the WebSocket server is attached to it at `/ws`.

## How to Run the TCP Listener
The TCP listener automatically starts along with the backend server on **port 5001**.
(Port 5001 is used because 5000 is used by the main web server).

You can test the TCP listener by sending a raw message using `netcat` or `telnet`:

```bash
nc localhost 5001
$1,AEPL,0.0.1,NR,2,H,860738079276675,some,data,18.465794,N,73.782791,E,more,data
```
The dashboard will instantly update the map marker for that vehicle.

## Installation Steps (Local)
1. Clone the repository
2. `npm install`
3. Set your `DATABASE_URL` in `.env`
4. `npm run db:push`
5. `npm run dev`
