import express from "express";
import GaleriaController from "../controllers/GaleriaController.js";
import { verificarAuth, verificarRol } from '../middleware/auth.js'
import { rolesPermitidos } from '../utils/rolesPermitidos.js'

const router = express.Router();

router.post("/", verificarAuth, verificarRol(rolesPermitidos), GaleriaController.crearGaleria);
router.get("/", GaleriaController.obtenerGalerias);
router.get("/:id", GaleriaController.obtenerGaleriaPorId);
router.put("/:id", verificarAuth, verificarRol(rolesPermitidos), GaleriaController.actualizarGaleria);
router.delete("/:id", verificarAuth, verificarRol(rolesPermitidos), GaleriaController.eliminarGaleria);

export default router;
