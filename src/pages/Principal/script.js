import { HeaderComponent } from "../../components/header/header.js";
import { CarouselComponent } from "../../components/carousel/carousel.js";
import { LanzamientoComponent } from "../../components/lanzamientos/lanzamiento.js";
import { FooterComponent } from "../../components/footer/footer.js";
import { YoutubeLatestComponent } from "../../components/youtube/youtube-latest.js";

window.customElements.define('footer-info', FooterComponent);
window.customElements.define('lanzamiento-card', LanzamientoComponent);
window.customElements.define('carousel-info', CarouselComponent);
window.customElements.define('header-info', HeaderComponent);
window.customElements.define('youtube-latest', YoutubeLatestComponent);

document.addEventListener('DOMContentLoaded', () => {
    cargarLanzamientos();
});

async function cargarLanzamientos() {
    const container = document.querySelector('.lanzamientos-container');

    try {
        // 1. PETICIÓN AL BACKEND
        const response = await fetch('http://localhost:5000/api/lanzamientos');
        const data = await response.json();

        if (!response.ok) {
            console.error("Error API:", data);
            container.innerHTML = '<p>No se pudieron cargar los lanzamientos.</p>';
            return;
        }

        // Si no hay datos
        if (data.length === 0) {
            container.innerHTML = '<p>Aún no hay lanzamientos registrados.</p>';
            return;
        }

        // Limpiar mensaje de "Cargando..."
        container.innerHTML = '';

        // 2. CREAR TARJETAS
        data.forEach(lanzamiento => {
            // Sanitizar Imagen (Corregir barras invertidas de Windows)
            let rawImg = lanzamiento.imagen || '/assets/lanzamientos/portada1.png';
            let cleanImg = rawImg.replace(/\\/g, '/');
            
            // Asegurar ruta absoluta
            if (!cleanImg.startsWith('/') && !cleanImg.startsWith('http')) {
                cleanImg = '/' + cleanImg;
            }

            // Crear el elemento
            const card = document.createElement('lanzamiento-card');
            
            // Asignar atributos básicos
            card.setAttribute('titulo', lanzamiento.titulo);
            card.setAttribute('artista', lanzamiento.nombreArtista || 'Artista Sonico');
            card.setAttribute('imagen', cleanImg);

            // Asignar Links (Solo si existen)
            // Nota: Asegúrate que las rutas de los iconos sean correctas en tu carpeta assets
            if (lanzamiento.spotify) {
                card.setAttribute('spotify-link', lanzamiento.spotify);
                card.setAttribute('icon-spotify', '/assets/icons/icon_spotify.png');
            }

            if (lanzamiento.youtube) {
                card.setAttribute('youtube-link', lanzamiento.youtube);
                card.setAttribute('icon-youtube', '/assets/icons/icon_youtube.png');
            }

            // Si agregaste Soundcloud a tu modelo, descomenta esto:
            /*
            if (lanzamiento.soundcloud) {
                card.setAttribute('soundcloud-link', lanzamiento.soundcloud);
                card.setAttribute('icon-soundcloud', '/src/assets/icons/icon_soundcloud.png');
            }
            */

            container.appendChild(card);
        });

    } catch (error) {
        console.error("Error de conexión:", error);
        container.innerHTML = '<p>Error de conexión con el servidor (Puerto 5000).</p>';
    }
}