import { HeaderComponent } from "../../components/header/header.js";
import { FooterComponent } from "../../components/footer/footer.js";

window.customElements.define('header-info', HeaderComponent);
window.customElements.define('footer-info', FooterComponent);

// Variables globales para la galería
let currentImageIndex = 0;
let currentEventImages = [];

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const idEvento = params.get('id');

    // Referencia al contenedor
    const container = document.getElementById('event-content');

    if (idEvento) {
        renderizarEvento(idEvento, container);
    } else {
        container.innerHTML = '<h1>Error: No se especificó un evento.</h1>';
    }
});

async function renderizarEvento(idEvento, container) {
    
    const mockDB = {
        "692e5aba332f08a862450277": {
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
        }
    };

    console.log(idEvento)
    try {
        const response = await fetch(`/api/eventos/${idEvento}`)
        const data = await response.json()

        if (!response.ok) {
            document.querySelector('.main-content').innerHTML = '<h1>Evento no encontrado en la base de datos.</h1>'
            console.error(data)
            alert(data.error || data.message || "Ocurrió un error inesperado")
            return
        }

        if (!data) {
            container.innerHTML = `<h1>Evento no encontrado</h1>`;
            return;
        }

        console.log(data)

        const { titulo, precio, moneda, imagenes, descripcion, lugar, direccion, stock, fecha, hora } = data

        // Guardamos las imágenes en la variable global para usarla en las flechas
        currentEventImages = imagenes || [];

        // Generar Miniaturas
        let thumbnailsHTML = '';
        currentEventImages.forEach((img, index) => {
            const activeClass = index === 0 ? 'active-thumb' : '';
            // Pasamos el índice en lugar del elemento
            thumbnailsHTML += `<img src="${img}" class="thumbnail ${activeClass}" onclick="irAImagen(${index})">`;
        });

        const displayPrice = precio === 0 ? "GRATIS" : `$${precio} ${moneda}`;

        container.innerHTML = `
            <div class="gallery-column">
                <div class="main-image-container">
                    <button class="nav-btn prev-btn" onclick="cambiarImagen(-1)">
                        <img src="/assets/icons/arrow_left.png" alt="Anterior">
                    </button>

                    <img id="main-img" src="${currentEventImages[0]}" alt="${titulo}">

                    <button class="nav-btn next-btn" onclick="cambiarImagen(1)">
                        <img src="/assets/icons/arrow_right.png" alt="Siguiente">
                    </button>
                </div>
                
                <div class="thumbnails-row">
                    ${thumbnailsHTML}
                </div>
            </div>

            <div class="details-column">
                <h1 class="product-title">${titulo}</h1>
                
                <div class="price-box">
                    <span class="price-tag">${displayPrice}</span>
                </div>

                <div class="info-grid">
                    <p><strong>📅 FECHA:</strong> ${fecha} | ${hora}</p>
                    <p><strong>📍 LUGAR:</strong> ${lugar}</p>
                    <p class="address"><small>${direccion}</small></p>
                </div>

                <div class="buy-box">
                    <p>Disponibles: ${stock}</p>
                    <button class="btn-buy">COMPRAR BOLETOS</button>
                </div>

                <div class="description-section">
                    ${descripcion}
                </div>
            </div>
        `;

        // ==========================================
        // 🔒 LÓGICA DE VALIDACIÓN DE SESIÓN (NUEVO)
        // ==========================================
        const buyBtn = container.querySelector('.btn-buy');
        
        buyBtn.addEventListener('click', () => {
            const usuarioSesion = localStorage.getItem('usuario');
            
            if (!usuarioSesion) {
                const irALogin = confirm("🔒 Para comprar boletos necesitas iniciar sesión.\n\n¿Deseas ir a la página de inicio de sesión ahora?");
                
                if (irALogin) {
                    window.location.href = "/pages/Login/login.html";
                }
                return; 
            }

            // Si hay sesión, procedemos
            alert(`✅ ¡Boletos para ${titulo} agregados al carrito!`);

        });
    } catch (error) {
        console.log(error)
    }

    

    

    

    
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