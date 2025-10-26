
import mongoose from 'mongoose'

const eventoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    ubicacion: {
        type: String,
        required: true
    },
    idOrganizador: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organizador',
        required: true
    }],
    idArtista: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artista',
        required: true
    }],
    activo: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
})

export default mongoose.model('Evento', eventoSchema)