/*
import mongoose from 'mongoose'

const galeriaSchema = new mongoose.Schema({
    evento: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    fecha: {
        type: Date,
        required: true
    },
    descripcion: {
        type: String,
        trim: true,
        maxlength: 1500
    },
    imagenes: [{
        type: String,
        trim: true,
        maxlength: 500
    }],
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

export default mongoose.model('Galeria', galeriaSchema)
*/

import mongoose from 'mongoose';

const galeriaSchema = mongoose.Schema({
    evento: { type: String, required: true }, // Nombre del evento/álbum
    fecha: { type: String },
    descripcion: String,
    
    fotos: [String], // Array de URLs

    createdAt: { type: Date, default: Date.now }
});

const Galeria = mongoose.model('Galeria', galeriaSchema);
export default Galeria;