import { HeaderComponent } from "../../../components/header/header.js";
import { FooterComponent } from "../../../components/footer/footer.js";

import { agregarAlCarrito, obtenerCarrito, obtenerTotal, vaciarCarrito} from "../../utils/carrito.js";

window.customElements.define('header-info', HeaderComponent);
window.customElements.define('footer-info', FooterComponent);

// Variables globales para la galería
let currentImageIndex = 0;
let currentProductImages = [];

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const idMerch = params.get('id');

    if (idMerch) {
        renderizarProducto(idMerch);
    } else {
        document.getElementById('product-content').innerHTML = '<h1>Producto no encontrado</h1>';
    }
});

async function renderizarProducto(idMerch) {
    // MOCK DATA DE MERCH
    const mockDB = {
        "692ddfd2390fa073d5c24edf": {
            titulo: "CAMISETA OFICIAL 2024",
            precio: 250,
            moneda: "MXN",
            tallas: ["S", "M", "L", "XL"],
            material: "100% Algodón",
            stock: 50,
            descripcion: "<p>La camiseta oficial de la gira. Diseño exclusivo en serigrafía de alta calidad.</p>",
            imagenes: [
                "/assets/merch/merch1.jpg", 
                "/assets/merch/merch2.jpg"
            ]
        }
    };

    
    try {
        const response = await fetch(`/api/merch/${idMerch}`)
        const data = await response.json()
        
        if (!response.ok) {
            document.querySelector('.main-content').innerHTML = '<h1>Producto no encontrado en la base de datos.</h1>'
            console.error(data)
            alert(data.error || data.message || "Ocurrió un error inesperado")
            return
        }

        const container = document.getElementById('product-content');
        if (!data) {
            container.innerHTML = `<h1>Producto no encontrado</h1>`;
            return;
        }

        const { imagenes, tallas, precio, moneda, nombre, material, stock, descripcion } = data

        agregarCurrentItem(data)
        currentProductImages = [...imagenes]
        // Generar Miniaturas
        let thumbnailsHTML = '';
        currentProductImages.forEach((img, index) => {
            const activeClass = index === 0 ? 'active-thumb' : '';
            thumbnailsHTML += `<img src="${img}" class="thumbnail ${activeClass}" onclick="irAImagen(${index})">`;
        });

        // Generar Botones de Tallas
        let tallasHTML = '';
        tallas.forEach(talla => {
            tallasHTML += `<button class="size-btn">${talla}</button>`;
        });

        const displayPrice = `$${precio} ${moneda}`;

        container.innerHTML = `
            <div class="gallery-column">
                <div class="main-image-container">
                    <button class="nav-btn prev-btn" onclick="cambiarImagen(-1)">
                        <img src="/assets/icons/arrow_left.png" alt="Anterior">
                    </button>
                    <img id="main-img" src="${currentProductImages[0]}" alt="${nombre}">
                    <button class="nav-btn next-btn" onclick="cambiarImagen(1)">
                        <img src="/assets/icons/arrow_right.png" alt="Siguiente">
                    </button>
                </div>
                <div class="thumbnails-row">${thumbnailsHTML}</div>
            </div>

            <div class="details-column">
                
                <h1 class="product-title">${nombre}</h1>
                
                <div class="price-box">
                    <span class="price-tag">${displayPrice}</span>
                </div>

                <div class="info-grid">
                    <p><strong>MATERIAL:</strong> ${material}</p>
                    <div class="sizes-section">
                        <p><strong>TALLAS DISPONIBLES:</strong></p>
                        <div class="sizes-row">
                            ${tallasHTML}
                        </div>
                    </div>
                </div>

                <div class="buy-box">
                    ${stock < 10 
                        ? `<p class="stock-warning">¡Últimas ${stock} piezas!</p>` 
                        : `<p class="stock-ok">En Stock</p>`
                    }
                    <button class="btn-buy">AGREGAR AL CARRITO</button>
                </div>

                <div class="description-section">
                    ${descripcion}
                </div>
            </div>
        `;

        // 1. INTERACTIVIDAD TALLAS
        const sizeBtns = container.querySelectorAll('.size-btn');
        let tallaSeleccionada = null; // Guardamos la talla seleccionada

        sizeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                sizeBtns.forEach(b => b.classList.remove('active-size'));
                btn.classList.add('active-size');
                tallaSeleccionada = btn.innerText; // Guardamos la talla
            });
        });

        // 2. LÓGICA DEL BOTÓN DE COMPRA (NUEVO)
        const buyBtn = container.querySelector('.btn-buy');
        
        // revisar funcion para quitarla por protegerPagina
        buyBtn.addEventListener('click', () => {
            // A) Validar Sesión
            const usuarioSesion = localStorage.getItem('usuario_sonicolirio');
            
            if (!usuarioSesion) {
                // Si NO hay sesión, mostramos mensaje y detenemos.
                // Usamos 'confirm' para darles la opción de ir al login o cancelar
                const irALogin = confirm("Para agregar productos al carrito necesitas iniciar sesión.\n\n¿Deseas ir a la página de inicio de sesión ahora?");
                
                if (irALogin) {
                    window.location.href = "/pages/Login/login.html";
                }
                return; // Importante: Detiene la función aquí
            }

            // B) Validar Talla (Opcional pero recomendado)
            if (!tallaSeleccionada) {
                alert("⚠️ Por favor selecciona una talla antes de continuar.");
                return;
            }

            agregarProductoAlCarrito(tallaSeleccionada)
            // C) Éxito
            alert(`¡Producto agregado al carrito!`);
            // limpiarCurrentItem()
        });

    } catch (error) {
        console.log(error)
    }
}

// FUNCIONES GLOBALES DE GALERÍA
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


/* Carrito de compras */
const agregarProductoAlCarrito = (tallaSeleccionada) => {
    const producto = JSON.parse(localStorage.getItem('current_item')) || {}
    if(!producto) {
        alert('El producto no existe o no esta disponible')
        return
    }

    producto['talla'] = tallaSeleccionada
    const carrito = agregarAlCarrito(producto)
    console.log(carrito)
}

const agregarCurrentItem = (data) => {
    const { _id, imagenes, precio, moneda, nombre, material, stock, descripcion } = data
    localStorage.setItem('current_item', JSON.stringify({
        _id: _id,
        imagenes,
        nombre,
        precio,
        moneda,
        stock,
        material,
        descripcion
    }))
}

const limpiarCurrentItem = () => localStorage.removeItem('current_item')