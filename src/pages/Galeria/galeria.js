import { HeaderComponent } from "../../components/header/header.js";
import { FooterComponent } from "../../components/footer/footer.js";
// Asegúrate que estas utilidades existan, si no, comenta estas líneas
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
        // CORRECCIÓN 1: URL absoluta al Backend (Puerto 5000)
        const response = await fetch(`http://localhost:5000/api/galeria`);
        const data = await response.json();

        if (!response.ok) {
            console.error(data);
            // alert(data.error || "Ocurrió un error inesperado");
            return;
        }

        const container = document.getElementById('gallery-feed');
        container.innerHTML = '';

        if (data.length === 0) {
            container.innerHTML = '<p style="text-align:center; color:white; margin-top:50px;">Aún no hay galerías publicadas.</p>';
            return;
        }

        data.forEach(album => {
            // CORRECCIÓN 2: El campo se llama 'fotos' en tu BD, no 'imagenes'
            const { evento, descripcion, fecha, fotos } = album;

            // Manejo seguro de fechas (por si la utilidad falla o la fecha viene vacía)
            let fechaTexto = fecha;
            try {
                if (formatearFechaDisplay) {
                    fechaTexto = toTitleCase(formatearFechaDisplay(fecha));
                }
            } catch (e) {
                console.warn("Error formateando fecha:", e);
            }

            // 1. Crear HTML de las fotos
            let fotosHTML = '';
            
            // Verificamos que 'fotos' exista y sea un array
            if (fotos && Array.isArray(fotos)) {
                fotos.forEach(fotoRaw => {
                    
                    // CORRECCIÓN 3: Sanitizar rutas (Windows \ a Web /)
                    let cleanSrc = fotoRaw.replace(/\\/g, '/');
                    if (!cleanSrc.startsWith('/') && !cleanSrc.startsWith('http')) {
                        cleanSrc = '/' + cleanSrc;
                    }

                    // Al hacer click, enviamos la url limpia al Lightbox
                    fotosHTML += `
                        <div class="photo-item" onclick="abrirLightbox('${cleanSrc}', '${evento}')">
                            <img src="${cleanSrc}" alt="${evento}" loading="lazy">
                            <div class="photo-overlay">
                                <span>VER FOTO</span>
                            </div>
                        </div>
                    `;
                });
            }

            // 2. Crear HTML del Álbum completo
            const albumHTML = `
                <section class="album-section">
                    <div class="album-header">
                        <h2 class="album-title">${evento}</h2>
                        <p class="album-date">${fechaTexto}</p>
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
        console.error("Error de conexión:", error);
        // alert("Error de conexión con el servidor");
    }
}

function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.getElementById('close-lightbox');

    if (!lightbox || !closeBtn) return;

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

    if (lightbox && img && text) {
        img.src = src;
        text.innerText = caption;
        lightbox.classList.remove('hidden');
    }
};