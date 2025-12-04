
import mongoose from 'mongoose'

const mercanciaSchema = new mongoose.Schema({
    idArtista: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    precio: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    moneda: {
        type: String,
        required: true,
        maxLength: 10
    },
    descripcion: {
        type: String,
        trim: true,
        maxlength: 1500
    },
    material: {
        type: String,
        trim: true,
        maxlength: 500
    },
    imagenes: [{
        type: String,
        trim: true,
        maxlength: 300
    }],
    tipoProducto: {
        type: String,
        trim: true,
        maxLength: 20
    },
    tallas: [{
        type: String,
        trim: true,
        maxlength: 5
    }],
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

export default mongoose.model('Mercancia', mercanciaSchema)