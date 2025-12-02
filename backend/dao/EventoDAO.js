import Boleto from '../models/Boleto.js';
import Evento from '../models/Evento.js';
import AppError from '../utils/AppError.js';

/**
 * @class EventoDAO
 * @description Maneja las operaciones CRUD para los eventos en la base de datos.
 */
class EventoDAO {
    constructor() {}

    /**
     * @description Crea y guarda un nuevo evento en la base de datos.
     * @param {object} eventoData - Datos del evento a crear.
     * @returns {Promise<object>} El documento del evento guardado.
     */
    async crearEvento(eventoData) {
        // falta agregar token de sesion
        try {
            const evento = new Evento(eventoData);
            return await evento.save();
        } catch (error) {
            throw new AppError(`DAO Error al crear evento: ${error.message}`, 400);
        }
    }

    /**
     * @description Obtiene un evento por su ID.
     * @param {string} idEvento - El ID de Mongoose del evento.
     * @returns {Promise<object | null>} El documento del evento o null si no se encuentra.
     */
    async obtenerEventoPorId(idEvento) {
        try {
            const evento = await Evento.findById(idEvento)
                .populate('organizadores')
                .populate('artistas');

            if (!evento) throw new AppError('Evento no encontrado', 404);
            return evento;
        } catch (error) {
            throw new AppError(`DAO Error al obtener evento por ID: ${error.message}`, 500);
        }
    }

    /**
     * @description Obtiene todos los eventos (ordenados por fecha ascendente).
     * @param {object} [options={}] - Opciones de consulta (filtros, límites, etc.).
     * @returns {Promise<Array<object>>} Una lista de documentos de eventos.
     */
    async obtenerTodosLosEventos(options = {}) {
        try {
            const filtro = options.filter || {};
            return await Evento.find(filtro)
                .sort({ fecha: 1 })
                .populate('organizadores')
                .populate('artistas');
        } catch (error) {
            throw new AppError(`DAO Error al obtener todos los eventos: ${error.message}`, 500);
        }
    }

    /**
     * @description Obtiene eventos que coinciden con un filtro específico.
     * @param {object} filter - Objeto de filtro de Mongoose (ej. { nombre: /rock/i }).
     * @returns {Promise<Array<object>>} Una lista de eventos que coinciden con el filtro.
     */
    async obtenerEventosPorFiltro(filter) {
        try {
            return await Evento.find(filter)
                .populate('organizadores')
                .populate('artistas');
        } catch (error) {
            throw new AppError(`DAO Error al obtener eventos por filtro: ${error.message}`, 500);
        }
    }

    /**
     * @description Actualiza un evento existente por su ID.
     * @param {string} idEvento - El ID de Mongoose del evento.
     * @param {object} eventoData - Los datos a actualizar.
     * @returns {Promise<object | null>} El documento actualizado o null si no se encuentra.
     */
    async actualizarEvento(idEvento, eventoData) {
        try {
            const evento = await Evento.findByIdAndUpdate(
                idEvento,
                eventoData,
                { new: true, runValidators: true }
            );

            if (!evento) throw new AppError('Evento no encontrado', 404);
            return evento;
        } catch (error) {
            throw new AppError(`DAO Error al actualizar evento: ${error.message}`, 400);
        }
    }

    /**
     * @description Elimina (hard-delete) un evento por su ID.
     * @param {string} idEvento - El ID de Mongoose del evento.
     * @returns {Promise<object | null>} El documento eliminado o null si no se encontró.
     */
    async eliminarEvento(idEvento) {
        try {
            const evento = await Evento.findByIdAndDelete(idEvento);
            if (!evento) throw new AppError('Evento no encontrado', 404);
            return evento;
        } catch (error) {
            throw new AppError(`DAO Error al eliminar evento: ${error.message}`, 500);
        }
    }

    /**
     * @description Realiza un "soft delete" marcando el evento como inactivo.
     * @param {string} idEvento - El ID de Mongoose del evento.
     * @returns {Promise<object | null>} El documento actualizado o null si no se encuentra.
     */
    async desactivarEvento(idEvento) {
        try {
            const evento = await Evento.findByIdAndUpdate(
                idEvento,
                { activo: false },
                { new: true }
            );

            if (!evento) throw new AppError('Evento no encontrado', 404);
            return evento;
        } catch (error) {
            throw new AppError(`DAO Error al desactivar evento: ${error.message}`, 500);
        }
    }
}

export default new EventoDAO();
