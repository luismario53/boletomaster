import express from "express";
import EventoController from "../controllers/EventoController.js";
import { verificarAuth, verificarRol } from '../middleware/auth.js'
// import { rolesPermitidos } from '../utils/rolesPermitidos.js' // Ya no es estrictamente necesario aquí

const router = express.Router();

// CAMBIO: Definimos explícitamente ['ADMIN', 'ORGANIZADOR']
router.post("/", 
    verificarAuth, 
    verificarRol(['ADMIN', 'ORGANIZADOR']), 
    EventoController.crearEvento
);

router.get("/", EventoController.obtenerEventos);
router.get("/:id", EventoController.obtenerEventoPorId);

router.put("/:id", 
    verificarAuth, 
    verificarRol(['ADMIN', 'ORGANIZADOR']), 
    EventoController.actualizarEvento
);

router.delete("/:id", 
    verificarAuth, 
    verificarRol(['ADMIN', 'ORGANIZADOR']), 
    EventoController.eliminarEvento
);

export default router;