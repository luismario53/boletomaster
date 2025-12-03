import { HeaderComponent } from "../../components/header/header.js";
import { FooterComponent } from "../../components/footer/footer.js";
import { fetchConAuth, protegerPaginaPorRol, obtenerUsuario } from '../../utils/fetchConAuth.js'

window.customElements.define('header-info', HeaderComponent);
window.customElements.define('footer-info', FooterComponent);

protegerPaginaPorRol()
document.getElementById('evento-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.querySelector('.btn-auth');
    const originalText = btn.innerText
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

    console.log(nuevoEvento)

    try {
        const response = await fetchConAuth("/api/eventos", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(nuevoEvento),
        })

        const data = await response.json()

        // ✅ Verificar si la respuesta fue exitosa
        if (!response.ok) {
            // El servidor devolvió 400, 401, 500, etc.
            console.error("Ocurrió un error inesperado:", data)
            alert(data.error || data.message || "Error al registrar artista")

            btn.innerText = originalText
            btn.disabled = false
            return
        }

        alert(`¡Evento "${nuevoEvento.titulo}" creado exitosamente!`);
        window.location.href = "/pages/Eventos/events.html";

    } catch (error) {
        btn.innerText = originalText
        btn.disabled = false
        console.error("Error de conexión:", error)
        alert("Error de conexión con el servidor")
    }
});