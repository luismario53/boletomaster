import { HeaderComponent } from "../../components/header/header.js";
import { FooterComponent } from "../../components/footer/footer.js";
// Importamos la tarjeta de producto
import { MerchCardComponent } from "../../components/merch/merch-card.js";

window.customElements.define('header-info', HeaderComponent);
window.customElements.define('footer-info', FooterComponent);
window.customElements.define('merch-card', MerchCardComponent);

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.merch-grid');
    renderizarTienda(container);
});

function renderizarTienda(container) {
    // ==========================================
    // HARDCOEDO
    // ==========================================
    const mockMerch = [
        {
            _id: "m1",
            nombre: "Camiseta Oficial 2024",
            artista: "Mextasis",
            precio: "$350 MXN",
            imagen: "/assets/merch/merch1.jpg"
        },
        {
            _id: "m2",
            nombre: "Hoodie Paranoia",
            artista: "Mextasis",
            precio: "$800 MXN",
            imagen: "/assets/merch/merch2.jpg"
        },
        {
            _id: "m3",
            nombre: "Gorra Edul",
            artista: "Edul",
            precio: "$250 MXN",
            imagen: "/assets/merch/merch2.jpg"
        },
        {
            _id: "m4",
            nombre: "Tote Bag Festival",
            artista: "Sonico Lirio",
            precio: "$150 MXN",
            imagen: "/assets/merch/merch1.jpg"
        },
        {
            _id: "m5",
            nombre: "Vinilo Edición Limitada",
            artista: "Disonante",
            precio: "$600 MXN",
            imagen: "/assets/lanzamientos/portada3.png"
        }
    ];

    container.innerHTML = '';

    if (mockMerch.length === 0) {
        container.innerHTML = '<p>No hay productos disponibles por el momento.</p>';
        return;
    }

    mockMerch.forEach(producto => {
        const card = document.createElement('merch-card');
        
        card.setAttribute('id', producto._id);
        card.setAttribute('nombre', producto.nombre);
        card.setAttribute('imagen', producto.imagen);
        card.setAttribute('precio', producto.precio);
        
        // Opcional: Podrías querer mostrar el nombre del artista en la tarjeta también
        // Para eso tendrías que modificar merch-card.js para aceptar un atributo 'artista'

        container.appendChild(card);
    });
}