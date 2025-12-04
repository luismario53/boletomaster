// routes/usuarioRoutes.js
import express from 'express'
import UsuarioController from '../controllers/UsuarioController.js'
import { verificarAuth, verificarRol } from '../middleware/auth.js'
import { rolesPermitidos } from '../utils/rolesPermitidos.js'

const router = express.Router()

// Rutas Administrativas (Se quedan protegidas)
router.post('/', verificarAuth, verificarRol(rolesPermitidos), UsuarioController.crear)
router.get('/', verificarAuth, verificarRol(rolesPermitidos), UsuarioController.obtenerTodos)

// Rutas de Usuario Específico
router.get('/:id', UsuarioController.obtenerPorId) // Esta ya era pública
router.put('/:id', verificarAuth, UsuarioController.actualizar)
router.delete('/:id', verificarAuth, UsuarioController.eliminar)

// === CORRECCIÓN AQUÍ ===
// Eliminamos verificarAuth y verificarRol para que el público vea los artistas
router.get('/tipo/:tipo', UsuarioController.obtenerPorTipo) 

export default router