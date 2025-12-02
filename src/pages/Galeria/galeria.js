import { HeaderComponent } from "../../components/header/header.js";
import { FooterComponent } from "../../components/footer/footer.js";
import { formatearFechaDisplay } from '../../utils/fechaFormateada.js'
import { toTitleCase } from '../../utils/titleCaseFormat.js'

window.customElements.define('header-info', HeaderComponent);
window.customElements.define('footer-info', FooterComponent);

document.addEventListener('DOMContentLoaded', () => {
    renderizarGaleria();
    setupLightbox();
});

async function renderizarGaleria() {

    try {
        const response = await fetch(`/api/galeria`)
        const data = await response.json()

        if (!response.ok) {
            console.error(data)
            alert(data.error || data.message || "Ocurrió un error inesperado")
            return
        }

        const container = document.getElementById('gallery-feed');
        container.innerHTML = '';

        data.forEach(album => {
            const {evento, descripcion, fecha, imagenes } = album
            const fechaFormateada = toTitleCase(formatearFechaDisplay(fecha))
            // 1. Crear HTML de las fotos
            let fotosHTML = '';
            imagenes.forEach(foto => {
                // Al hacer click, abrimos el Lightbox con la ruta de la foto
                fotosHTML += `
                    <div class="photo-item" onclick="abrirLightbox('${foto}', '${evento}')">
                        <img src="${foto}" alt="${evento}" loading="lazy">
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
                        <h2 class="album-title">${evento}</h2>
                        <p class="album-date">${fechaFormateada}</p>
                        <p class="album-desc">${descripcion}</p>
                    </div>
                    
                    <div class="album-grid">
                        ${fotosHTML}
                    </div>
                </section>
            `;

            container.innerHTML += albumHTML;
        });

    } catch (error) {
        console.error("Error de conexión:", error)
        alert("Error de conexión con el servidor")
    }

}

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