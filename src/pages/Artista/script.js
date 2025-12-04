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
        // --- A. CARGAR DATOS DEL ARTISTA (Info Básica) ---
        const response = await fetch(`http://localhost:5000/api/usuarios/${id}`);
        const datos = await response.json();

        if (!response.ok) {
            document.querySelector('.main-content').innerHTML = `<h1>Error: ${datos.mensaje || "Artista no encontrado"}</h1>`;
            return;
        }

        // Sanitizar datos básicos
        const imgPerfil = datos.imagenes?.perfil || "/assets/usuario.png";
        const imgBanner = datos.imagenes?.banner || "/assets/baner.png";
        const instagramLink = datos.redesSociales?.instagram || "#";
        const spotifyLink = datos.redesSociales?.spotify || "#";
        const bio = datos.biografia || "Información no disponible.";

        // 1. RENDER HERO
        const heroSection = document.getElementById('hero-section');
        let redesHTML = '';
        if (datos.redesSociales?.spotify) redesHTML += `<a href="${spotifyLink}" target="_blank"><img src="/assets/icons/icon_spotify.png" alt="Spotify"></a>`;
        if (datos.redesSociales?.instagram) redesHTML += `<a href="${instagramLink}" target="_blank"><img src="/assets/icons/icon_instagram.png" alt="Instagram"></a>`;

        heroSection.innerHTML = `
            <img src="${imgBanner}" alt="${datos.nombre}" class="hero-bg">
            <div class="hero-overlay">
                <h1 class="artist-name-hero">${datos.nombre}</h1>
                <div class="hero-socials">${redesHTML}</div>
            </div>
        `;

        // --- B. CARGAR LANZAMIENTOS REALES (NUEVO) ---
        console.log("🎵 Buscando lanzamientos para:", id);
        
        // Petición a la colección de lanzamientos
        const lanzamientosResponse = await fetch(`http://localhost:5000/api/lanzamientos/artista/${id}`);
        const lanzamientosData = await lanzamientosResponse.json();

        // 2. RENDER DISCOGRAFÍA
        const discographyContainer = document.getElementById('discography-container');
        discographyContainer.innerHTML = ''; 

        if (lanzamientosResponse.ok && lanzamientosData.length > 0) {
            lanzamientosData.forEach(disco => {
                // Sanitizar imagen
                let rawImg = disco.imagen || "/assets/lanzamientos/portada1.png";
                let cleanImg = rawImg.replace(/\\/g, '/');
                if (!cleanImg.startsWith('/') && !cleanImg.startsWith('http')) cleanImg = '/' + cleanImg;

                const card = document.createElement('lanzamiento-card');
                card.setAttribute('titulo', disco.titulo);
                card.setAttribute('artista', datos.nombre);
                card.setAttribute('imagen', cleanImg);
                
                if (disco.spotify) {
                    card.setAttribute('spotify-link', disco.spotify);
                    card.setAttribute('icon-spotify', '/assets/icons/icon_spotify.png');
                }
                if (disco.youtube) {
                    card.setAttribute('youtube-link', disco.youtube);
                    card.setAttribute('icon-youtube', '/assets/icons/icon_youtube.png');
                }

                discographyContainer.appendChild(card);
            });
        } else {
            discographyContainer.innerHTML = '<p style="color:#aaa">No hay lanzamientos registrados.</p>';
        }

        // 3. RENDER EVENTOS (Carrusel Filtrado)
        const eventsContainer = document.getElementById('events-container');
        eventsContainer.innerHTML = ''; 

        const carousel = document.createElement('carousel-info');
        
        // PASAMOS EL ID DEL ARTISTA PARA FILTRAR
        carousel.setAttribute('filtro-artista', id); 
        
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

        // --- C. CARGAR MERCH REAL ---
        console.log("🔍 Buscando merch para:", id);
        const merchResponse = await fetch(`http://localhost:5000/api/merch/artista/${id}`);
        const merchData = await merchResponse.json();
        
        const merchContainer = document.getElementById('merch-container');
        merchContainer.innerHTML = ''; 

        if (merchResponse.ok && merchData.length > 0) {
            merchData.forEach(prod => {
                let rawImg = (prod.imagenes && prod.imagenes.length > 0) ? prod.imagenes[0] : '/assets/merch/merch1.png';
                let cleanImg = rawImg.replace(/\\/g, '/');
                if (!cleanImg.startsWith('/') && !cleanImg.startsWith('http')) cleanImg = '/' + cleanImg;
                
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