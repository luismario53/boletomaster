import Usuario from '../models/Usuario.js'
import bcrypt from 'bcryptjs'

class UsuarioDAO {
    constructor() {}

    /**
     * @description Crea y guarda un nuevo usuario en la base de datos.
     * @param {object} usuarioData - Datos del usuario.
     * @returns {Promise<object>} El nuevo documento de usuario guardado.
     */
    async crearUsuario(usuarioData) {
        try {
            if (usuarioData.password) {
                const salt = await bcrypt.genSalt(10)
                usuarioData.password = await bcrypt.hash(usuarioData.password, salt)
            }
            const usuario = new Usuario(usuarioData)
            return await usuario.save()
        } catch (error) {
            throw new Error(`DAO Error al crear usuario: ${error.message}`)
        }
    }

    /**
     * @description Obtiene un usuario por su ID.
     * @param {string} idUsuario - El ID de Mongoose del usuario.
     * @param {boolean} [incluirPassword=false] - Si se desea incluir el campo password.
     * @returns {Promise<object|null>} El documento del usuario o null si no se encuentra.
     */
    async obtenerUsuarioPorId(idUsuario, incluirPassword = false) {
        try {
            const query = Usuario.findById(idUsuario)
                .populate('merch')
                .populate('eventos')
                .populate('lanzamientos')
                .populate('ordenes')

            if (incluirPassword) query.select('+password')

            const usuario = await query.exec()
            return usuario
        } catch (error) {
            throw new Error(`DAO Error al obtener usuario por ID: ${error.message}`)
        }
    }

    /**
     * @description Obtiene todos los usuarios (con filtros o paginación opcional).
     * @param {object} [options={}] - Opciones de consulta: filter, limit, skip.
     * @returns {Promise<Array<object>>} Lista de usuarios.
     */
    async obtenerTodosLosUsuarios(options = {}) {
        try {
            const { filter = {}, limit, skip } = options
            const query = Usuario.find(filter)
                .sort({ createdAt: -1 })

            if (limit) query.limit(limit)
            if (skip) query.skip(skip)

            return await query.exec()
        } catch (error) {
            throw new Error(`DAO Error al obtener todos los usuarios: ${error.message}`)
        }
    }

    /**
     * @description Obtiene usuarios según un filtro específico.
     * @param {object} filter - Objeto de filtro de Mongoose.
     * @returns {Promise<Array<object>>} Lista de usuarios.
     */
    async obtenerUsuariosPorFiltro(filter) {
        try {
            return await Usuario.find(filter)
        } catch (error) {
            throw new Error(`DAO Error al obtener usuarios por filtro: ${error.message}`)
        }
    }

    /**
     * @description Actualiza un usuario por su ID.
     * @param {string} idUsuario - ID de Mongoose del usuario.
     * @param {object} usuarioData - Datos a actualizar.
     * @returns {Promise<object|null>} Documento actualizado o null si no se encuentra.
     */
    async actualizarUsuario(idUsuario, usuarioData) {
        try {
            const usuario = await Usuario.findByIdAndUpdate(
                idUsuario,
                usuarioData,
                { new: true, runValidators: true }
            )
            return usuario
        } catch (error) {
            throw new Error(`DAO Error al actualizar usuario: ${error.message}`)
        }
    }

    /**
     * @description Elimina un usuario (hard delete).
     * @param {string} idUsuario - ID de Mongoose del usuario.
     * @returns {Promise<object|null>} Documento eliminado o null si no se encuentra.
     */
    async eliminarUsuario(idUsuario) {
        try {
            const usuario = await Usuario.findByIdAndDelete(idUsuario)
            return usuario
        } catch (error) {
            throw new Error(`DAO Error al eliminar usuario: ${error.message}`)
        }
    }

    /**
     * @description Realiza un "soft delete" marcando al usuario como inactivo.
     * @param {string} idUsuario - ID de Mongoose del usuario.
     * @returns {Promise<object|null>} Documento actualizado o null si no se encuentra.
     */
    async desactivarUsuario(idUsuario) {
        try {
            return await this.actualizarUsuario(idUsuario, { activo: false })
        } catch (error) {
            throw new Error(`DAO Error al desactivar usuario: ${error.message}`)
        }
    }

    /**
     * @description Busca un usuario por email (útil para login o validaciones).
     * @param {string} email - Email del usuario.
     * @param {boolean} [incluirPassword=false] - Si se desea incluir el password.
     * @returns {Promise<object|null>} Usuario encontrado o null.
     */
    async obtenerUsuarioPorEmail(email, incluirPassword = false) {
        try {
            const query = Usuario.findOne({ email })
            if (incluirPassword) query.select('+password')
            return await query.exec()
        } catch (error) {
            throw new Error(`DAO Error al obtener usuario por email: ${error.message}`)
        }
    }

    /**
     * @description Busca un usuario por email incluyendo el password (para login)
     * @param {string} email - Email del usuario
     * @returns {Promise<object|null>} Usuario encontrado o null
     */
    async buscarPorEmailConPassword(email) {
        try {
            return await Usuario.findOne({ email, activo: true }).select('+password')
        } catch (error) {
            throw new Error(`DAO Error al buscar usuario: ${error.message}`)
        }
    }

    /**
     * @description Valida el password del usuario
     * @param {string} passwordIngresado - Password en texto plano
     * @param {string} passwordHash - Password hasheado de la BD
     * @returns {Promise<boolean>} true si coincide
     */
    async validarPassword(passwordIngresado, passwordHash) {
        try {
            return await bcrypt.compare(passwordIngresado, passwordHash)
        } catch (error) {
            throw new Error(`DAO Error al validar password: ${error.message}`)
        }
    }

    /**
     * @description Obtiene usuarios por tipo.
     * @param {string} tipoUsuario - Tipo de usuario (artista, admin, cliente, etc.)
     * @returns {Promise<Array<object>>} Lista de usuarios.
     */
    async obtenerUsuariosPorTipo(tipoUsuario) {
        try {
            return await Usuario.find({ tipoUsuario });
        } catch (error) {
            throw new Error(`DAO Error al obtener usuarios por tipo: ${error.message}`);
        }
    }
}

export default new UsuarioDAO()
