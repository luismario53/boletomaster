
import Orden from '../models/Orden.js'

class OrdenDAO {
    constructor() {}

    async crearOrden (ordenData) {
        try {
            const orden = new Orden(ordenData)
            return await orden.save()
        } catch (error) {
            throw new Error(`Error al crear orden: ${error.message}`)
        }
    }

    async agregarItemsAVenta (idOrden, items) {
        try {
            const orden = await Orden.findById(idOrden)
            if(!orden) {
                throw new Error('No se encontró la orden')
            }

            orden.ordenDetalle.push(
                ...items.map(item => ({
                    idItem: item.idItem,
                    precioVenta: item.precioVenta,
                    cantidad: item.cantidad,
                    subtotal: item.precioVenta * item.cantidad
                }))
            )

            return await orden.save()
        } catch (error) {
            throw new Error(`Error al agregar items a la orden: ${error.message}`)
        }
    }
}

export default new OrdenDAO()