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
        const userImgURL = "/assets/usuario.png"; 
        
        // --- RUTAS DE NAVEGACIÓN ---
        // (Ajustadas sin /src/ como te funcionó antes)
        const homeURL = "/pages/Principal/main.html";
        const artistasURL = "/pages/Artistas/artists.html";
        const eventosURL = "/pages/Eventos/events.html";
        const galeriaURL = "/pages/Galeria/galeria.html";
        const carritoURL = "/pages/Carrito/carrito.html";
        const tiendaURL = "/pages/Merchs/merchs.html";

        const loginURL = "/pages/Login/login.html";
        const userProfileURL = "/pages/Usuario/usuario.html";

        // --- LÓGICA DE SESIÓN ---
        
        // 1. IMPORTANTE: Usar la misma clave que en login.js ('usuario_sonicolirio')
        let usuarioSesion = localStorage.getItem('usuario_sonicolirio');
        
        // Debugging: Mira la consola del navegador para ver esto
        console.log("Header buscando sesión:", usuarioSesion);

        // 2. Limpieza de basura (si se guardó "undefined" o "null" como texto)
        if (usuarioSesion === "undefined" || usuarioSesion === "null") {
            usuarioSesion = null;
            localStorage.removeItem('usuario_sonicolirio');
        }
        
        let authHTML = '';

        if (usuarioSesion) {
            // CASO: HAY SESIÓN -> Mostrar Foto
            console.log("✅ Sesión detectada. Mostrando avatar.");
            authHTML = `
                <a href="${userProfileURL}" class="user-profile-link">
                    <img src="${userImgURL}" alt="Usuario" class="user-avatar" title="Ir a mi perfil">
                </a>
            `;
        } else {
            // CASO: NO HAY SESIÓN -> Mostrar Botón
            console.log("❌ No hay sesión. Mostrando botón login.");
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
                        <a href="${tiendaURL}">MERCH</a>
                        <a href="${galeriaURL}">GALERÍA</a>
                        <a href="${carritoURL}">CARRITO</a>
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