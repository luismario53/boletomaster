
import mongoose from 'mongoose'

const rolSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    permisos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permiso',
        required: true
    }],
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true 
})

export default mongoose.model('Rol', rolSchema)