// routes/usuarioRoutes.js
import express from 'express'
import UsuarioController from '../controllers/UsuarioController.js'

const router = express.Router()

router.post('/', UsuarioController.crear)
router.get('/', UsuarioController.obtenerTodos)
router.get('/:id', UsuarioController.obtenerPorId)
router.put('/:id', UsuarioController.actualizar)
router.delete('/:id', UsuarioController.eliminar)
router.get('/tipo/:tipo', UsuarioController.obtenerPorTipo)

export default router
