import Item from '../models/Item.js'

class ItemDAO {
    constructor() {}

    /**
     * @description Crea un nuevo item en la base de datos.
     * @param {object} itemData - Datos del item a crear.
     * @returns {Promise<object>} El item creado.
     */
    async crearItem(itemData) {
        try {
            const item = new Item(itemData)
            return await item.save()
        } catch (error) {
            throw new Error(`DAO Error al crear item: ${error.message}`)
        }
    }

    /**
     * @description Obtiene un item por su ID.
     * @param {string} idItem - ID de Mongoose del item.
     * @returns {Promise<object|null>} El item encontrado o null si no existe.
     */
    async obtenerItemPorId(idItem) {
        try {
            const item = await Item.findById(idItem)
            return item
        } catch (error) {
            throw new Error(`DAO Error al obtener item por ID: ${error.message}`)
        }
    }

    /**
     * @description Obtiene todos los items (puede incluir filtros o paginación).
     * @param {object} [options={}] - Filtros u opciones de búsqueda (ej. { activo: true }).
     * @returns {Promise<Array<object>>} Lista de items.
     */
    async obtenerTodosLosItems(options = {}) {
        try {
            const filter = options.filter || {}
            return await Item.find(filter).sort({ createdAt: -1 })
        } catch (error) {
            throw new Error(`DAO Error al obtener todos los items: ${error.message}`)
        }
    }

    /**
     * @description Actualiza un item por su ID.
     * @param {string} idItem - ID del item a actualizar.
     * @param {object} itemData - Nuevos datos del item.
     * @returns {Promise<object|null>} El item actualizado o null si no se encuentra.
     */
    async actualizarItem(idItem, itemData) {
        try {
            const item = await Item.findByIdAndUpdate(
                idItem,
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
    async eliminarItem(idItem) {
        try {
            const item = await Item.findByIdAndDelete(idItem)
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
    async desactivarItem(idItem) {
        try {
            return await this.actualizarItem(idItem, { activo: false })
        } catch (error) {
            throw new Error(`DAO Error al desactivar item: ${error.message}`)
        }
    }
}

export default new ItemDAO()
