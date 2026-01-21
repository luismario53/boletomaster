// routes/authRoutes.js
import { Router } from 'express'
import AuthController from '../controllers/AuthController.js'

const router = Router()

// ========================
// Rutas públicas
// ========================

// POST /api/auth/register  <--- AGREGAR ESTO
router.post('/register', AuthController.register)

// POST /api/auth/login
router.post('/login', AuthController.login)

// POST /api/auth/refresh
router.post('/refresh', AuthController.refreshToken)

export default router