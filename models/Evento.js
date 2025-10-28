import mongoose from 'mongoose'

const eventoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  fecha: {
    type: Date,
    required: true
  },
  ubicacion: {
    type: String,
    required: true,
    trim: true
  },

  // Usuarios con tipoUsuario = ORGANIZADOR
  organizadores: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  }],

  // Usuarios con tipoUsuario = ARTISTA
  artistas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
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
  }
}, {
  timestamps: true
})

export default mongoose.model('Evento', eventoSchema)
