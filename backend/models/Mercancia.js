
import mongoose from 'mongoose'

const mercanciaSchema = new mongoose.Schema({
    idArtista: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artista',
        required: true
    },
    idItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    // imagen: {
    //     type: String,
    //     required: true
    // },
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

export default mongoose.model('Mercancia', mercanciaSchema)