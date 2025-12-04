import { HeaderComponent } from "../../components/header/header.js";
import { FooterComponent } from "../../components/footer/footer.js";
import { obtenerUsuario } from '../../utils/fetchConAuth.js'
// Importamos la nueva tarjeta de evento
import { CarritoCardComponent } from "../../components/carrito/carrito-card.js";
import { obtenerCarrito, vaciarCarrito } from '../../utils/carrito.js'

window.customElements.define('footer-info', FooterComponent);
window.customElements.define('header-info', HeaderComponent);
window.customElements.define('carrito-card', CarritoCardComponent);

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.merch-list');
    cargarCarrito(container);
});

async function cargarCarrito(container) {

    const carrito = obtenerCarrito()
    carrito.forEach(producto => {

        const { _id, nombre, precio, talla, cantidad, imagen } = producto
        const card = document.createElement('carrito-card');
        
        card.setAttribute('id', _id);
        card.setAttribute('nombre', nombre);
        card.setAttribute('talla', talla);
        card.setAttribute('precio', `${precio}`);
        card.setAttribute('cantidad', cantidad);
        if(imagen) card.setAttribute('imagen', imagen);

        container.appendChild(card);
    });
}


window.crearCompra = async () => {
    const token = localStorage.getItem('token');
    const usuario = obtenerUsuario()

    if(!usuario) {
        return
    }

    const carrito = obtenerCarrito()
    console.log(carrito)

    const productos = carrito.map(producto => {
        return {
            _id: producto._id,
            tipoProducto: producto.tipoProducto,
            talla: producto.talla,
            cantidad: producto.cantidad
        }
    })

    const nuevaOrden = {
        idCliente: usuario._id,
        productos: productos
    }

    const response = await fetch(`/api/ordenes/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(nuevaOrden),
    })
    const data = await response.json()
    
    if (!response.ok) {
        document.querySelector('.main-content').innerHTML = '<h1>Producto no encontrado en la base de datos.</h1>'
        console.error(data)
        alert(data.error || data.message || "Ocurrió un error inesperado")
        return
    }

    const { url } = data
    window.location.href = url

    // limpiamos carrito
    vaciarCarrito()
}
