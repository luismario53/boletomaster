import jwt from 'jsonwebtoken'
import { JWT_CONFIG } from '../config/jwt.js'

/**
 * Genera un token JWT
 * @param {object} payload - Datos a incluir en el token
 * @returns {string} Token JWT
 */
export const generarToken = (payload) => {
  return jwt.sign(payload, JWT_CONFIG.secret, {
    expiresIn: JWT_CONFIG.expiresIn
  })
}

/**
 * Genera un refresh token
 * @param {object} payload - Datos a incluir en el token
 * @returns {string} Refresh Token JWT
 */
export const generarRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_CONFIG.secret, {
    expiresIn: JWT_CONFIG.refreshExpiresIn
  })
}

/**
 * Verifica y decodifica un token JWT
 * @param {string} token - Token a verificar
 * @returns {object} Payload decodificado
 */
export const verificarToken = (token) => {
  return jwt.verify(token, JWT_CONFIG.secret)
}