/**
 * Fetch con autenticación automática
 * Incluye el token en todas las peticiones
 */
export async function fetchConAuth(url, options = {}) {
  const token = localStorage.getItem('token')

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    }
  }

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, config)

  // Si el token expiró, redirigir al login
  if (response.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('usuario')
    alert('Tu sesión ha expirado. Por favor inicia sesión nuevamente.')
    window.location.href = '/pages/Login/login.html'
    return
  }

  return response
}

/**
 * Verificar si el usuario está autenticado
 */
export function estaAutenticado() {
  return localStorage.getItem('token') !== null
}

/**
 * Obtener datos del usuario actual
 */
export function obtenerUsuario() {
  const usuario = localStorage.getItem('usuario')
  return usuario ? JSON.parse(usuario) : null
}

/**
 * Cerrar sesión
 */
export function cerrarSesion() {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('usuario')
  window.location.href = '/pages/principal/main.html'
}

/**
 * Proteger página - redirige si no está autenticado
 */
export function protegerPagina() {
  if (!estaAutenticado()) {
    window.location.href = '/pages/Login/login.html'
  }
}