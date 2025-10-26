
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

            const organizadoresNuevos = organizadores.filter(
                id => !evento.idOrganizador.includes(id)
            )

            evento.idOrganizador.push(...organizadoresNuevos)
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

            const artistasNuevos = artistas.filter(
                id => !evento.idArtista.includes(id)
            )

            evento.idArtista.push(...artistasNuevos)
            return await evento.save()
        } catch (error) {
            throw new Error(`Error al agregar artistas a evento: ${error.message}`)
        }
    }
}