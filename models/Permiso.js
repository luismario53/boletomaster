
import mongoose from 'mongoose'

const permisoSchema = new mongoose.Schema({
    nombre: {
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

export default mongoose.model('Permiso', permisoSchema)