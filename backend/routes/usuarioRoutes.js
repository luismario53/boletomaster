// routes/usuarioRoutes.js
import express from 'express'
import UsuarioController from '../controllers/UsuarioController.js'
import { verificarAuth, verificarRol } from '../middleware/auth.js'
import { rolesPermitidos } from '../utils/rolesPermitidos.js'

const router = express.Router()

router.post('/', verificarAuth, verificarRol(rolesPermitidos), UsuarioController.crear)
router.get('/', verificarAuth, verificarRol(rolesPermitidos), UsuarioController.obtenerTodos)
router.get('/:id', UsuarioController.obtenerPorId)
router.put('/:id', verificarAuth, UsuarioController.actualizar)
router.delete('/:id', verificarAuth,UsuarioController.eliminar)
router.get('/tipo/:tipo',  verificarAuth, verificarRol(rolesPermitidos), UsuarioController.obtenerPorTipo)

export default router
