import { HeaderComponent } from "../../components/header/header.js";
import { FooterComponent } from "../../components/footer/footer.js";

window.customElements.define('header-info', HeaderComponent);
window.customElements.define('footer-info', FooterComponent);

// Variable para rastrear la imagen actual
let currentImageIndex = 0;
let currentEventImages = [];

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('id');

    // Referencia al contenedor
    const container = document.getElementById('event-content');

    if (eventId) {
        renderizarEvento(eventId, container);
    } else {
        container.innerHTML = '<h1>Error: No se especificó un evento.</h1>';
    }
});

function renderizarEvento(id, container) {
    
    // ==========================================
    // DATOS HARCODEADOS
    // ==========================================

    const mockDB = {
        "1": {
            titulo: "BROTE DELIRIOS",
            precio: 0,
            moneda: "MXN",
            fecha: "2025-07-07",
            hora: "20:00 HRS",
            lugar: "Bauba Cafe",
            direccion: "Laguna del Nainari, Cd Obregón",
            stock: 100,
            descripcion: "<p>Música en vivo y delirios auditivos en un ambiente relajado.</p>",
            imagenes: [
                "/assets/eventos/evento1.png",       
                "/assets/lanzamientos/portada1.png"
            ]
        },
        "2": {
            titulo: "NOCHE NEON",
            precio: 120,
            moneda: "MXN",
            fecha: "2025-07-12",
            hora: "21:00 HRS",
            lugar: "Neon Fiesta Vip",
            direccion: "Centro, Cd Obregón",
            stock: 15,
            descripcion: "<p>Fiesta neón con la mejor música electrónica.</p>",
            imagenes: ["/assets/eventos/evento2.png",       
                "/assets/lanzamientos/portada2.png"]
        }
    };

    // Convertir a string seguro
    const evento = mockDB[String(id)];

    if (!evento) {
        container.innerHTML = `<h1>Evento no encontrado</h1>`;
        return;
    }

    // Guardamos las imágenes en la variable global para usarla en las flechas
    currentEventImages = evento.imagenes || [];

    // Generar Miniaturas
    let thumbnailsHTML = '';
    currentEventImages.forEach((img, index) => {
        const activeClass = index === 0 ? 'active-thumb' : '';
        // Pasamos el índice en lugar del elemento
        thumbnailsHTML += `<img src="${img}" class="thumbnail ${activeClass}" onclick="irAImagen(${index})">`;
    });

    const displayPrice = evento.precio === 0 ? "GRATIS" : `$${evento.precio} ${evento.moneda}`;

    container.innerHTML = `
        <div class="gallery-column">
            <div class="main-image-container">
                <button class="nav-btn prev-btn" onclick="cambiarImagen(-1)">
                    <img src="/assets/icons/arrow_left.png" alt="Anterior">
                </button>

                <img id="main-img" src="${currentEventImages[0]}" alt="${evento.titulo}">

                <button class="nav-btn next-btn" onclick="cambiarImagen(1)">
                    <img src="/assets/icons/arrow_right.png" alt="Siguiente">
                </button>
            </div>
            
            <div class="thumbnails-row">
                ${thumbnailsHTML}
            </div>
        </div>

        <div class="details-column">
            <h1 class="product-title">${evento.titulo}</h1>
            
            <div class="price-box">
                <span class="price-tag">${displayPrice}</span>
            </div>

            <div class="info-grid">
                <p><strong>📅 FECHA:</strong> ${evento.fecha} | ${evento.hora}</p>
                <p><strong>📍 LUGAR:</strong> ${evento.lugar}</p>
                <p class="address"><small>${evento.direccion}</small></p>
            </div>

            <div class="buy-box">
                <p>Disponibles: ${evento.stock}</p>
                <button class="btn-buy">COMPRAR BOLETOS</button>
            </div>

            <div class="description-section">
                ${evento.descripcion}
            </div>
        </div>
    `;
}

// ==========================================
// FUNCIONES DE NAVEGACIÓN (Globales)
// ==========================================

// Función para las flechas (avanzar o retroceder)
window.cambiarImagen = function(direction) {
    const totalImages = currentEventImages.length;
    if (totalImages <= 1) return; // No hacer nada si solo hay una foto

    // Calcular nuevo índice (circular)
    currentImageIndex = (currentImageIndex + direction + totalImages) % totalImages;
    actualizarVistaGaleria();
};

// Función para clicar en miniatura directa
window.irAImagen = function(index) {
    currentImageIndex = index;
    actualizarVistaGaleria();
};

function actualizarVistaGaleria() {
    // 1. Cambiar imagen grande
    const mainImg = document.getElementById('main-img');
    mainImg.src = currentEventImages[currentImageIndex];

    // 2. Actualizar borde activo en miniaturas
    const thumbs = document.querySelectorAll('.thumbnail');
    thumbs.forEach((t, i) => {
        if (i === currentImageIndex) t.classList.add('active-thumb');
        else t.classList.remove('active-thumb');
    });
}