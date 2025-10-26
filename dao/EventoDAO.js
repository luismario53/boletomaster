
import Evento from '../models/Evento.js'

class EventoDAO {
    constructor() {}

    async crearEvento (eventoData) {
        try {
            const evento = new Evento(eventoData)
            return await evento.save()
        } catch (error) {
            throw new Error(`Error al crear evento: ${error.message}`)
        }
    }

    async agregarOrganizadoresAEvento (idEvento, organizadores) {
        try {
            const evento = await Evento.findById(idEvento)
            if(!evento) {
                throw new Error('No se encontró el evento')
            }

            evento.idOrganizador = organizadores
            return await evento.save()
        } catch (error) {
            throw new Error(`Error al agregar organizadores a evento: ${error.message}`)
        }
    }

    async agregarArtistasAEvento (idEvento, artistas) {
        try {
            const evento = await Evento.findById(idEvento)
            if(!evento) {
                throw new Error('No se encontró el evento')
            }
            evento.idArtista = artistas
            return await evento.save()
        } catch (error) {
            throw new Error(`Error al agregar artistas a evento: ${error.message}`)
        }
    }

    async obtenerEventoById (idEvento) {
        try {
            return await Evento.findOne({
                _id: idEvento,
                activo: true
            })
        } catch (error) {
            throw new Error(`Error al obtener el evento: ${error.message}`)
        }
    }

    async obtenerEventos (limit = 20) {
        try {
            return await Evento.find({activo: true})
                .limit(limit)
                .populate('idOrganizador')
                .populate('idArtista')
        } catch (error) {
            throw new Error(`Error al obtener eventos: ${error.message}`)
        }
    }

    async actualizarEvento (idEvento, nuevoEventoData) {
        try {
            return await Evento.findOneAndUpdate(
                { _id: idEvento, activo: true },
                nuevoEventoData,
                { new: true }
            )
        } catch (error) {
            throw new Error(`Error al actualizar evento: ${error.message}`)
        }
    }

    async eliminarEvento (idEvento) {
        try {
            const evento = await Evento.findOne({
                _id: idEvento,
                activo: true
            })

            if (!evento) {
                throw new Error('Evento no encontrado o ya está inactivo')
            }

            // Soft delete
            evento.activo = false
            return await evento.save();
        } catch (error) {
            throw new Error(`Error al eliminar evento: ${error.message}`)
        }
    }
}