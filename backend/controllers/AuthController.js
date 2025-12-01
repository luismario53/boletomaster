// controllers/authController.js
import UsuarioDAO from '../dao/UsuarioDAO.js'
import { generarToken, generarRefreshToken, verificarToken } from '../utils/jwtUtils.js'

const AuthController = {

  /**
   * Login de usuario
   * POST /api/auth/login
   */
  async login(req, res) {
    try {
      const { email, password } = req.body

      // Validar campos requeridos
      if (!email || !password) {
        return res.status(400).json({
          mensaje: 'Email y password son requeridos'
        })
      }

      // Buscar usuario por email (incluye password)
      const usuario = await UsuarioDAO.buscarPorEmailConPassword(email)

      if (!usuario) {
        return res.status(401).json({
          mensaje: 'Credenciales inválidas'
        })
      }

      // Validar password
      const passwordValido = await UsuarioDAO.validarPassword(password, usuario.password)

      if (!passwordValido) {
        return res.status(401).json({
          mensaje: 'Credenciales inválidas'
        })
      }

      // Crear payload para el token
      const payload = {
        id: usuario._id,
        email: usuario.email,
        nombre: usuario.nombre,
        tipoUsuario: usuario.tipoUsuario
      }

      // Generar tokens
      const token = generarToken(payload)
      const refreshToken = generarRefreshToken({ id: usuario._id })

      // Responder sin el password
      const { password: _, ...usuarioSinPassword } = usuario.toObject()

      res.json({
        mensaje: 'Login exitoso',
        usuario: usuarioSinPassword,
        token,
        refreshToken
      })

    } catch (error) {
      res.status(500).json({
        mensaje: 'Error en el servidor',
        error: error.message
      })
    }
  },

  /**
   * Refrescar token
   * POST /api/auth/refresh
   */
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body

      if (!refreshToken) {
        return res.status(400).json({
          mensaje: 'Refresh token requerido'
        })
      }

      // Verificar refresh token
      const decoded = verificarToken(refreshToken)

      // Buscar usuario
      const usuario = await UsuarioDAO.obtenerUsuarioPorId(decoded.id)

      if (!usuario || !usuario.activo) {
        return res.status(401).json({
          mensaje: 'Usuario no válido'
        })
      }

      // Generar nuevo token
      const payload = {
        id: usuario._id,
        email: usuario.email,
        nombre: usuario.nombre,
        tipoUsuario: usuario.tipoUsuario
      }

      const nuevoToken = generarToken(payload)

      res.json({
        mensaje: 'Token renovado',
        token: nuevoToken
      })

    } catch (error) {
      res.status(401).json({
        mensaje: 'Refresh token inválido o expirado'
      })
    }
  },

  /**
   * Obtener perfil del usuario autenticado
   * GET /api/auth/me
   */
  async perfil(req, res) {
    try {
      const usuario = await UsuarioDAO.obtenerUsuarioPorId(req.usuario.id)

      if (!usuario) {
        return res.status(404).json({
          mensaje: 'Usuario no encontrado'
        })
      }

      res.json(usuario)
    } catch (error) {
      res.status(500).json({
        mensaje: 'Error al obtener perfil',
        error: error.message
      })
    }
  },
}

export default AuthController