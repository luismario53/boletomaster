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

async function renderizarTienda(container) {
    
    try {
        const response = await fetch(`/api/merch`)
        const data = await response.json()

        if (!response.ok) {
            console.error(data)
            alert(data.error || data.message || "Ocurrió un error inesperado")
            return
        }

        container.innerHTML = '';

        if (data.length === 0) {
            container.innerHTML = '<p>No hay productos disponibles por el momento.</p>';
            return;
        }

        data.forEach(producto => {
            const { _id, nombre, imagenes, precio, idArtista: artista } = producto
            const { nombre: nombreArtista } = artista
            
            const card = document.createElement('merch-card');
            
            card.setAttribute('id', _id);
            card.setAttribute('nombre', nombre);
            card.setAttribute('imagen', imagenes[0]);
            card.setAttribute('precio', `$ ${precio}`);
            card.setAttribute('artista', `${nombreArtista}`);
            container.appendChild(card);
        });


    } catch (error) {
        console.error("Error de conexión:", error)
        alert("Error de conexión con el servidor")
    }

}