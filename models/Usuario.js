
import mongoose from 'mongoose'

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    telefono: {
        type: Number,
        required: true
    },
    idRol: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rol',
        required: true
    },
    eventos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evento',
        required: true
    }],
    ordenes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Orden',
        required: true
    }],
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

export default mongoose.model('Usuario', usuarioSchema)