import { HeaderComponent } from "../../components/header/header.js";
import { FooterComponent } from "../../components/footer/footer.js";
import { ArtistCardComponent } from "../../components/artist/artist-card.js";

// ELIMINADO: import { fetchConAuth } ... (Esto rompía el script si no existía el archivo)

const TIPO_USUARIO = 'ARTISTA';

// Definimos los componentes para que el HTML los reconozca
window.customElements.define('footer-info', FooterComponent);
window.customElements.define('header-info', HeaderComponent);
window.customElements.define('artist-card', ArtistCardComponent);

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.artists-grid');
    if (container) {
        renderizarArtistas(container);
    } else {
        console.error("No se encontró el contenedor .artists-grid");
    }
});

async function renderizarArtistas(container) {
    try {
        // CORRECCIÓN IMPORTANTE: URL COMPLETA AL BACKEND (Puerto 5000)
        const response = await fetch(`http://localhost:5000/api/usuarios/tipo/${TIPO_USUARIO}`);
        
        const data = await response.json();

        if (!response.ok) {
            console.error(data);
            // Mostramos un mensaje amigable si falla
            container.innerHTML = `<p>Error cargando artistas: ${data.mensaje || "Error desconocido"}</p>`;
            return;
        }

        container.innerHTML = ''; // Limpiamos "Cargando..."

        if (data.length === 0) {
            container.innerHTML = '<p>No hay artistas registrados aún.</p>';
            return;
        }

        data.forEach(artista => {
            // Desestructuración segura (por si imagenes no existe)
            const { _id, nombre, imagenes } = artista;
            // Usamos una imagen por defecto si no hay perfil
            const perfil = imagenes?.perfil || '/assets/perfil.png'; 

            const card = document.createElement('artist-card');

            card.setAttribute('id', _id);
            card.setAttribute('nombre', nombre);
            card.setAttribute('imagen', perfil);

            container.appendChild(card);
        });

    } catch (error) {
        console.error("Error de conexión:", error);
    }
}