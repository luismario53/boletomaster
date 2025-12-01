import express from 'express';
// import { AppError } from './utils/appError.js';
import morgan from 'morgan';
// import jwt from 'jsonwebtoken'
// import productoRouter from './router/productoRouter.js'
import { conectar } from './config/db.js'
// import validateJWT from './utils/ValidateJWT.js'

import './models/index.js'
import eventoRouter from './routes/eventoRoutes.js'
import usuariosRouter from './routes/usuarioRoutes.js'
import mercanciaRouter from './routes/mercanciaRoutes.js'
import authRouter from './routes/authRoutes.js'

conectar()

const app = express();
//Middleware para analizar los datos del cuerpo de las solicitudes en formato JSON
app.use(express.json());

//Configurar el middleware de morgan para el registro de solicitudes en consola
app.use(morgan('combined'));

app.post('/api/live', (req, res) => {
    return res.status(200).json({message: 'La API esta corriendo y es accesible'})

})

// app.use((req, res, next)=>{
//     const error = new AppError(`No se ha podido acceder a ${req.originalUrl} en el servidor`, 404);
//     next(error);
// });

app.use('/api/eventos/', eventoRouter)
app.use('/api/usuarios/', usuariosRouter)
app.use('/api/merch/', mercanciaRouter)
app.use('/api/auth/', authRouter)

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`El servidor esta corriendo en el puerto ${PORT}`)
})