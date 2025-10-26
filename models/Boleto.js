
import mongoose from 'mongoose'

const boletoSchema = new mongoose.Schema({
    idItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    },
    tipoAsiento: {
        type: String,
        required: true
    },
    idUsuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    idEvento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evento'
    },
    activo: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
})

export default mongoose.model('Boleto', boletoSchema)

