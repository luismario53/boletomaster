import express from 'express'
import OrdenController from '../controllers/OrdenController.js'
import { verificarAuth, verificarRol } from '../middleware/auth.js';

const router = express.Router()

// callbacks de PayPal
router.get('/paypal/capture', OrdenController.capturarPago)


router.post('/', verificarAuth, OrdenController.crearOrden)
// router.post('/:id/items', OrdenController.agregarItemsAVenta)
router.get('/', OrdenController.obtenerOrdenes)
router.get('/:id', OrdenController.obtenerOrdenPorId)
router.put('/:id', OrdenController.actualizarOrden)
router.delete('/:id', OrdenController.eliminarOrden)


export default router
