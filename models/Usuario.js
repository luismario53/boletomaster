import mongoose from 'mongoose'
import { TIPO_USUARIO } from '../constants/enums.js'

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // evita duplicados
        lowercase: true,
        trim: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Por favor, usa un email válido']
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    telefono: {
        type: String,
        required: true
    },

    // tipo de usuario (cliente, organizador, artista, admin)
    tipoUsuario: {
        type: String,
        required: true,
        enum: Object.values(TIPO_USUARIO),
        default: TIPO_USUARIO.CLIENTE
    },

    // 🔸 Rol del usuario (para permisos granulares)
    idRol: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rol',
        required: true
    },

    // 🔸 Campos específicos para ARTISTA
    biografia: {
        type: String,
        trim: true,
        maxlength: 1000
    },
    redesSociales: {
        instagram: { type: String, trim: true },
        spotify: { type: String, trim: true }
    },

    // 🔸 Campos específicos para ORGANIZADOR
    contacto: {
        type: String,
        trim: true
    },

    // 🔸 Eventos creados o gestionados (organizador o artista)
    eventos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evento'
    }],

    // 🔸 Órdenes o compras realizadas (clientes)
    ordenes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Orden'
    }],

    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

export default mongoose.model('Usuario', usuarioSchema)
