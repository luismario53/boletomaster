
import CryptoJS from './crypto.js'

const CLAVE_ENCRIPTACION = 's3s@m0-3ncr1pt4d0'
const STORAGE_KEY = 'carrito'

/**
 * Encriptar datos
 */
function encriptar(data) {
  const jsonString = JSON.stringify(data)
  return CryptoJS.AES.encrypt(jsonString, CLAVE_ENCRIPTACION).toString()
}

/**
 * Desencriptar datos
 */
function desencriptar(encryptedData) {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, CLAVE_ENCRIPTACION)
    const jsonString = bytes.toString(CryptoJS.enc.Utf8)
    return JSON.parse(jsonString)
  } catch (error) {
    console.error('Error al desencriptar carrito:', error)
    return []
  }
}

/**
 * Guardar carrito
 */
function guardarCarrito(carrito) {
  const encriptado = encriptar(carrito)
  localStorage.setItem(STORAGE_KEY, encriptado)
}


/**
 * Obtener carrito completo
 */
export function obtenerCarrito() {
  const encriptado = localStorage.getItem(STORAGE_KEY)
  return encriptado ? desencriptar(encriptado) : []
  // if (!encriptado) return []
  // return desencriptar(encriptado)
}

/**
 * Agregar producto al carrito
 */
export const agregarAlCarrito = (producto) => {
  const carrito = obtenerCarrito()
  
  // Buscar si ya existe (mismo _id y talla)
  const indice = carrito.findIndex(
    item => item._id === producto._id && item.talla === producto.talla
  )

  if (indice !== -1) {
    carrito[indice].cantidad += producto.cantidad || 1
  } else {
    carrito.push({
      _id: producto._id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: producto.cantidad || 1,
      imagen: producto.imagenes[0],
      talla: producto.talla || null
    })
  }

  guardarCarrito(carrito)
  return carrito
}

/**
 * Actualizar cantidad de un producto
 */
export const actualizarCantidad = (_id, talla, cantidad) => {
  const carrito = obtenerCarrito()
  const indice = carrito.findIndex(
    item => item._id === _id && item.talla === talla
  )

  if (indice !== -1) {
    if (cantidad <= 0) {
      carrito.splice(indice, 1)
    } else {
      carrito[indice].cantidad = cantidad
    }
    guardarCarrito(carrito)
  }

  return carrito
}

/**
 * Eliminar producto del carrito
 */
export const eliminarDelCarrito = (_id, talla = null) => {
  let carrito = obtenerCarrito()
  carrito = carrito.filter(
    item => !(item._id === _id && item.talla === talla)
  )
  guardarCarrito(carrito)
  return carrito
}

/**
 * Vaciar carrito
 */
export const vaciarCarrito = () => {
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Obtener total del carrito
 */
export const obtenerTotal = () => {
  const carrito = obtenerCarrito()
  return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0)
}

/**
 * Obtener cantidad total de items
 */
export const obtenerCantidadItems = () => {
  const carrito = obtenerCarrito()
  return carrito.reduce((total, item) => total + item.cantidad, 0)
}