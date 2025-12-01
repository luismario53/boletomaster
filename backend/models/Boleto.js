import mongoose from 'mongoose'
import { TIPO_ASIENTO } from '../constants/enums.js' 

const boletoSchema = new mongoose.Schema({

    // Tipo o categoría del asiento (ej. VIP, General)
    tipoAsiento: {
        type: String,
        required: true,
        // Usamos el enum para asegurar que solo se ingresen valores válidos
        // Object.values(TIPO_ASIENTO) obtiene un array de los valores del objeto
        enum: Object.values(TIPO_ASIENTO) 
    },
    
    idUsuario: { // al que pertenece el bolteo
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    
    idEvento: { // del evento al que pertenece este boleto
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evento',
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    moneda: {
        type: String,
        required: true,
        maxLength: 10
    },
    activo: { // el boleto es válido/no ha sido usado
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
})

export default mongoose.model('Boleto', boletoSchema)