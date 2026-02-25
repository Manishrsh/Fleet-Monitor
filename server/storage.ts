import { db } from "./db";
import {
  vehicles,
  type Vehicle,
  type InsertVehicle,
  type UpdateVehicleRequest,
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getVehicles(): Promise<Vehicle[]>;
  getVehicleByImei(imei: string): Promise<Vehicle | undefined>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicleLocation(imei: string, updates: UpdateVehicleRequest): Promise<Vehicle>;
}

export class DatabaseStorage implements IStorage {
  async getVehicles(): Promise<Vehicle[]> {
    return await db.select().from(vehicles);
  }

  async getVehicleByImei(imei: string): Promise<Vehicle | undefined> {
    const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.imei, imei));
    return vehicle;
  }

  async createVehicle(insertVehicle: InsertVehicle): Promise<Vehicle> {
    const [vehicle] = await db.insert(vehicles).values(insertVehicle).returning();
    return vehicle;
  }

  async updateVehicleLocation(imei: string, updates: UpdateVehicleRequest): Promise<Vehicle> {
    const [updated] = await db.update(vehicles)
      .set(updates)
      .where(eq(vehicles.imei, imei))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
