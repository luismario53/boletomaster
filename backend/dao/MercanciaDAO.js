import Mercancia from '../models/Mercancia.js'

class MercanciaDAO {
    constructor() {}

    /**
     * @description Crea una mercancia en la base de datos.
     * @param {object} mercanciaData - Datos del item crear.
     * @returns {Promise<object>} El item creado.
     */
    async crearMercancia(mercanciaData) {
        try {
            const mercancia = new Mercancia(mercanciaData)
            return await mercancia.save()
        } catch (error) {
            throw new Error(`DAO Error al crear la mercancia: ${error.message}`)
        }
    }

    /**
     * @description Obtiene un item por su ID.
     * @param {string} idMercancia - ID de Mongoose del item.
     * @returns {Promise<object|null>} El item encontrado o null si no existe.
     */
    async obtenerMercanciaPorId(idMercancia) {
        try {
            const item = await Mercancia.findById(idMercancia)
            return item
        } catch (error) {
            throw new Error(`DAO Error al obtener mercancia por ID: ${error.message}`)
        }
    }

    /**
     * @description Obtiene todos los items (puede incluir filtros o paginación).
     * @param {object} [options={}] - Filtros u opciones de búsqueda (ej. { activo: true }).
     * @returns {Promise<Array<object>>} Lista de items.
     */
    async obtenerTodaLaMercancia(options = {}) {
        try {
            const filter = options.filter || {}
            return await Mercancia.find(filter).populate('idArtista').sort({ createdAt: -1 })
        } catch (error) {
            throw new Error(`DAO Error al obtener toda la mercancia: ${error.message}`)
        }
    }

    /**
     * @description Obtiene mercancía por artista.
     * @param {string} idArtista - ID del artista.
     * @returns {Promise<Array<object>>} Lista de mercancía del artista.
     */
    async obtenerMercanciaPorArtista(idArtista) {
        try {
            return await Mercancia.find({ idArtista: idArtista, activo: true }).sort({ createdAt: -1 });
        } catch (error) {
            throw new Error(`DAO Error al obtener mercancía por artista: ${error.message}`);
        }
    }

    /**
     * @description Actualiza un item por su ID.
     * @param {string} idMercancia - ID del item a actualizar.
     * @param {object} itemData - Nuevos datos del item.
     * @returns {Promise<object|null>} El item actualizado o null si no se encuentra.
     */
    async actualizarMercancia(idMercancia, itemData) {
        try {
            const item = await Mercancia.findByIdAndUpdate(
                idMercancia,
                itemData,
                { new: true, runValidators: true }
            )
            return item
        } catch (error) {
            throw new Error(`DAO Error al actualizar item: ${error.message}`)
        }
    }

    /**
     * @description Elimina un item de la base de datos (borrado permanente).
     * @param {string} idItem - ID del item a eliminar.
     * @returns {Promise<object|null>} El item eliminado o null si no existe.
     */
    async eliminarMercancia(idItem) {
        try {
            const item = await Mercancia.findByIdAndDelete(idItem)
            return item
        } catch (error) {
            throw new Error(`DAO Error al eliminar item: ${error.message}`)
        }
    }

    /**
     * @description Desactiva un item (soft delete).
     * @param {string} idItem - ID del item a desactivar.
     * @returns {Promise<object|null>} El item actualizado o null si no se encuentra.
     */
    async desactivarMercancia(idItem) {
        try {
            return await this.actualizarMercancia(idItem, { activo: false })
        } catch (error) {
            throw new Error(`DAO Error al desactivar item: ${error.message}`)
        }
    }
}

export default new MercanciaDAO()
