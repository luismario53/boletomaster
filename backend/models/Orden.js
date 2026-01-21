
import mongoose from 'mongoose'

const ordenVentaSchema = new mongoose.Schema({
    tipoProducto: {
        type: String,
        required: true,
        enum: ['Mercancia', 'Boleto']  // los nombres de tus modelos
    },
    idProducto: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'tipoProducto'
    },
    precioVenta: {
        type: Number,
        required: true
    },
    cantidad: {
        type: Number,
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

const ordenSchema = new mongoose.Schema({
    idCliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    iva: {
        type: Number,
        required: true
    },
    ordenDetalle: [ordenVentaSchema],
    // Nuevos campos para PayPal
    estadoPago: {
        type: String,
        enum: ['Pendiente', 'Pagado', 'Cancelado', 'Fallido'],
        default: 'Pendiente'
    },
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

export default mongoose.model('Orden', ordenSchema)