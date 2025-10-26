
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config({ path: './variable.env' })

const config = {
    url: process.env.URL_MONGO,
    options: {}
}

export function conectar () {
    return mongoose.connect(config.url, config.options)
}

export function desconectar () {
    return mongoose.disconnect()
}