import OrdenDAO from '../dao/OrdenDAO.js'
import AppError from '../utils/AppError.js'
import { createOrder, capturePayment } from '../utils/paypal.js'

class OrdenController {
    constructor() {}

    async crearOrden(req, res, next) {
        try {

            const nuevaOrden = await OrdenDAO.crearOrden(req.body)
            const urlAprobacion = await createOrder(nuevaOrden)

            res.status(201).json({
                message: 'Orden creada correctamente',
                url: urlAprobacion
            })
        } catch (error) {
            next(new AppError(error.message, 400))
        }
    }

    async capturarPago(req, res, next) {
        try {
            const { token } = req.query
            
            const result = await capturePayment(token)

            if (result.status === 'COMPLETED') {
                // actualizamos la orden como pagada
                await OrdenDAO.actualizarOrden(req.query.ordenId, {
                    estadoPago: 'Pagado',
                    paypalOrderId: token,
                    fechaPago: new Date()
                })

                // Redirigir a página de éxito
                // res.redirect(`${process.env.BASE_URL_FRONTEND}/pago-exitoso?ordenId=${req.query.ordenId}`)
                res.redirect(`${process.env.BASE_URL_FRONTEND}/principal?ordenId=${req.query.ordenId}`)
            } else {
                res.redirect(`${process.env.BASE_URL_FRONTEND}/principal`)
            }
        } catch (error) {
            console.error('Error capturando pago:', error)
            res.redirect(`${process.env.BASE_URL_FRONTEND}/pago-fallido`)
        }
    }

    // async agregarItemsAVenta(req, res, next) {
    //     try {
    //         const { id } = req.params
    //         const { items } = req.body

    //         if (!items || !Array.isArray(items) || items.length === 0) {
    //             throw new AppError('Debes enviar al menos un item válido', 400)
    //         }

    //         const ordenActualizada = await OrdenDAO.agregarItemsAVenta(id, items)

    //         res.status(200).json({
    //             message: 'Ítems agregados correctamente a la orden',
    //             data: ordenActualizada
    //         })
    //     } catch (error) {
    //         next(error instanceof AppError ? error : new AppError(error.message, 400))
    //     }
    // }

    async obtenerOrdenes(req, res, next) {
        try {
            const ordenes = await OrdenDAO.obtenerOrdenes()
            res.status(200).json(ordenes)
        } catch (error) {
            next(new AppError(error.message, 500))
        }
    }

    async obtenerOrdenPorId(req, res, next) {
        try {
            const orden = await OrdenDAO.obtenerOrdenPorId(req.params.id)
            if (!orden) {
                return next(new AppError('Orden no encontrada', 404))
            }
            res.status(200).json(orden)
        } catch (error) {
            next(new AppError(error.message, 400))
        }
    }

    async actualizarOrden(req, res, next) {
        try {
            const ordenActualizada = await OrdenDAO.actualizarOrden(req.params.id, req.body)
            if (!ordenActualizada) {
                return next(new AppError('Orden no encontrada', 404))
            }
            res.status(200).json({
                message: 'Orden actualizada correctamente',
                data: ordenActualizada
            })
        } catch (error) {
            next(new AppError(error.message, 400))
        }
    }

    async eliminarOrden(req, res, next) {
        try {
            const eliminada = await OrdenDAO.eliminarOrden(req.params.id)
            if (!eliminada) {
                return next(new AppError('Orden no encontrada', 404))
            }
            res.status(200).json({
                message: 'Orden eliminada correctamente'
            })
        } catch (error) {
            next(new AppError(error.message, 400))
        }
    }
}

export default new OrdenController()
