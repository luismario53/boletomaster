
import mongoose from 'mongoose'

const lanzamientoSchema = new mongoose.Schema({
    idArtista: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artista',
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    imagen: {
        type: String,
        required: true
    },
    cancion: {
        type: String,
        required: true
    },
    activo: {
        type: Boolean,
        default: true
    },
    // fechaLanzamiento: {
    //     type: Date,
    //     required: true
    // }
}, {
    timestamps: true
})

export default mongoose.model('Lanzamiento', lanzamientoSchema)