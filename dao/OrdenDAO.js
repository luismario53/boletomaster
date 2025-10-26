
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

    async obtenerOrdenById (idOrden) {
        try {
            return await Orden.findOne({
                _id: idOrden,
                activo: true
            })
        } catch (error) {
            throw new Error(`Error al obtener la orden: ${error.message}`)
        }
    }

    async obtenerOrdenesByUsuario (idUsuario, limit = 10) {
        try {
            return await Orden
                .find({idCliente: idUsuario, activo: true})
                .limit(limit)
        } catch (error) {
            throw new Error(`Error al obtener orden: ${error.message}`)
        }
    }
}

export default new OrdenDAO()