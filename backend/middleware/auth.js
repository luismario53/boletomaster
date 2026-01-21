// middlewares/auth.js
import { verificarToken } from '../utils/jwtUtils.js'

/**
 * Middleware para verificar JWT en rutas protegidas
 */
export const verificarAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        mensaje: 'Acceso denegado. Token no proporcionado.'
      })
    }

    const token = authHeader.split(' ')[1]
    const decoded = verificarToken(token)

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
 * CORREGIDO: Ahora soporta arrays y argumentos sueltos
 */
export const verificarRol = (...rolesArg) => {
  return (req, res, next) => {
    // 1. Verificar autenticación previa
    if (!req.usuario) {
      return res.status(401).json({
        mensaje: 'No autenticado'
      })
    }

    // 2. APLANAR ARRAY (La Solución Mágica ✨)
    // Esto convierte [['ADMIN', 'ORG']] en ['ADMIN', 'ORG']
    const rolesPermitidos = rolesArg.flat();

    console.log("👮‍♂️ Roles permitidos:", rolesPermitidos);
    console.log("👤 Rol del usuario:", req.usuario.tipoUsuario);

    // 3. Verificar permiso
    if (!rolesPermitidos.includes(req.usuario.tipoUsuario)) {
      return res.status(403).json({
        mensaje: `No tienes permisos. Se requiere: ${rolesPermitidos.join(', ')}`
      })
    }

    next()
  }
}

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
    req.usuario = null
    next()
  }
}