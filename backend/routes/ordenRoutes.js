import express from 'express';
import OrdenController from '../controllers/OrdenController.js';
import { verificarAuth } from '../middleware/auth.js';

const router = express.Router();

// 1. CREAR ORDEN (Cliente logueado)
router.post('/', verificarAuth, OrdenController.crearOrden);

// 2. CALLBACKS DE PAYPAL (Públicos)
router.get('/paypal/capture', OrdenController.capturarPago);
router.get('/paypal/cancel', OrdenController.cancelarPago);

// 3. GESTIÓN (Admin/Organizador)
// Si OrdenController.obtenerOrdenes no existe en el archivo anterior, esta línea da el error que tenías.
router.get('/', verificarAuth, OrdenController.obtenerOrdenes);
router.get('/:id', verificarAuth, OrdenController.obtenerOrdenPorId);
router.delete('/:id', verificarAuth, OrdenController.eliminarOrden);

export default router;