import { HeaderComponent } from "../../components/header/header.js";
import { FooterComponent } from "../../components/footer/footer.js";

window.customElements.define('header-info', HeaderComponent);
window.customElements.define('footer-info', FooterComponent);

document.addEventListener('DOMContentLoaded', () => {
    // 1. VERIFICAR SESIÓN CON LA LLAVE CORRECTA
    const usuarioJSON = localStorage.getItem('usuario_sonicolirio'); // <--- CORRECCIÓN CLAVE
    
    if (!usuarioJSON) {
        // Si no hay sesión, ir al login
        window.location.href = "/src/pages/Login/login.html";
    } else {
        try {
            const usuario = JSON.parse(usuarioJSON);
            renderizarUsuario(usuario);
        } catch (error) {
            console.error("Error al leer usuario:", error);
            localStorage.removeItem('usuario_sonicolirio'); // Limpiar si está corrupto
            window.location.href = "/src/pages/Login/login.html";
        }
    }
});

function renderizarUsuario(usuario) {
    const { nombre, telefono, createdAt: fechaRegistro, email, tipoUsuario } = usuario;
    
    // Función simple para formatear fecha (sin importar archivos externos)
    const fechaObj = new Date(fechaRegistro || Date.now());
    const fechaFormateada = fechaObj.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

    const container = document.getElementById('profile-content');

    // --- BOTONES DE ADMIN ---
    // ... dentro de renderizarUsuario ...

    let adminButtonsHTML = '';

    // PANEL PARA ORGANIZADORES / ADMINS
    if (usuario.tipoUsuario === 'ORGANIZADOR' || usuario.tipoUsuario === 'ADMIN') {
        const artistaRegister = "/pages/ArtistaRegister/artista-register.html";
        const eventoRegister = "/pages/EventoRegister/evento-register.html";
        const merchRegister = "/pages/MerchRegister/merch-register.html";
        const galeriaRegister = "/pages/GaleriaRegister/galeria-register.html";

        adminButtonsHTML = `
            <div class="admin-panel">
                <p class="admin-title">PANEL DE GESTIÓN</p>
                <div class="admin-grid">
                    <a href="${artistaRegister}" class="admin-btn"><span></span> Nuevo Artista</a>
                    <a href="${eventoRegister}" class="admin-btn"><span></span> Nuevo Evento</a>
                    <a href="${merchRegister}" class="admin-btn"><span></span> Nueva Merch</a>
                    <a href="${galeriaRegister}" class="admin-btn"><span></span> Nueva Galería</a>
                </div>
            </div>
        `;
    } 
    // PANEL EXCLUSIVO PARA ARTISTAS (NUEVO)
    else if (usuario.tipoUsuario === 'ARTISTA') {
        const lanzamientoRegister = "/pages/LanzamientoRegister/lanzamiento-register.html";
        
        adminButtonsHTML = `
            <div class="admin-panel">
                <p class="admin-title">PANEL DE ARTISTA</p>
                <div class="admin-grid" style="grid-template-columns: 1fr;"> <a href="${lanzamientoRegister}" class="admin-btn">
                        <span></span> Nuevo Lanzamiento
                    </a>
                </div>
            </div>
        `;
    }

    // --- RENDERIZADO ---
    container.innerHTML = `
        <div class="profile-header">
            <img src="/assets/usuario.png" alt="${nombre}" class="big-avatar">
            <span class="badge">${tipoUsuario}</span>
        </div>

        <div class="profile-body">
            <h1 class="user-name">${nombre}</h1>
            <p class="user-email">${email}</p>

            <div class="data-group">
                <div class="data-item">
                    <strong>Teléfono:</strong>
                    <span>${telefono || 'No registrado'}</span>
                </div>
                <div class="data-item">
                    <strong>Miembro desde:</strong>
                    <span>${fechaFormateada}</span>
                </div>
            </div>

            ${adminButtonsHTML}

            <hr class="divider"> 
            
            <button id="btn-logout" class="logout-btn">
                CERRAR SESIÓN
            </button>
        </div>
    `;

    document.getElementById('btn-logout').addEventListener('click', cerrarSesionUsuario);
}

function cerrarSesionUsuario() {
    if(confirm("¿Estás seguro que deseas salir?")) {
        // Borrar la sesión
        localStorage.removeItem('usuario_sonicolirio');
        localStorage.removeItem('token'); // Si guardaste el token también
        
        // Ir al Home
        window.location.href = "/pages/Principal/main.html";
    }
}