// routes/usuarioRoutes.js
import express from 'express'
import MercanciaController from '../controllers/MercanciaController.js'

const router = express.Router()

router.post('/', MercanciaController.crearMercancia)
router.get('/', MercanciaController.obtenerTodaLaMercancia)
router.get('/:id', MercanciaController.obtenerMercanciaPorId)
router.put('/:id', MercanciaController.actualizarMercancia)
router.delete('/:id', MercanciaController.eliminarMercancia)
router.get('/artista/:artista', MercanciaController.obtenerMercanciaPorArtista)

export default router
