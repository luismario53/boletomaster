import { HeaderComponent } from "../../../components/header/header.js";
import { FooterComponent } from "../../../components/footer/footer.js";

window.customElements.define('header-info', HeaderComponent);
window.customElements.define('footer-info', FooterComponent);

// Variables globales para la galería
let currentImageIndex = 0;
let currentProductImages = [];

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (productId) {
        renderizarProducto(productId);
    } else {
        document.getElementById('product-content').innerHTML = '<h1>Producto no encontrado</h1>';
    }
});

function renderizarProducto(id) {
    // MOCK DATA DE MERCH
    const mockDB = {
        "m1": {
            titulo: "CAMISETA OFICIAL 2024",
            precio: 250,
            moneda: "MXN",
            tallas: ["S", "M", "L", "XL"], // Array de tallas
            material: "100% Algodón",
            stock: 50,
            descripcion: "<p>ya me harte de escribir tanta info hardcodeada esto es una descripcion</p>",
            imagenes: [
                "/assets/merch/merch1.jpg", // Frente
                "/assets/merch/merch2.jpg" // Espalda (simulada)
            ]
        }
    };

    const producto = mockDB[String(id)];
    const container = document.getElementById('product-content');

    if (!producto) {
        container.innerHTML = `<h1>Producto no encontrado</h1>`;
        return;
    }

    currentProductImages = producto.imagenes;
    
    // Generar Miniaturas
    let thumbnailsHTML = '';
    currentProductImages.forEach((img, index) => {
        const activeClass = index === 0 ? 'active-thumb' : '';
        thumbnailsHTML += `<img src="${img}" class="thumbnail ${activeClass}" onclick="irAImagen(${index})">`;
    });

    // Generar Botones de Tallas
    let tallasHTML = '';
    producto.tallas.forEach(talla => {
        tallasHTML += `<button class="size-btn">${talla}</button>`;
    });

    const displayPrice = `$${producto.precio} ${producto.moneda}`;

    container.innerHTML = `
        <div class="gallery-column">
            <div class="main-image-container">
                <button class="nav-btn prev-btn" onclick="cambiarImagen(-1)">
                    <img src="/assets/icons/arrow_left.png" alt="Anterior">
                </button>
                <img id="main-img" src="${currentProductImages[0]}" alt="${producto.titulo}">
                <button class="nav-btn next-btn" onclick="cambiarImagen(1)">
                    <img src="/assets/icons/arrow_right.png" alt="Siguiente">
                </button>
            </div>
            <div class="thumbnails-row">${thumbnailsHTML}</div>
        </div>

        <div class="details-column">
            
            <h1 class="product-title">${producto.titulo}</h1>
            
            <div class="price-box">
                <span class="price-tag">${displayPrice}</span>
            </div>

            <div class="info-grid">
                <p><strong>MATERIAL:</strong> ${producto.material}</p>
                <div class="sizes-section">
                    <p><strong>TALLAS DISPONIBLES:</strong></p>
                    <div class="sizes-row">
                        ${tallasHTML}
                    </div>
                </div>
            </div>

            <div class="buy-box">
                ${producto.stock < 10 
                    ? `<p class="stock-warning">¡Últimas ${producto.stock} piezas!</p>` 
                    : `<p class="stock-ok">En Stock</p>`
                }
                <button class="btn-buy">AGREGAR AL CARRITO</button>
            </div>

            <div class="description-section">
                ${producto.descripcion}
            </div>
        </div>
    `;

    // Interactividad simple para botones de talla
    const sizeBtns = container.querySelectorAll('.size-btn');
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeBtns.forEach(b => b.classList.remove('active-size'));
            btn.classList.add('active-size');
        });
    });
}

// FUNCIONES GLOBALES DE GALERÍA (Mismas que evento)
window.cambiarImagen = function(direction) {
    const total = currentProductImages.length;
    if (total <= 1) return;
    currentImageIndex = (currentImageIndex + direction + total) % total;
    actualizarVista();
};

window.irAImagen = function(index) {
    currentImageIndex = index;
    actualizarVista();
};

function actualizarVista() {
    const mainImg = document.getElementById('main-img');
    if(mainImg) mainImg.src = currentProductImages[currentImageIndex];
    
    document.querySelectorAll('.thumbnail').forEach((t, i) => {
        if (i === currentImageIndex) t.classList.add('active-thumb');
        else t.classList.remove('active-thumb');
    });
}