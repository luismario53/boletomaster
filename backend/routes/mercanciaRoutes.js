import express from 'express';
// Importamos el objeto literal que acabamos de crear
import MercanciaController from '../controllers/MercanciaController.js'; 
import { verificarAuth, verificarRol } from '../middleware/auth.js';

const router = express.Router();

// 1. CREAR (POST) - Protegido para ADMIN y ORGANIZADOR
router.post('/', 
    verificarAuth, 
    verificarRol(['ADMIN', 'ADMINISTRADOR', 'ORGANIZADOR']), 
    MercanciaController.crearMercancia
);

// 2. LEER (GET) - Públicos
router.get('/', MercanciaController.obtenerTodaLaMercancia);
router.get('/:id', MercanciaController.obtenerMercanciaPorId);

// 3. ACTUALIZAR (PUT) - Protegido
router.put('/:id', 
    verificarAuth, 
    verificarRol(['ADMIN', 'ADMINISTRADOR', 'ORGANIZADOR']), 
    MercanciaController.actualizarMercancia
);

// 4. ELIMINAR (DELETE) - Protegido
router.delete('/:id', 
    verificarAuth, 
    verificarRol(['ADMIN', 'ADMINISTRADOR', 'ORGANIZADOR']), 
    MercanciaController.eliminarMercancia
);

// 5. POR ARTISTA (GET) - Público (normalmente no necesita auth para ver productos de un artista)
// Nota: cambié el parámetro a :artista para coincidir con el controlador
router.get('/artista/:artista', MercanciaController.obtenerMercanciaPorArtista);

export default router;