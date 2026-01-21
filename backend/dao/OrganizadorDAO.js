
import Organizador from '../models/Organizador.js'

class OrganizadorDAO {
    constructor() {}

    async crearOrganizador (organizadorData) {
        try {
            const organizador = new Organizador(organizadorData)
            return await organizador.save()
        } catch (error) {
            throw new Error(`Error al crear organizador: ${error.message}`)
        }
    }

    async obtenerOrganizadorById (idOrganizador) {
        try {
            return await Organizador.findOne({
                _id: idOrganizador,
                activo: true
            })
        } catch (error) {
            throw new Error(`Error al obtener organizador: ${error.message}`)
        }
    }

    async obtenerOrganizadores (limit = 10) {
        try {
            return await Organizador.find({ activo: true }).limit(limit)
        } catch (error) {
            throw new Error(`Error al obtener organizadores: ${error.message}`)
        }
    }

    async actualizarOrganizador (idOrganizador, nuevoOrganizadorData) {
        try {
            return await Organizador.findOneAndUpdate(
                { _id: idOrganizador, activo: true },
                nuevoOrganizadorData,
                { new: true }
            )
        } catch (error) {
            throw new Error(`Error al actualizar organizador: ${error.message}`)
        }
    }

    async eliminarOrganizador (idOrganizador) {
        try {
            const organizador = await Organizador.findOne({
                _id: idOrganizador,
                activo: true
            })

            if (!organizador) {
                throw new Error('Organizador no encontrado o ya está inactivo')
            }

            // Soft delete
            organizador.activo = false
            return await organizador.save();
        } catch (error) {
            throw new Error(`Error al eliminar organizador: ${error.message}`)
        }
    }
}

export default new OrganizadorDAO()