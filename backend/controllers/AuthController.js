// controllers/authController.js
import UsuarioDAO from '../dao/UsuarioDAO.js'
import { generarToken, generarRefreshToken, verificarToken } from '../utils/jwtUtils.js'

// --- NUEVOS IMPORTS NECESARIOS PARA EL REGISTRO ---
import Usuario from '../models/Usuario.js' // Asegúrate de que la ruta al modelo sea correcta
import bcrypt from 'bcryptjs'
// --------------------------------------------------

const AuthController = {

  /**
   * Registrar nuevo usuario
   * POST /api/auth/register
   */
  async register(req, res) {
    try {
      console.log("📥 Recibiendo registro completo:", req.body);
      
      const { 
          nombre, 
          email, 
          password, 
          telefono, 
          tipoUsuario,
          biografia, 
          redesSociales, 
          imagenes 
      } = req.body;

      // validar si ya existe
      const existe = await Usuario.findOne({ email });
      if (existe) {
        return res.status(400).json({ success: false, message: 'El correo ya está registrado' });
      }

      // encriptar contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // crear el usuario CON TODOS LOS DATOS
      const nuevoUsuario = new Usuario({
        nombre,
        email,
        telefono,
        tipoUsuario,
        password: hashedPassword,
        biografia, 
        redesSociales, 
        imagenes
      });

      // guardar
      await nuevoUsuario.save();
      console.log("Usuario registrado con perfil completo.");

      res.status(201).json({ 
        success: true, 
        message: 'Usuario creado exitosamente. Ahora puedes iniciar sesión.' 
      });

    } catch (error) {
      console.error("Error en registro:", error);
      res.status(500).json({ success: false, message: 'Error al registrar', error: error.message });
    }
  },

  /**
   * Login de usuario
   * POST /api/auth/login
   */
  async login(req, res) {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ mensaje: 'Email y password son requeridos' })
      }

      // Buscar usuario
      const usuario = await UsuarioDAO.buscarPorEmailConPassword(email)

      if (!usuario) {
        return res.status(401).json({ mensaje: 'Credenciales inválidas' })
      }

      // Validar password (El DAO usa bcrypt internamente o aquí comparamos)
      // Si tu DAO.validarPassword ya usa bcrypt.compare, esto está perfecto.
      const passwordValido = await UsuarioDAO.validarPassword(password, usuario.password)

      if (!passwordValido) {
        return res.status(401).json({ mensaje: 'Credenciales inválidas' })
      }

      // Crear payload
      const payload = {
        id: usuario._id,
        email: usuario.email,
        nombre: usuario.nombre,
        tipoUsuario: usuario.tipoUsuario
      }

      // Generar tokens con tus utilidades
      const token = generarToken(payload)
      const refreshToken = generarRefreshToken({ id: usuario._id })

      // Responder sin password
      const { password: _, ...usuarioSinPassword } = usuario.toObject()

      res.json({
        mensaje: 'Login exitoso',
        usuario: usuarioSinPassword,
        token,
        refreshToken
      })

    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
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
        return res.status(400).json({ mensaje: 'Refresh token requerido' })
      }

      const decoded = verificarToken(refreshToken)
      const usuario = await UsuarioDAO.obtenerUsuarioPorId(decoded.id)

      if (!usuario || !usuario.activo) {
        return res.status(401).json({ mensaje: 'Usuario no válido' })
      }

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
      res.status(401).json({ mensaje: 'Refresh token inválido o expirado' })
    }
  },

  /**
   * Obtener perfil
   * GET /api/auth/me
   */
  async perfil(req, res) {
    try {
      const usuario = await UsuarioDAO.obtenerUsuarioPorId(req.usuario.id)
      if (!usuario) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' })
      }
      res.json(usuario)
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener perfil', error: error.message })
    }
  },
}

export default AuthController