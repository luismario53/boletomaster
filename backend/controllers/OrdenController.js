import Orden from '../models/Orden.js';
import Mercancia from '../models/Mercancia.js';
import Evento from '../models/Evento.js';
import AppError from '../utils/AppError.js';
import * as paypalService from '../utils/paypal.js';

const OrdenController = {

    // ==========================================
    // 1. PROCESO DE PAGO (PAYPAL)
    // ==========================================

    async crearOrden(req, res, next) {
        try {
            const { idCliente, productos } = req.body;
            console.log("🛒 Procesando orden para:", idCliente);

            if (!productos || productos.length === 0) {
                return next(new AppError('El carrito está vacío', 400));
            }

            let totalCalculado = 0;
            const itemsProcesados = [];

            // 1. Calcular precios reales desde la BD
            for (const item of productos) {
                let precioReal = 0;
                let tipo = '';

                if (item.tipoProducto === 'Mercancia') {
                    const prod = await Mercancia.findById(item._id);
                    if (!prod) return next(new AppError(`Producto ${item._id} no encontrado`, 404));
                    precioReal = prod.precio;
                    tipo = 'Mercancia';
                } else {
                    const evento = await Evento.findById(item._id);
                    if (!evento) return next(new AppError(`Evento ${item._id} no encontrado`, 404));
                    precioReal = evento.precio;
                    tipo = 'Boleto';
                }

                const subtotal = precioReal * item.cantidad;
                totalCalculado += subtotal;

                itemsProcesados.push({
                    tipoProducto: tipo, 
                    idProducto: item._id,
                    precioVenta: precioReal,
                    cantidad: item.cantidad,
                    subtotal: subtotal
                });
            }

            console.log("Total a cobrar:", totalCalculado);

            // 2. Crear Orden en Mongo
            const iva = parseFloat((totalCalculado * 0.16).toFixed(2));
            
            const nuevaOrden = new Orden({
                idCliente: idCliente,
                fecha: new Date(),
                total: totalCalculado, 
                iva: iva,              
                ordenDetalle: itemsProcesados,
                estadoPago: 'Pendiente'
            });

            await nuevaOrden.save();

            // 3. Llamar a PayPal
            const urlAprobacion = await paypalService.createOrder(nuevaOrden);

            res.status(201).json({
                message: 'Orden creada, redirigiendo a PayPal',
                url: urlAprobacion
            });

        } catch (error) {
            console.error("Error crearOrden:", error);
            next(new AppError(error.message, 500));
        }
    },

    async capturarPago(req, res, next) {
        // Fallback por si falla la variable de entorno
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

        try {
            const { token } = req.query; 
            
            // CORRECCIÓN: Quitamos /src de la ruta
            if(!token) return res.redirect(`${clientUrl}/pages/Carrito/carrito.html?status=cancel`);

            console.log("💳 Capturando pago:", token);

            const result = await paypalService.capturePayment(token);

            if (result.status === 'COMPLETED') {
                const ordenIdInterna = result.purchase_units[0].reference_id;

                const orden = await Orden.findById(ordenIdInterna);
                if (orden) {
                    orden.estadoPago = 'Pagado';
                    orden.paypalOrderId = token;
                    await orden.save();
                }

                // CORRECCIÓN: Quitamos /src
                res.redirect(`${clientUrl}/pages/Carrito/carrito.html?status=success&orden=${ordenIdInterna}`);
            } else {
                // CORRECCIÓN: Quitamos /src
                res.redirect(`${clientUrl}/pages/Carrito/carrito.html?status=failed`);
            }
        } catch (error) {
            console.error('Error capturando pago:', error);
            // CORRECCIÓN: Quitamos /src
            res.redirect(`${clientUrl}/pages/Carrito/carrito.html?status=error`);
        }
    },

    async cancelarPago(req, res) {
         const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
         // CORRECCIÓN: Quitamos /src
         res.redirect(`${clientUrl}/pages/Carrito/carrito.html?status=cancel`);
    },

    // ==========================================
    // 2. GESTIÓN DE ÓRDENES (ADMINISTRADOR)
    // ==========================================

    // Esta es la función que te faltaba y causaba el error
    async obtenerOrdenes(req, res, next) {
        try {
            const ordenes = await Orden.find()
                .populate('idCliente', 'nombre email')
                .sort({ fecha: -1 });
            res.status(200).json(ordenes);
        } catch (error) {
            next(new AppError(error.message, 500));
        }
    },

    async obtenerOrdenPorId(req, res, next) {
        try {
            const orden = await Orden.findById(req.params.id).populate('idCliente', 'nombre email');
            if (!orden) return next(new AppError('Orden no encontrada', 404));
            res.status(200).json(orden);
        } catch (error) {
            next(new AppError(error.message, 400));
        }
    },

    async eliminarOrden(req, res, next) {
        try {
            const orden = await Orden.findByIdAndDelete(req.params.id);
            if (!orden) return next(new AppError('Orden no encontrada', 404));
            res.status(200).json({ message: 'Orden eliminada' });
        } catch (error) {
            next(new AppError(error.message, 400));
        }
    }
};

export default OrdenController;