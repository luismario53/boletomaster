
import mongoose from 'mongoose'

const galeriaSchema = new mongoose.Schema({
    evento: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    fecha: {
        type: Date,
        required: true
    },
    descripcion: {
        type: String,
        trim: true,
        maxlength: 1500
    },
    imagenes: [{
        type: String,
        trim: true,
        maxlength: 500
    }],
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

export default mongoose.model('Galeria', galeriaSchema)