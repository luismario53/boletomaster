import express from 'express'
import OrdenController from '../controllers/OrdenController.js'

const router = express.Router()
router.post('/', OrdenController.crearOrden)
router.post('/:id/items', OrdenController.agregarItemsAVenta)
router.get('/', OrdenController.obtenerOrdenes)
router.get('/:id', OrdenController.obtenerOrdenPorId)
router.put('/:id', OrdenController.actualizarOrden)
router.delete('/:id', OrdenController.eliminarOrden)

export default router
