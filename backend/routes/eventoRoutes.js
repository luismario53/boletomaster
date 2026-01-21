import express from "express";
import EventoController from "../controllers/EventoController.js";
import { verificarAuth, verificarRol } from '../middleware/auth.js';

const router = express.Router();

// 1. CREAR (Protegido)
router.post("/", 
    verificarAuth, 
    verificarRol(['ADMIN', 'ORGANIZADOR']), 
    EventoController.crearEvento
);

// 2. LEER (Públicos)
router.get("/", EventoController.obtenerEventos);
router.get("/:id", EventoController.obtenerEventoPorId);

// === NUEVA RUTA PARA EL PERFIL DEL ARTISTA ===
router.get("/artista/:idArtista", EventoController.obtenerEventosPorArtista);

// 3. ACTUALIZAR (Protegido)
router.put("/:id", 
    verificarAuth, 
    verificarRol(['ADMIN', 'ORGANIZADOR']), 
    EventoController.actualizarEvento
);

// 4. ELIMINAR (Protegido)
router.delete("/:id", 
    verificarAuth, 
    verificarRol(['ADMIN', 'ORGANIZADOR']), 
    EventoController.eliminarEvento
);

export default router;