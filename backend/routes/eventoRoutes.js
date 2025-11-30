import express from "express";
import EventoController from "../controllers/EventoController.js";

const router = express.Router();

router.post("/", EventoController.crearEvento);
router.get("/", EventoController.obtenerEventos);
router.get("/:id", EventoController.obtenerEventoPorId);
router.put("/:id", EventoController.actualizarEvento);
router.delete("/:id", EventoController.eliminarEvento);




export default router;
