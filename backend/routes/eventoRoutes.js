import express from "express";
import EventoController from "../controllers/EventoController.js";
import { verificarAuth } from '../middleware/auth.js'

const router = express.Router();

router.post("/", verificarAuth, EventoController.crearEvento);
router.get("/", EventoController.obtenerEventos);
router.get("/:id", EventoController.obtenerEventoPorId);
router.put("/:id", verificarAuth, EventoController.actualizarEvento);
router.delete("/:id", verificarAuth, EventoController.eliminarEvento);



export default router;
