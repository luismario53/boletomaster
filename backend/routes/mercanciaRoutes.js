// routes/usuarioRoutes.js
import express from 'express'
import MercanciaController from '../controllers/MercanciaController.js'
import { verificarAuth } from '../middleware/auth.js'

const router = express.Router()

router.post('/', verificarAuth, MercanciaController.crearMercancia)
router.get('/', MercanciaController.obtenerTodaLaMercancia)
router.get('/:id', MercanciaController.obtenerMercanciaPorId)
router.put('/:id', MercanciaController.actualizarMercancia)
router.delete('/:id', verificarAuth, MercanciaController.eliminarMercancia)
router.get('/artista/:artista', verificarAuth, MercanciaController.obtenerMercanciaPorArtista)

export default router
