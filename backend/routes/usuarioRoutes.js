// routes/usuarioRoutes.js
import express from 'express'
import UsuarioController from '../controllers/UsuarioController.js'
import { verificarAuth } from '../middleware/auth.js'

const router = express.Router()

router.post('/', verificarAuth, UsuarioController.crear)
router.get('/', UsuarioController.obtenerTodos)
router.get('/:id', UsuarioController.obtenerPorId)
router.put('/:id', verificarAuth, UsuarioController.actualizar)
router.delete('/:id', verificarAuth,UsuarioController.eliminar)
router.get('/tipo/:tipo', UsuarioController.obtenerPorTipo)

export default router
