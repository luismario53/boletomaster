
import mongoose from 'mongoose'

const ordenVentaSchema = new mongoose.Schema({
    idItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
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
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

export default mongoose.model('Orden', ordenSchema)