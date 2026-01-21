/*
import mongoose from 'mongoose'

const artistaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    biografia: {
        type: String,
        trim: true,
        maxlength: 1000 // Limita la longitud por cualquier cosa
    },
    email: { // contacto
        type: String,
        required: true,
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Por favor, usa un email válido']
    },
    redesSociales: { // para enlaces a redes
        instagram: String,
        spotify: String
    }
}, {
    timestamps: true
})

export default mongoose.model('Artista', artistaSchema)
*/