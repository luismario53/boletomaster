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
    localStorage.removeItem('usuario_sonicolirio')
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
  const usuario = localStorage.getItem('usuario_sonicolirio')
  return usuario ? JSON.parse(usuario) : null
}

/**
 * Cerrar sesión
 */
export function cerrarSesion() {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('usuario_sonicolirio')
  window.location.href = '/pages/principal/main.html'
}


/**
 * Verificar si el usuario tiene alguno de los roles especificados
 * @param {...string} roles - Roles permitidos
 * @returns {boolean}
 */
export function tieneAlgunRol(...roles) {
  const usuario = obtenerUsuario()
  return usuario ? roles.includes(usuario.tipoUsuario) : false
}


/**
 * Proteger página por rol - redirige si no tiene el rol requerido
 * @param {...string} rolesPermitidos - Roles que pueden acceder (por defecto: ADMINISTRADOR)
 */
export function protegerPaginaPorRol(...rolesPermitidos) {
  if (rolesPermitidos.length === 0) {
    rolesPermitidos = ['ADMINISTRADOR']
  }

  if (!estaAutenticado()) {
    window.location.href = '/pages/Login/login.html'
    return
  }

  if (!tieneAlgunRol(...rolesPermitidos)) {
    alert('No tienes permisos para acceder a esta página')
    window.location.href = '/pages/principal/main.html'
  }
}

