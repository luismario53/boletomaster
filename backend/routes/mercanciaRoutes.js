// routes/usuarioRoutes.js
import express from 'express'
import MercanciaController from '../controllers/MercanciaController.js'
import { verificarAuth, verificarRol } from '../middleware/auth.js'
import { rolesPermitidos } from '../utils/rolesPermitidos.js'

const router = express.Router()

router.post('/', verificarAuth, verificarRol(rolesPermitidos), MercanciaController.crearMercancia)
router.get('/', MercanciaController.obtenerTodaLaMercancia)
router.get('/:id', MercanciaController.obtenerMercanciaPorId)
router.put('/:id', MercanciaController.actualizarMercancia)
router.delete('/:id', verificarAuth, verificarRol(rolesPermitidos), MercanciaController.eliminarMercancia)
router.get('/artista/:artista', verificarAuth, verificarRol(rolesPermitidos), MercanciaController.obtenerMercanciaPorArtista)

export default router
