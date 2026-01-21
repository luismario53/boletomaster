/**
 * Data Access Object (DAO) para la entidad Orden.
 * 
 * Este DAO se encarga de interactuar directamente con la base de datos MongoDB
 * para realizar operaciones CRUD y de gestión sobre las órdenes.
 */

import Orden from '../models/Orden.js'
import Mercancia from '../models/Mercancia.js'

class OrdenDAO {
    constructor() {}

    /**
     * Crea una nueva orden en la base de datos.
     * 
     * @param {Object} ordenData - Datos de la orden a registrar.
     * @returns {Promise<Object>} Orden creada.
     * @throws {Error} Si ocurre un error durante la creación.
     */
    async crearOrden(ordenData) {
        try {
            const { idCliente, productos } = ordenData
            const ids = productos.map(producto => producto._id)
            const productosDB = await Mercancia.find({ _id: { $in: ids } });

            const cantidadesProductos = new Map(
                productos.map(p => [p._id, p.cantidad])
            );

            const ventas = productosDB.map(producto => {
                const cantidad = cantidadesProductos.get(producto._id.toString())
                return {
                    tipoProducto: producto.tipoProducto,
                    idProducto: producto._id,
                    precioVenta: producto.precio,
                    cantidad: cantidad,
                    subtotal: producto.precio * cantidad
                }
            })

            const total = ventas.reduce((acc, venta) => acc + venta.subtotal, 0)
            const newOrden = {
                idCliente,
                fecha: new Date(),
                total: total,
                iva: total * 0.16,
                ordenDetalle: ventas
            }
            const orden = new Orden(newOrden)
            return await orden.save()
        } catch (error) {
            throw new Error(`Error al crear orden: ${error.message}`)
        }
    }

    /**
     * Agrega uno o varios ítems al detalle de una orden existente.
     * 
     * @param {String} idOrden - ID de la orden a modificar.
     * @param {Array} items - Lista de ítems a agregar con sus precios y cantidades.
     * @returns {Promise<Object>} Orden actualizada.
     * @throws {Error} Si no se encuentra la orden o ocurre un error al guardar.
     */
    async agregarItemsAVenta(idOrden, items) {
        try {
            const orden = await Orden.findById(idOrden)
            if (!orden) {
                throw new Error('No se encontró la orden')
            }

            // Agrega los ítems al detalle
            orden.ordenDetalle.push(
                ...items.map(item => ({
                    tipoProducto: item.tipoProducto,
                    idProducto: item.idProducto,
                    precioVenta: item.precioVenta,
                    cantidad: item.cantidad,
                    subtotal: item.precioVenta * item.cantidad
                }))
            )

            // Recalcular totales
            orden.total = orden.ordenDetalle.reduce((acc, d) => acc + d.subtotal, 0)
            orden.iva = orden.total * 0.16 // Ejemplo: IVA del 16%

            return await orden.save()
        } catch (error) {
            throw new Error(`Error al agregar items a la orden: ${error.message}`)
        }
    }

    /**
     * Obtiene todas las órdenes registradas.
     * 
     * @returns {Promise<Array>} Lista de órdenes.
     */
    async obtenerOrdenes() {
        try {
            return await Orden.find()
                .populate('idCliente', 'nombre correo')
                .populate('ordenDetalle.idItem', 'nombre precio')
        } catch (error) {
            throw new Error(`Error al obtener las órdenes: ${error.message}`)
        }
    }

    /**
     * Obtiene una orden específica por su ID.
     * 
     * @param {String} id - ID de la orden a buscar.
     * @returns {Promise<Object|null>} Orden encontrada o null si no existe.
     */
    async obtenerOrdenPorId(id) {
        try {
            return await Orden.findById(id)
                .populate('idCliente', 'nombre correo')
                .populate('ordenDetalle.idItem', 'nombre precio')
        } catch (error) {
            throw new Error(`Error al obtener la orden: ${error.message}`)
        }
    }

    /**
     * Elimina una orden por su ID.
     * 
     * @param {String} id - ID de la orden a eliminar.
     * @returns {Promise<Boolean>} true si se eliminó correctamente, false si no se encontró.
     */
    async eliminarOrden(id) {
        try {
            const resultado = await Orden.findByIdAndDelete(id)
            return !!resultado
        } catch (error) {
            throw new Error(`Error al eliminar la orden: ${error.message}`)
        }
    }

    /**
     * Actualiza los datos principales de una orden.
     * 
     * @param {String} id - ID de la orden a actualizar.
     * @param {Object} datos - Campos a modificar.
     * @returns {Promise<Object|null>} Orden actualizada o null si no existe.
     */
    async actualizarOrden(id, datos) {
        try {
            return await Orden.findByIdAndUpdate(id, datos, { new: true })
        } catch (error) {
            throw new Error(`Error al actualizar la orden: ${error.message}`)
        }
    }
}

export default new OrdenDAO()
