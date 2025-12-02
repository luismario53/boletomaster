import express from "express";
import GaleriaController from "../controllers/GaleriaController.js";
import { verificarAuth } from '../middleware/auth.js'

const router = express.Router();

router.post("/", verificarAuth, GaleriaController.crearGaleria);
router.get("/", GaleriaController.obtenerGalerias);
router.get("/:id", GaleriaController.obtenerGaleriaPorId);
router.put("/:id", verificarAuth, GaleriaController.actualizarGaleria);
router.delete("/:id", verificarAuth, GaleriaController.eliminarGaleria);

export default router;
