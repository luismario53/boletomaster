import Galeria from '../models/Galeria.js';
import AppError from '../utils/AppError.js';

/**
 * @class GaleriaDAO
 * @description Maneja las operaciones CRUD para las galerias en la base de datos.
 */
class GaleriaDAO {
    constructor() {}

    /**
     * @description Crea y guarda un nuevo galeria en la base de datos.
     * @param {object} galeriaData - Datos del galeria a crear.
     * @returns {Promise<object>} El documento del galeria guardado.
     */
    async crearGaleria(galeriaData) {
        // falta agregar token de sesion
        try {
            const galeria = new Galeria(galeriaData);
            return await galeria.save();
        } catch (error) {
            throw new AppError(`DAO Error al crear galeria: ${error.message}`, 400);
        }
    }

    /**
     * @description Obtiene una galeria por su ID.
     * @param {string} idGaleria - El ID de Mongoose de la galeria.
     * @returns {Promise<object | null>} El documento de la galeria o null si no se encuentra.
     */
    async obtenerGaleriaPorId(idGaleria) {
        try {
            const galeria = await Galeria.findById(idGaleria)

            if (!galeria) throw new AppError('Galeria no encontrado', 404);
            return galeria;
        } catch (error) {
            throw new AppError(`DAO Error al obtener galeria por ID: ${error.message}`, 500);
        }
    }

    /**
     * @description Obtiene todas las galerias (ordenados por fecha ascendente).
     * @param {object} [options={}] - Opciones de consulta (filtros, límites, etc.).
     * @returns {Promise<Array<object>>} Una lista de documentos de galerias.
     */
    async obtenerTodasLasGalerias(options = {}) {
        try {
            const filtro = options.filter || {};
            return await Galeria.find(filtro)
                .sort({ fecha: 1 })
        } catch (error) {
            throw new AppError(`DAO Error al obtener todos las galerias: ${error.message}`, 500);
        }
    }

    /**
     * @description Obtiene galerias que coinciden con un filtro específico.
     * @param {object} filter - Objeto de filtro de Mongoose (ej. { nombre: /rock/i }).
     * @returns {Promise<Array<object>>} Una lista de galerias que coinciden con el filtro.
     */
    async obtenerGaleriaPorFiltro(filter) {
        try {
            return await Galeria.find(filter)
        } catch (error) {
            throw new AppError(`DAO Error al obtener galerias por filtro: ${error.message}`, 500);
        }
    }

    /**
     * @description Actualiza un galeria existente por su ID.
     * @param {string} idGaleria - El ID de Mongoose del galeria.
     * @param {object} galeriaData - Los datos a actualizar.
     * @returns {Promise<object | null>} El documento actualizado o null si no se encuentra.
     */
    async actualizarGaleria(idGaleria, galeriaData) {
        try {
            const galeria = await Galeria.findByIdAndUpdate(
                idGaleria,
                galeriaData,
                { new: true, runValidators: true }
            );

            if (!galeria) throw new AppError('Galeria no encontrada', 404);
            return galeria;
        } catch (error) {
            throw new AppError(`DAO Error al actualizar la galeria: ${error.message}`, 400);
        }
    }

    /**
     * @description Elimina (hard-delete) un galeria por su ID.
     * @param {string} idGaleria - El ID de Mongoose del galeria.
     * @returns {Promise<object | null>} El documento eliminado o null si no se encontró.
     */
    async eliminarGaleria(idGaleria) {
        try {
            const galeria = await Galeria.findByIdAndDelete(idGaleria);
            if (!galeria) throw new AppError('Galeria no encontrado', 404);
            return galeria;
        } catch (error) {
            throw new AppError(`DAO Error al eliminar galeria: ${error.message}`, 500);
        }
    }

    /**
     * @description Realiza un "soft delete" marcando el galeria como inactivo.
     * @param {string} idGaleria - El ID de Mongoose del galeria.
     * @returns {Promise<object | null>} El documento actualizado o null si no se encuentra.
     */
    async desactivarGaleria(idGaleria) {
        try {
            const galeria = await Galeria.findByIdAndUpdate(
                idGaleria,
                { activo: false },
                { new: true }
            );

            if (!galeria) throw new AppError('Galeria no encontrado', 404);
            return galeria;
        } catch (error) {
            throw new AppError(`DAO Error al desactivar la galeria: ${error.message}`, 500);
        }
    }
}

export default new GaleriaDAO();
