import { HeaderComponent } from "../../components/header/header.js";
import { FooterComponent } from "../../components/footer/footer.js";
import { CarouselComponent } from "../../components/carousel/carousel.js";
import { LanzamientoComponent } from "../../components/lanzamientos/lanzamiento.js";
import { MerchCardComponent } from "../../components/merch/merch-card.js";

window.customElements.define('header-info', HeaderComponent);
window.customElements.define('footer-info', FooterComponent);
window.customElements.define('carousel-info', CarouselComponent);
window.customElements.define('lanzamiento-card', LanzamientoComponent);
window.customElements.define('merch-card', MerchCardComponent);

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const artistId = params.get('id');

    if (artistId) {
        renderizarPerfilArtista(artistId);
    } else {
        document.querySelector('.main-content').innerHTML = '<h1>Artista no especificado</h1>';
    }
});

async function renderizarPerfilArtista(id) {
    try {
        // --- A. CARGAR DATOS DEL ARTISTA ---
        const response = await fetch(`http://localhost:5000/api/usuarios/${id}`);
        const datos = await response.json();

        if (!response.ok) {
            document.querySelector('.main-content').innerHTML = `<h1>Error: ${datos.mensaje || "Artista no encontrado"}</h1>`;
            return;
        }

        // CORRECCIÓN RUTAS (Sin /src)
        const imgPerfil = datos.imagenes?.perfil || "/assets/usuario.png";
        const imgBanner = datos.imagenes?.banner || "/assets/baner.png";
        const instagramLink = datos.redesSociales?.instagram || "#";
        const spotifyLink = datos.redesSociales?.spotify || "#";
        const discografia = datos.discografia || [];
        const bio = datos.biografia || "Información no disponible.";

        // 1. RENDER HERO
        const heroSection = document.getElementById('hero-section');
        let redesHTML = '';
        // CORRECCIÓN RUTAS ICONOS (Sin /src)
        if (datos.redesSociales?.spotify) redesHTML += `<a href="${spotifyLink}" target="_blank"><img src="/assets/icons/icon_spotify.png" alt="Spotify"></a>`;
        if (datos.redesSociales?.instagram) redesHTML += `<a href="${instagramLink}" target="_blank"><img src="/assets/icons/icon_instagram.png" alt="Instagram"></a>`;

        heroSection.innerHTML = `
            <img src="${imgBanner}" alt="${datos.nombre}" class="hero-bg">
            <div class="hero-overlay">
                <h1 class="artist-name-hero">${datos.nombre}</h1>
                <div class="hero-socials">${redesHTML}</div>
            </div>
        `;

        // 2. RENDER DISCOGRAFÍA
        const discographyContainer = document.getElementById('discography-container');
        discographyContainer.innerHTML = ''; 
        if (discografia.length > 0) {
            discografia.forEach(disco => {
                const card = document.createElement('lanzamiento-card');
                card.setAttribute('titulo', disco.titulo);
                card.setAttribute('artista', datos.nombre);
                // CORRECCIÓN RUTA (Sin /src)
                card.setAttribute('imagen', disco.imagen || "/assets/lanzamientos/portada1.png");
                discographyContainer.appendChild(card);
            });
        } else {
            discographyContainer.innerHTML = '<p style="color:#aaa">No hay lanzamientos registrados.</p>';
        }

        // 3. RENDER EVENTOS
        const eventsContainer = document.getElementById('events-container');
        const carousel = document.createElement('carousel-info');
        eventsContainer.appendChild(carousel);

        // 4. RENDER BIO
        const bioSection = document.getElementById('bio-section');
        bioSection.innerHTML = `
            <div class="bio-left-col">
                <img src="${imgPerfil}" alt="Foto ${datos.nombre}" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            </div>
            <div class="bio-right-col">
                <div class="bio-text-content">
                    <h3 style="color:#F8D62C; margin-bottom:20px;">BIOGRAFÍA</h3>
                    <p>${bio}</p>
                </div>
            </div>
        `;

        // --- B. CARGAR MERCH REAL DEL ARTISTA ---
        console.log("🔍 Buscando merch para Artista ID:", id); // DEBUG

        const merchResponse = await fetch(`http://localhost:5000/api/merch/artista/${id}`);
        const merchData = await merchResponse.json();
        
        console.log("📦 Merch encontrada:", merchData); // DEBUG

        const merchContainer = document.getElementById('merch-container');
        merchContainer.innerHTML = ''; 

        if (merchResponse.ok && merchData.length > 0) {
            merchData.forEach(prod => {
                // CORRECCIÓN RUTAS MERCH (Sin /src y replace)
                let rawImg = (prod.imagenes && prod.imagenes.length > 0) ? prod.imagenes[0] : '/assets/merch/merch1.png';
                // Solo reemplazamos \ por / si viene del backend, si es la default ya está bien
                let cleanImg = rawImg.replace(/\\/g, '/');
                
                // Si no tiene / al principio y no es http, se lo ponemos
                if (!cleanImg.startsWith('/') && !cleanImg.startsWith('http')) cleanImg = '/' + cleanImg;
                
                // Si la ruta ya tenía /src/ y quieres quitarlo, podrías hacer un replace extra, 
                // pero si viene de la BD déjalo como está guardado.
                
                const card = document.createElement('merch-card');
                card.setAttribute('id', prod._id);
                card.setAttribute('nombre', prod.nombre);
                card.setAttribute('imagen', cleanImg);
                card.setAttribute('precio', `$${prod.precio} MXN`);
                
                merchContainer.appendChild(card);
            });
        } else {
            merchContainer.innerHTML = '<p style="color:white; opacity:0.6;">Este artista aún no tiene mercancía disponible.</p>';
        }

    } catch (error) {
        console.error("Error al cargar perfil:", error);
    }
}