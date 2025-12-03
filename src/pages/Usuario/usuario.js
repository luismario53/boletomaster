import { HeaderComponent } from "../../components/header/header.js";
import { FooterComponent } from "../../components/footer/footer.js";
import { formatearFecha } from '../../utils/fechaFormateada.js'
import { fetchConAuth, protegerPaginaPorRol, obtenerUsuario, cerrarSesion } from '../../utils/fetchConAuth.js'

window.customElements.define('header-info', HeaderComponent);
window.customElements.define('footer-info', FooterComponent);

protegerPaginaPorRol()
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si realmente hay sesión
    const usuario = localStorage.getItem('usuario');
    
    if (!usuario) {
        window.location.href = "/pages/Login/login.html";
    } else {
        renderizarUsuario();
    }
});

function renderizarUsuario() {
 
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const { nombre, telefono, createdAt: fechaRegistro, email, tipoUsuario } = usuario
    const fechaFormateada = formatearFecha(fechaRegistro)

    const container = document.getElementById('profile-content');

    let adminButtonsHTML = '';

    if (usuario.tipoUsuario === 'ORGANIZADOR') {
        const artistaRegister = "/pages/ArtistaRegister/artista-register.html";
        const eventoRegister = "/pages/EventoRegister/evento-register.html";
        const merchRegister = "/pages/MerchRegister/merch-register.html";
        const galeriaRegister = "/pages/GaleriaRegister/galeria-register.html";

        adminButtonsHTML = `
            <div class="admin-panel">
                <p class="admin-title">PANEL DE GESTIÓN</p>
                <div class="admin-grid">
                    <a href="${artistaRegister}" class="admin-btn">
                        <span></span> Nuevo Artista
                    </a>
                    <a href="${eventoRegister}" class="admin-btn">
                        <span></span> Nuevo Evento
                    </a>
                    <a href="${merchRegister}" class="admin-btn">
                        <span></span> Nueva Merch
                    </a>
                    <a href="${galeriaRegister}" class="admin-btn">
                        <span></span> Nuevo Album
                    </a>
                </div>
            </div>
        `;
    }

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
                    <span>${telefono}</span>
                </div>
                <div class="data-item">
                    <strong>Miembro desde:</strong>
                    <span>${fechaFormateada}</span>
                </div>
            </div>

            ${adminButtonsHTML}

            <hr class="divider"> <button id="btn-logout" class="logout-btn">
                CERRAR SESIÓN
            </button>
        </div>
    `;

    document.getElementById('btn-logout').addEventListener('click', cerrarSesionUsuario);
}

function cerrarSesionUsuario() {
    if(confirm("¿Estás seguro que deseas salir?")) {
        cerrarSesion()
    }
}