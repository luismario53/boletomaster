// routes/authRoutes.js
import { Router } from 'express'
import AuthController from '../controllers/AuthController.js'

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


export default router