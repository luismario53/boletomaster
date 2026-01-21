import express from "express";
import GaleriaController from "../controllers/GaleriaController.js"; // Fíjate que ahora importamos el objeto directo
import { verificarAuth, verificarRol } from '../middleware/auth.js';

const router = express.Router();

// 1. CREAR (Protegido)
router.post("/", 
    verificarAuth, 
    // AGREGAMOS 'ORGANIZADOR'
    verificarRol(['ADMIN', 'ADMINISTRADOR', 'ORGANIZADOR']), 
    GaleriaController.crearGaleria
);

// 2. LEER (Público)
router.get("/", GaleriaController.obtenerGalerias);
router.get("/:id", GaleriaController.obtenerGaleriaPorId);

// 3. ACTUALIZAR (Protegido)
router.put("/:id", 
    verificarAuth, 
    verificarRol(['ADMIN', 'ADMINISTRADOR', 'ORGANIZADOR']), 
    GaleriaController.actualizarGaleria
);

// 4. ELIMINAR (Protegido)
router.delete("/:id", 
    verificarAuth, 
    verificarRol(['ADMIN', 'ADMINISTRADOR', 'ORGANIZADOR']), 
    GaleriaController.eliminarGaleria
);

export default router;