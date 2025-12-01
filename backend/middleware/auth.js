// middlewares/auth.js
import { verificarToken } from '../utils/jwtUtils.js'

/**
 * Middleware para verificar JWT en rutas protegidas
 */
export const verificarAuth = (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        mensaje: 'Acceso denegado. Token no proporcionado.'
      })
    }

    // Extraer el token (quitar "Bearer ")
    const token = authHeader.split(' ')[1]

    // Verificar y decodificar token
    const decoded = verificarToken(token)

    // Adjuntar datos del usuario al request
    req.usuario = decoded

    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ mensaje: 'Token expirado' })
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ mensaje: 'Token inválido' })
    }
    return res.status(401).json({ mensaje: 'Error de autenticación' })
  }
}

/**
 * Middleware para verificar roles específicos
 * @param  {...string} rolesPermitidos - Roles que pueden acceder
 * 
 * Uso: verificarRol('admin', 'organizador')
 */
export const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    // Verificar que el usuario esté autenticado
    if (!req.usuario) {
      return res.status(401).json({
        mensaje: 'No autenticado'
      })
    }

    // Verificar que tenga un rol permitido
    if (!rolesPermitidos.includes(req.usuario.tipoUsuario)) {
      return res.status(403).json({
        mensaje: 'No tienes permisos para realizar esta acción'
      })
    }

    next()
  }
}

/**
 * Middleware opcional - permite acceso sin token pero adjunta usuario si existe
 * Útil para rutas que funcionan diferente si el usuario está logueado
 */
export const authOpcional = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      const decoded = verificarToken(token)
      req.usuario = decoded
    } else {
      req.usuario = null
    }

    next()
  } catch (error) {
    // Si el token es inválido, continuar sin usuario
    req.usuario = null
    next()
  }
}