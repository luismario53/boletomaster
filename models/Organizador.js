
import mongoose from 'mongoose'

const organizadorSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    contacto: {
        type: String,
        required: true
    },
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

export default mongoose.model('Organizador', organizadorSchema)