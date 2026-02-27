import { pgTable, text, serial, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  imei: text("imei").notNull().unique(),
  lat: numeric("lat").notNull(),
  lng: numeric("lng").notNull(),
  speed: numeric("speed"),
  battery: numeric("battery"),
  altitude: numeric("altitude"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertVehicleSchema = createInsertSchema(vehicles).omit({ id: true });
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Vehicle = typeof vehicles.$inferSelect;
export type UpdateVehicleRequest = Partial<InsertVehicle>;
