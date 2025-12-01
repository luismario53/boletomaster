import UsuarioDAO from '../dao/UsuarioDAO.js'

class UsuarioController {
    async crear(req, res) {
        try {
            const usuarioData = req.body
            const usuario = await UsuarioDAO.crearUsuario(usuarioData)
            res.status(201).json(usuario)
        } catch (error) {
            res.status(400).json({ mensaje: 'Error al crear usuario', error: error.message})
        }
    }

    async obtenerTodos(req, res) {
        try {
            const usuarios = await UsuarioDAO.obtenerTodosLosUsuarios()
            res.status(200).json(usuarios)
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message })
        }
    }

    async obtenerPorId(req, res) {
        try {
            const usuario = await UsuarioDAO.obtenerUsuarioPorId(req.params.id)
            if (!usuario) return next(new AppError('Usuario no encontrado', 404))
            
            // obtenemos la merch si es artista

            res.status(200).json(usuario)
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener usuario', error: error.message })
        }
    }

    async actualizar(req, res) {
        try {
            const usuario = await UsuarioDAO.actualizarUsuario(req.params.id, req.body)
            if (!usuario) return next(new AppError('Usuario no encontrado', 404))
            res.status(200).json(usuario)
        } catch (error) {
            res.status(400).json({ mensaje: 'Error al actualizar usuario', error: error.message })
        }
    }

    async eliminar(req, res) {
        try {
            const usuario = await UsuarioDAO.eliminarUsuario(req.params.id)
            if (!usuario) return next(new AppError('Usuario no encontrado', 404))
            res.status(200).json({ mensaje: 'Usuario eliminado correctamente' })
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al eliminar usuario', error: error.message })
        }
    }

    async obtenerPorTipo(req, res) {
        try {
            const { tipo } = req.params
            const usuarios = await UsuarioDAO.obtenerUsuariosPorTipo(tipo)
            res.status(200).json(usuarios)
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener usuarios por tipo', error: error.message })
        }
    }
}

export default new UsuarioController()
