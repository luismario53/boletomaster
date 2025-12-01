import mongoose from 'mongoose'

const eventoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  fecha: {
    type: Date,
    required: true
  },
  direccion: {
    type: String,
    required: true,
    trim: true
  },
  lugar: {
    type: String,
    required: true,
    trim: true
  },
  imagenes: [{
    type: String,
    trim: true,
    required: true
  }],
  descripcion: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  activo: {
    type: Boolean,
    default: true
  },
  // Usuarios con tipoUsuario = ORGANIZADOR
  organizadores: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: false
  }],
  // Usuarios con tipoUsuario = ARTISTA
  artistas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: false
  }],
}, {
  timestamps: true
})

export default mongoose.model('Evento', eventoSchema)
