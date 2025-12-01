export class HeaderComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({mode: 'open'});
        this.#agregarEstilos(shadow);
        this.#render(shadow);
    }

    #render(shadow) {
        // --- RUTAS DE RECURSOS ---
        const logoURL = new URL('/assets/logo.jpg', import.meta.url).href;
        
        // --- RUTAS DE NAVEGACIÓN ---
        const homeURL = "/pages/Principal/main.html";
        const artistasURL = "/pages/Artistas/artists.html";
        const eventosURL = "/pages/Eventos/events.html";
        const galeriaURL = "/pages/Galeria/galeria.html";
        const tiendaURL = "/pages/Merchs/merchs.html";

        const loginURL = "/pages/Login/login.html";
        const userProfileURL = "/pages/Usuario/usuario.html";
        const userImgURL = "/assets/usuario.png"; 

        const artistaRegister = "/pages/ArtistaRegister/artista-register.html"; 
        const eventoRegister = "/pages/EventoRegister/evento-register.html"; 
        const merchRegister = "/pages/MerchRegister/merch-register.html"; 

        // --- LÓGICA DE SESIÓN ---
        const usuarioSesion = localStorage.getItem('usuario');
        
        let authHTML = '';

        if (usuarioSesion) {
            // CAMBIO: Envolvemos la imagen en un enlace <a>
            authHTML = `
                <a href="${userProfileURL}" class="user-profile-link">
                    <img src="${userImgURL}" alt="Usuario" class="user-avatar" title="Ir a mi perfil">
                </a>
            `;
        } else {
            // ... (el botón de iniciar sesión sigue igual) ...
            authHTML = `
                <a href="${loginURL}" class="login-btn">INICIAR SESIÓN</a>
            `;
        }

        shadow.innerHTML += `
            <header class="main-header">
                <a href="${homeURL}" class="logo-link">
                    <img src="${logoURL}" alt="Logo" class="logo" />
                </a>

                <div class="header-right">
                    
                    <nav class="nav-menu">
                        <a href="${artistasURL}">ARTISTAS</a>
                        <a href="${eventosURL}">EVENTOS</a>
                        <a href="${galeriaURL}">GALERÍA</a>
                        <a href="${tiendaURL}">MERCH</a>
                    </nav>

                    <div class="auth-section">
                        ${authHTML}
                    </div>

                </div>
            </header>
        `;
    }

    #agregarEstilos(shadow) {
        const link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        const rutaCSS = new URL('./header.css', import.meta.url).href;
        link.setAttribute("href", rutaCSS);
        shadow.appendChild(link);
    }
}