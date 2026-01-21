import { HeaderComponent } from "../../components/header/header.js";
import { FooterComponent } from "../../components/footer/footer.js";
import { CarritoCardComponent } from "../../components/carrito/carrito-card.js";
import { obtenerCarrito, vaciarCarrito } from '../../utils/carrito.js';

window.customElements.define('footer-info', FooterComponent);
window.customElements.define('header-info', HeaderComponent);
window.customElements.define('carrito-card', CarritoCardComponent);

document.addEventListener('DOMContentLoaded', () => {
    // 1. VERIFICAR SI VENIMOS DE PAYPAL
    const pagoExitoso = verificarEstadoPago();

    // 2. SI NO ES ÉXITO, CARGAR EL CARRITO NORMAL
    if (!pagoExitoso) {
        const container = document.querySelector('.merch-list');
        cargarCarrito(container);
    }
});

function verificarEstadoPago() {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const ordenId = params.get('orden');

    if (status === 'success') {
        // A) VACIAR CARRITO LOCALSTORAGE
        vaciarCarrito();
        
        // B) MOSTRAR MENSAJE DE ÉXITO
        document.querySelector('.merch-list').innerHTML = `
            <div style="text-align:center; padding: 40px; background:rgba(0,255,0,0.1); border-radius:10px; border:1px solid #4CAF50;">
                <h1 style="color: #4CAF50; font-size: 2.5rem; margin-bottom: 20px;">¡Pago Exitoso!</h1>
                <p style="color: white; font-size: 1.2rem;">Tu orden <strong>#${ordenId}</strong> ha sido procesada correctamente.</p>
                <p style="color: #ccc;">Te hemos enviado el recibo a tu correo.</p>
                <br>
                <a href="/pages/Principal/main.html" style="background:#F8D62C; color:black; padding:10px 20px; text-decoration:none; border-radius:5px; font-weight:bold;">VOLVER AL INICIO</a>
            </div>
        `;
        
        // Ocultar botones
        const actionsDiv = document.querySelector('.actions-container');
        if(actionsDiv) actionsDiv.style.display = 'none';

        // Limpiar URL
        window.history.replaceState({}, document.title, window.location.pathname);
        return true; 
    } 
    else if (status === 'cancel') {
        alert("Has cancelado el pago en PayPal.");
    }
    else if (status === 'failed') {
        alert("El pago falló. Intenta de nuevo.");
    }
    return false;
}

async function cargarCarrito(container) {
    const carrito = obtenerCarrito();
    
    if(!carrito || carrito.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#aaa; margin-top:50px;">Tu carrito está vacío.</p>';
        return;
    }

    container.innerHTML = ''; // Limpiar

    carrito.forEach(producto => {
        // Validación básica
        if (!producto._id) return; 

        const { _id, nombre, precio, talla, cantidad, imagen } = producto;
        
        const card = document.createElement('carrito-card');
        card.setAttribute('id', _id);
        card.setAttribute('nombre', nombre);
        card.setAttribute('talla', talla || 'Unitalla');
        card.setAttribute('precio', `${precio}`);
        card.setAttribute('cantidad', cantidad);
        if(imagen && imagen !== "undefined") card.setAttribute('imagen', imagen);

        container.appendChild(card);
    });
}

// Función global para el botón de PayPal
window.crearCompra = async () => {
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario_sonicolirio');

    if(!usuario || !token) {
        if(confirm("Para comprar necesitas iniciar sesión. ¿Ir al login?")) {
            window.location.href = "/src/pages/Login/login.html";
        }
        return;
    }

    const carrito = obtenerCarrito();
    if(carrito.length === 0) {
        alert("Tu carrito está vacío");
        return;
    }

    const btn = document.querySelector('.paypal-button');
    btn.disabled = true; // Evitar doble click

    // Preparar productos para el backend
    const productos = carrito.map(producto => {
        return {
            _id: producto._id,
            // Importante: Si no tiene tipo, asumimos Mercancia para compatibilidad
            tipoProducto: producto.tipoProducto || 'Mercancia', 
            cantidad: Number(producto.cantidad)
        }
    });

    const nuevaOrden = {
        idCliente: JSON.parse(usuario)._id,
        productos: productos
    };

    try {
        const response = await fetch(`http://localhost:5000/api/ordenes/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(nuevaOrden),
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error(data);
            alert(data.message || "Error al crear la orden");
            btn.disabled = false;
            return;
        }

        // Redirigir a PayPal
        if (data.url) {
            window.location.href = data.url;
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Error de conexión");
        btn.disabled = false;
    }
}

// Función global para vaciar manualmente
window.limpiarCarritoManual = () => {
    vaciarCarrito();
    location.reload();
}