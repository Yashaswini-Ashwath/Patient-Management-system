/*
Routes for patient operations
*/

import {Router} from "express";
import {authMiddleware} from "../middleware/auth";
import { getPatients, getPatient, createPatient, updatePatient, getHistory } from "../controllers/patient.controller";

const router = Router();

router.get("/", authMiddleware, getPatients);
router.get("/:id", authMiddleware, getPatient);
router.get("/:id/history", authMiddleware, getHistory);
router.post("/", authMiddleware, createPatient);
router.put("/:id", authMiddleware, updatePatient);

export default router;

