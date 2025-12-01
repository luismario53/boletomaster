import { HeaderComponent } from "../../components/header/header.js";
import { FooterComponent } from "../../components/footer/footer.js";

window.customElements.define('header-info', HeaderComponent);
window.customElements.define('footer-info', FooterComponent);

document.addEventListener('DOMContentLoaded', () => {
    renderizarGaleria();
    setupLightbox();
});

function renderizarGaleria() {
    // ==========================================
    // MAS HARCODEO
    // ==========================================
    const mockAlbums = [
        {
            evento: "Desierto Bar",
            fecha: "27 DE JUNIO, 2025",
            descripcion: "Lo mejor de Disonante en vivo.",
            fotos: [
                "/assets/galeria/galeria1.png",
                "/assets/galeria/galeria2.png",
                "/assets/galeria/galeria3.png",
                "/assets/galeria/galeria4.png"
            ]
        }
    ];

    const container = document.getElementById('gallery-feed');
    container.innerHTML = '';

    mockAlbums.forEach(album => {
        // 1. Crear HTML de las fotos
        let fotosHTML = '';
        album.fotos.forEach(foto => {
            // Al hacer click, abrimos el Lightbox con la ruta de la foto
            fotosHTML += `
                <div class="photo-item" onclick="abrirLightbox('${foto}', '${album.evento}')">
                    <img src="${foto}" alt="${album.evento}" loading="lazy">
                    <div class="photo-overlay">
                        <span>VER FOTO</span>
                    </div>
                </div>
            `;
        });

        // 2. Crear HTML del Álbum completo
        const albumHTML = `
            <section class="album-section">
                <div class="album-header">
                    <h2 class="album-title">${album.evento}</h2>
                    <p class="album-date">${album.fecha}</p>
                    <p class="album-desc">${album.descripcion}</p>
                </div>
                
                <div class="album-grid">
                    ${fotosHTML}
                </div>
            </section>
        `;

        container.innerHTML += albumHTML;
    });
}

// ==========================================
// LÓGICA DEL LIGHTBOX (Pantalla Completa)
// ==========================================

function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.getElementById('close-lightbox');

    // Cerrar al dar click en la X
    closeBtn.addEventListener('click', () => {
        lightbox.classList.add('hidden');
    });

    // Cerrar al dar click fuera de la imagen (en el fondo oscuro)
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.add('hidden');
        }
    });
}

// Hacemos esta función global para que el HTML onclick="" la encuentre
window.abrirLightbox = function(src, caption) {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const text = document.getElementById('lightbox-caption');

    img.src = src;
    text.innerText = caption;
    lightbox.classList.remove('hidden');
};