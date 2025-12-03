import express from "express";
import EventoController from "../controllers/EventoController.js";
import { verificarAuth, verificarRol } from '../middleware/auth.js'
import { rolesPermitidos } from '../utils/rolesPermitidos.js'

const router = express.Router();

router.post("/", verificarAuth, verificarRol(rolesPermitidos), EventoController.crearEvento);
router.get("/", EventoController.obtenerEventos);
router.get("/:id", EventoController.obtenerEventoPorId);
router.put("/:id", verificarAuth, verificarRol(rolesPermitidos), EventoController.actualizarEvento);
router.delete("/:id", verificarAuth, verificarRol(rolesPermitidos), EventoController.eliminarEvento);



export default router;
