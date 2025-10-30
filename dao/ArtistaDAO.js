
import Artista from '../models/Artista.js'

class ArtistaDAO {
    constructor() {}

    async crearArtista (artistaData) {
        try {
            const artista = new Artista(artistaData)
            return await artista.save()
        } catch (error) {
            throw new Error(`Error al crear artista: ${error.message}`)
        }
    }

    async obtenerArtistaById (idArtista) {
        try {
            return await Artista.findOne({
                _id: idArtista,
                activo: true
            })
        } catch (error) {
            throw new Error(`Error al obtener artista: ${error.message}`)
        }
    }

    async obtenerArtistas (limit = 10) {
        try {
            return await Artista.find({ activo: true }).limit(limit)
        } catch (error) {
            throw new Error(`Error al obtener artistas: ${error.message}`)
        }
    }

    async actualizarArtista (idArtista, nuevoArtistaData) {
        try {
            return await Artista.findOneAndUpdate(
                { _id: idArtista, activo: true },
                nuevoArtistaData,
                { new: true }
            )
        } catch (error) {
            throw new Error(`Error al actualizar artista: ${error.message}`)
        }
    }

    async eliminarArtista (idArtista) {
        try {
            const artista = await Artista.findOne({
                _id: idArtista,
                activo: true
            })

            if (!artista) {
                throw new Error('Artista no encontrado o ya está inactivo')
            }

            // Soft delete
            artista.activo = false
            return await artista.save();
        } catch (error) {
            throw new Error(`Error al eliminar artista: ${error.message}`)
        }
    }
}

export default new ArtistaDAO()