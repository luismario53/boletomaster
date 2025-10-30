import UsuarioDAO from '../dao/UsuarioDAO.js'

class UsuarioController {
    async crear(req, res) {
        try {
            const usuario = await UsuarioDAO.crear(req.body)
            res.status(201).json(usuario)
        } catch (error) {
            res.status(400).json({ mensaje: 'Error al crear usuario', error: error.message })
        }
    }

    async obtenerTodos(req, res) {
        try {
            const usuarios = await UsuarioDAO.obtenerTodos()
            res.status(200).json(usuarios)
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message })
        }
    }

    async obtenerPorId(req, res) {
        try {
            const usuario = await UsuarioDAO.obtenerPorId(req.params.id)
            if (!usuario) return next(new AppError('Usuario no encontrado', 404))
            res.status(200).json(usuario)
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener usuario', error: error.message })
        }
    }

    async actualizar(req, res) {
        try {
            const usuario = await UsuarioDAO.actualizar(req.params.id, req.body)
            if (!usuario) return next(new AppError('Usuario no encontrado', 404))
            res.status(200).json(usuario)
        } catch (error) {
            res.status(400).json({ mensaje: 'Error al actualizar usuario', error: error.message })
        }
    }

    async eliminar(req, res) {
        try {
            const usuario = await UsuarioDAO.eliminar(req.params.id)
            if (!usuario) return next(new AppError('Usuario no encontrado', 404))
            res.status(200).json({ mensaje: 'Usuario eliminado correctamente' })
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al eliminar usuario', error: error.message })
        }
    }

    async obtenerPorTipo(req, res) {
        try {
            const usuarios = await UsuarioDAO.obtenerPorTipo(req.params.tipo)
            res.status(200).json(usuarios)
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener usuarios por tipo', error: error.message })
        }
    }
}

export default new UsuarioController()
