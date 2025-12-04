import mongoose from 'mongoose';

const lanzamientoSchema = mongoose.Schema({
    titulo: { type: String, required: true },
    imagen: { type: String, required: true },
    spotify: String,
    youtube: String,
    
    // Relación con el Usuario (Artista)
    idArtista: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    nombreArtista: String, // Opcional, pero útil para mostrar rápido

    createdAt: { type: Date, default: Date.now }
});

const Lanzamiento = mongoose.model('Lanzamiento', lanzamientoSchema);
export default Lanzamiento;