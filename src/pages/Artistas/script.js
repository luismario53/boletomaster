import { HeaderComponent } from "../../components/header/header.js";
import { FooterComponent } from "../../components/footer/footer.js";
import { ArtistCardComponent } from "../../components/artist/artist-card.js";

window.customElements.define('footer-info', FooterComponent);
window.customElements.define('header-info', HeaderComponent);
window.customElements.define('artist-card', ArtistCardComponent);

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.artists-grid');
    renderizarArtistas(container);
});

function renderizarArtistas(container) {
    // ============================================================
    // AQUI BORRAS ESTO Y METES LA CONEXION A LA BASE
    // ============================================================
    
    const mockArtistas = [
        {
            _id: "1", // Este ID se usará en el link: artist-profile.html?id=1
            nombre: "Mextasis",
            fotoPerfil: "/assets/lanzamientos/portada1.png" 
        },
        {
            _id: "2",
            nombre: "Edul",
            fotoPerfil: "/assets/lanzamientos/portada2.png"
        },
        {
            _id: "3",
            nombre: "Disonante",
            fotoPerfil: "/assets/lanzamientos/portada3.png"
        }
    ];

    // ============================================================

    container.innerHTML = ''; // Limpiamos por si acaso

    mockArtistas.forEach(artista => {
        const card = document.createElement('artist-card');

        card.setAttribute('id', artista._id);
        card.setAttribute('nombre', artista.nombre);
        
        if (artista.fotoPerfil) {
            card.setAttribute('imagen', artista.fotoPerfil);
        }

        container.appendChild(card);
    });
}