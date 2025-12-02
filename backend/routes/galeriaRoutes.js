import express from "express";
import GaleriaController from "../controllers/GaleriaController.js";

const router = express.Router();

router.post("/", GaleriaController.crearGaleria);
router.get("/", GaleriaController.obtenerGalerias);
router.get("/:id", GaleriaController.obtenerGaleriaPorId);
router.put("/:id", GaleriaController.actualizarGaleria);
router.delete("/:id", GaleriaController.eliminarGaleria);

export default router;
