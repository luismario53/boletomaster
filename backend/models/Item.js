
import mongoose from "mongoose"

const itemSchema = new mongoose.Schema({
    nombre: {
        type: String, 
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    tipoItem: {
        type: String,
        required: true
    },
    activo: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
})

export default mongoose.model('Item', itemSchema)