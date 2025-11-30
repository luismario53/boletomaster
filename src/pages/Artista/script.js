import { HeaderComponent } from "../../../components/header/header.js";
import { FooterComponent } from "../../../components/footer/footer.js";
import { CarouselComponent } from "../../../components/carousel/carousel.js";

import { LanzamientoComponent } from "../../../components/lanzamientos/lanzamiento.js";

window.customElements.define('header-info', HeaderComponent);
window.customElements.define('footer-info', FooterComponent);
window.customElements.define('carousel-info', CarouselComponent);

window.customElements.define('lanzamiento-card', LanzamientoComponent);


document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const artistId = params.get('id');

    if (artistId) {
        renderizarPerfilArtista(artistId);
    } else {
        document.querySelector('.main-content').innerHTML = '<h1>Artista no encontrado</h1>';
    }
});

function renderizarPerfilArtista(id) {
    // ============================================================
    // DATOS HARDCODEADOS
    // ============================================================

    const mockDB = {
        "1": {
            nombre: "MEXTASIS",
            imgPortada: "/assets/baner.png", 
            redes: [
                { icon: "/assets/icons/icon_spotify.png", link: "https://open.spotify.com/intl-es/artist/42SJ61ThHGPtZC7RT9cWyA" },
                { icon: "/assets/icons/icon_instagram.png", link: "https://www.instagram.com/mex_tasis/" }
            ],
            
            discografia: [
                { 
                    titulo: "Paranoia", 
                    artista: "Mextasis",
                    imagen: "/assets/lanzamientos/portada1.png",

                    spotify: "http://spotify.com...",
                    iconSpotify: "/assets/icons/icon_spotify.png",
                    youtube: "http://youtube.com...",
                    iconYoutube: "/assets/icons/icon_youtube.png"
                },
                { 
                    titulo: "Quebranto", 
                    artista: "Mextasis",

                    imagen: "/assets/lanzamientos/portada4.jpg",
                    spotify: "http://spotify.com...",
                    iconSpotify: "/assets/icons/icon_spotify.png",
                    youtube: "http://youtube.com...",
                    iconYoutube: "/assets/icons/icon_youtube.png"
                }
            ],
            
            eventosImgs: [
                 "/assets/eventos/evento1.png",
                 "/assets/eventos/evento2.png"
            ],
            
            bioImg: "/assets/perfil.png", 
            bioDescripcion: `
                <p>DESDE LAS AULAS DE SECUNDARIA EN CIUDAD OBREGÓN, SONORA, HASTA LOS ESCENARIOS DONDE LA PASIÓN COBRA VIDA. MEXTASIS ES MÁS QUE UNA BANDA; ES EL ECO DE UNA AMISTAD FORJADA A LO LARGO DE CASI UNA DÉCADA.</p>
                <p>MEXTASIS ES UNA AVALANCHA DE EMOCIONES, UNA ENERGÍA IMPARABLE QUE SE ALIMENTA DE LA CURIOSIDAD Y LA PASIÓN POR EXPLORAR NUEVOS SONIDOS. CADA CANCIÓN ES UN TESTIMONIO DE SU CRECIMIENTO, CADA ACORDE UNA PROMESA DE QUE LO MEJOR ESTÁ AÚN POR VENIR.</p>
                <p>BIENVENIDOS A SU HISTORIA. BIENVENIDOS A MEXTASIS.</p>
            `
        }
    };

    const datos = mockDB[id];

    if (!datos) {
        document.querySelector('.main-content').innerHTML = '<h1>Artista no encontrado en la base de datos.</h1>';
        return;
    }

    const heroSection = document.getElementById('hero-section');
    let redesHTML = '';
    datos.redes.forEach(red => {
        redesHTML += `<a href="${red.link}" target="_blank"><img src="${red.icon}" alt="Red Social"></a>`;
    });

    heroSection.innerHTML = `
        <img src="${datos.imgPortada}" alt="${datos.nombre}" class="hero-bg">
        <div class="hero-overlay">
            <h1 class="artist-name-hero">${datos.nombre}</h1>
            <div class="hero-socials">
                ${redesHTML}
            </div>
        </div>
    `;

    const discographyContainer = document.getElementById('discography-container');
    
    datos.discografia.forEach(disco => {
        const card = document.createElement('lanzamiento-card');
        
        card.setAttribute('titulo', disco.titulo);
        card.setAttribute('artista', disco.artista);
        card.setAttribute('imagen', disco.imagen);

        if(disco.spotify) {
            card.setAttribute('spotify-link', disco.spotify);
            card.setAttribute('icon-spotify', disco.iconSpotify);
        }
        if(disco.youtube) {
            card.setAttribute('youtube-link', disco.youtube);
            card.setAttribute('icon-youtube', disco.iconYoutube);
        }
        if(disco.apple) {
            card.setAttribute('apple-link', disco.apple);
            card.setAttribute('icon-apple', disco.iconApple);
        }

        discographyContainer.appendChild(card);
    });

    const eventsContainer = document.getElementById('events-container');
    const carousel = document.createElement('carousel-info');
    eventsContainer.appendChild(carousel);

    const bioSection = document.getElementById('bio-section');
    bioSection.innerHTML = `
        <div class="bio-left-col">
            <img src="${datos.bioImg}" alt="Foto Biografía ${datos.nombre}">
        </div>
        <div class="bio-right-col">
            <div class="bio-text-content">
                ${datos.bioDescripcion}
            </div>
        </div>
    `;
}