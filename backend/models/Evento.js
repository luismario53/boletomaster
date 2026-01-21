import mongoose from 'mongoose'

/*const eventoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  fecha: {
    type: Date,
    required: true
  },
  hora: {
    type: String,
    required: true
  },
  direccion: {
    type: String,
    required: true,
    trim: true
  },
  precio: {
    type: Number,
    required: true
  },
  moneda: {
    type: String,
    required: true,
    maxLength: 10
  },
  stock: {
    type: Number,
    required: true
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
*/

const eventoSchema = new mongoose.Schema({
  titulo: { type: String, required: true, trim: true },
  fecha: { type: Date, required: true },
  hora: { type: String, required: true },
  
  lugar: { type: String, required: true, trim: true },
  direccion: { type: String, required: true, trim: true },
  
  precio: { type: Number, required: true },
  moneda: { type: String, required: true, maxLength: 10 },
  stock: { type: Number, required: true },
  
  imagenes: [{ type: String, trim: true, required: true }],
  descripcion: { type: String, trim: true, maxlength: 1000 },
  
  artistas: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario' 
  }],

  creador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },

  activo: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model('Evento', eventoSchema);