import express from 'express';
import morgan from 'morgan';
import { conectar } from './config/db.js'
// 1. IMPORTAR CORS
import cors from 'cors'; 

import './models/index.js'
import eventoRouter from './routes/eventoRoutes.js'
import galeriaRouter from './routes/galeriaRoutes.js'
import usuariosRouter from './routes/usuarioRoutes.js'
import mercanciaRouter from './routes/mercanciaRoutes.js'
import authRouter from './routes/authRoutes.js'
import lanzamientoRouter from './routes/LanzamientoRoutes.js';
import ordenesRouter from './routes/ordenRoutes.js';

conectar()

const app = express();

// 2. USAR CORS (¡Muy importante que esté arriba!)
// Esto permite que CUALQUIER frontend hable con tu backend.
app.use(cors()); 

app.use(express.json());
app.use(morgan('combined'));

app.post('/api/live', (req, res) => {
    return res.status(200).json({message: 'La API esta corriendo y es accesible'})
})

app.use('/api/galeria/', galeriaRouter)
app.use('/api/eventos/', eventoRouter)
app.use('/api/usuarios/', usuariosRouter)
app.use('/api/merch/', mercanciaRouter)
app.use('/api/auth/', authRouter)
app.use('/api/lanzamientos/', lanzamientoRouter)
app.use('/api/ordenes/', ordenesRouter)


const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`El servidor esta corriendo en el puerto ${PORT}`)
})