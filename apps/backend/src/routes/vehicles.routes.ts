import { Router } from "express";
import { storage } from "../data/storage";
import { broadcastLocationUpdate } from "./websocket";

const router = Router();

router.get("/", async (req, res) => {
    const vehicles = await storage.getVehicles();
    res.json(vehicles);
});

router.put("/:imei/location", async (req, res) => {
    const imei = req.params.imei;

    let vehicle = await storage.getVehicleByImei(imei);

    const data = req.body;

    if (vehicle) {
        vehicle = await storage.updateVehicleLocation(imei, data);
    } else {
        vehicle = await storage.createVehicle({
            imei,
            ...data,
        });
    }

    broadcastLocationUpdate(vehicle);

    res.json(vehicle);
});

export default router;