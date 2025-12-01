import { HeaderComponent } from "../../components/header/header.js";
import { FooterComponent } from "../../components/footer/footer.js";

window.customElements.define('header-info', HeaderComponent);
window.customElements.define('footer-info', FooterComponent);

document.addEventListener('DOMContentLoaded', () => {
    // Verificar si realmente hay sesión
    const haySesion = localStorage.getItem('usuario_sonicolirio');
    
    if (!haySesion) {
        window.location.href = "/pages/Login/login.html";
    } else {
        renderizarUsuario();
    }
});

function renderizarUsuario() {
    // ==========================================
    // MAS HARDCODEO
    // ==========================================
    const usuario = {
        nombre: "Juan Pérez",
        email: "admin@sonicolirio.com",
        telefono: "55 1234 5678",
        // tipoUsuario: "CLIENTE",
        // tipoUsuario: "ARTISTA",
        tipoUsuario: "ORGANIZADOR",
        avatar: "/assets/usuario.png",
        fechaRegistro: "2024-01-15"
    };

    const container = document.getElementById('profile-content');

    let adminButtonsHTML = '';

    if (usuario.tipoUsuario === 'ORGANIZADOR') {
        const artistaRegister = "/pages/ArtistaRegister/artista-register.html";
        const eventoRegister = "/pages/EventoRegister/evento-register.html";
        const merchRegister = "/pages/MerchRegister/merch-register.html";

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
                </div>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="profile-header">
            <img src="${usuario.avatar}" alt="${usuario.nombre}" class="big-avatar">
            <span class="badge">${usuario.tipoUsuario}</span>
        </div>

        <div class="profile-body">
            <h1 class="user-name">${usuario.nombre}</h1>
            <p class="user-email">${usuario.email}</p>

            <div class="data-group">
                <div class="data-item">
                    <strong>Teléfono:</strong>
                    <span>${usuario.telefono}</span>
                </div>
                <div class="data-item">
                    <strong>Miembro desde:</strong>
                    <span>${usuario.fechaRegistro}</span>
                </div>
            </div>

            ${adminButtonsHTML}

            <hr class="divider"> <button id="btn-logout" class="logout-btn">
                CERRAR SESIÓN
            </button>
        </div>
    `;

    document.getElementById('btn-logout').addEventListener('click', cerrarSesion);
}

function cerrarSesion() {
    if(confirm("¿Estás seguro que deseas salir?")) {
        localStorage.removeItem('usuario_sonicolirio');
        window.location.href = "/pages/Principal/main.html";
    }
}