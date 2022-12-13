import express from "express";
import { deleteDronesById, addDrone, getDronesByOwner, getDronesByType } from "../controllers/droneController.js";

const router = express.Router();

router.post('/add', addDrone);
router.get('/getDronesByType', getDronesByType);
router.get('/getDronesByOwner', getDronesByOwner);
router.delete('/drone_details', deleteDronesById);

export default router;