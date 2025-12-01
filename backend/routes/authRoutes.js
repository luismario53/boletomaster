// routes/authRoutes.js
import { Router } from 'express'
import AuthController from '../controllers/AuthController.js'
import { verificarAuth } from '../middleware/auth.js'

const router = Router()

// ========================
// Rutas públicas
// ========================

// POST /api/auth/login
router.post('/login', AuthController.login)

// POST /api/auth/refresh
router.post('/refresh', AuthController.refreshToken)


// ========================
// Rutas protegidas
// ========================

// GET /api/auth/me - Obtener perfil del usuario autenticado
router.get('/me', verificarAuth, AuthController.perfil)


export default router