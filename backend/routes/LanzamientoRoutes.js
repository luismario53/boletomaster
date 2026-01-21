import express from 'express';
import LanzamientoController from '../controllers/LanzamientoController.js';
import { verificarAuth, verificarRol } from '../middleware/auth.js';

const router = express.Router();

// CREAR (Solo Artistas y Admins)
router.post('/', 
    verificarAuth, 
    verificarRol(['ADMIN', 'ARTISTA']), 
    LanzamientoController.crear
);

// LEER (Público)
router.get('/', LanzamientoController.obtenerTodos);
router.get('/artista/:idArtista', LanzamientoController.obtenerPorArtista);

export default router;