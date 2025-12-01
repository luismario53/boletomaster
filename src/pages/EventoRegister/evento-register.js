import { HeaderComponent } from "../../components/header/header.js";
import { FooterComponent } from "../../components/footer/footer.js";

window.customElements.define('header-info', HeaderComponent);
window.customElements.define('footer-info', FooterComponent);

document.getElementById('evento-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.querySelector('.btn-auth');
    btn.innerText = "PUBLICANDO...";
    btn.disabled = true;

    const imagenesInputs = document.querySelectorAll('.img-input');
    const imagenesArray = Array.from(imagenesInputs)
        .map(input => input.value.trim())
        .filter(url => url !== "");

    const nuevoEvento = {
        titulo: document.getElementById('titulo').value,
        fecha: document.getElementById('fecha').value, // YYYY-MM-DD
        hora: document.getElementById('hora').value,   // HH:MM
        
        // Ubicación
        lugar: document.getElementById('lugar').value,
        direccion: document.getElementById('direccion').value,
        
        // Venta
        precio: Number(document.getElementById('precio').value),
        moneda: "MXN",
        stock: Number(document.getElementById('stock').value),
        
        // Contenido
        descripcion: document.getElementById('descripcion').value,
        imagenes: imagenesArray,

        createdAt: new Date()
    };

    console.log("📤 Enviando EVENTO al Backend:", nuevoEvento);

    // ==========================================
    // REQUEST FALSA
    // ==========================================
    
    await new Promise(r => setTimeout(r, 1500)); 

    alert(`¡Evento "${nuevoEvento.titulo}" creado exitosamente!`);
    
    // Redirigir a la lista de eventos
    window.location.href = "/pages/Eventos/events.html";
});