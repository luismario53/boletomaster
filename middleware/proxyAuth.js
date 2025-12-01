/**
 * Middleware que extrae el token del header y lo adjunta a req
 * para que esté disponible en todas las rutas del proxy
 */
export function extraerToken(req, res, next) {
  req.authHeader = req.headers.authorization || null
  next()
}

/**
 * Helper para crear headers con autenticación
 */
export function crearHeadersConAuth(req, contentType = 'application/json') {
  const headers = {
    'Content-Type': contentType
  }

  if (req.authHeader) {
    headers['Authorization'] = req.authHeader
  }

  return headers
}