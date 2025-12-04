import { HeaderComponent } from "../../components/header/header.js";
import { FooterComponent } from "../../components/footer/footer.js";

// Definimos componentes
window.customElements.define('header-info', HeaderComponent);
window.customElements.define('footer-info', FooterComponent);

// --- 1. PROTECCIÓN DE PÁGINA MANUAL ---
document.addEventListener('DOMContentLoaded', () => {
    // Usamos la llave correcta que definimos antes
    const usuarioJSON = localStorage.getItem('usuario_sonicolirio');
    
    if (!usuarioJSON) {
        alert("Debes iniciar sesión para acceder aquí.");
        window.location.href = "/pages/Login/login.html";
        return;
    }

    const usuario = JSON.parse(usuarioJSON);
    
    // Verificar rol (ORGANIZADOR o ADMIN)
    if (usuario.tipoUsuario !== 'ORGANIZADOR' && usuario.tipoUsuario !== 'ADMIN') {
        alert("No tienes permisos para ver esta página.");
        window.location.href = "/pages/Principal/main.html";
    }
});

// --- 2. LÓGICA DE REGISTRO ---
document.getElementById('evento-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.querySelector('.btn-auth');
    const originalText = btn.innerText;
    
    btn.innerText = "PUBLICANDO...";
    btn.disabled = true;

    // Recopilar imágenes
    const imagenesInputs = document.querySelectorAll('.img-input');
    const imagenesArray = Array.from(imagenesInputs)
        .map(input => input.value.trim())
        .filter(url => url !== "");

    // Construir objeto
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

    console.log("📤 Enviando:", nuevoEvento);

    try {
        // Recuperar token para autorización
        const token = localStorage.getItem('token');

        // Petición directa al Backend (Puerto 5000)
        // Asegúrate de que la ruta en tu backend sea /api/eventos
        const response = await fetch("http://localhost:5000/api/eventos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Token en el header
            },
            body: JSON.stringify(nuevoEvento),
        });

        const data = await response.json();

        // Verificar respuesta
        if (!response.ok) {
            console.error("Error servidor:", data);
            alert(data.error || data.message || "Error al registrar evento");

            btn.innerText = originalText;
            btn.disabled = false;
            return;
        }

        // Éxito
        alert(`¡Evento "${nuevoEvento.titulo}" creado exitosamente!`);
        window.location.href = "/pages/Eventos/events.html";

    } catch (error) {
        console.error("Error de conexión:", error);
        alert("Error de conexión con el servidor (Puerto 5000)");
        btn.innerText = originalText;
        btn.disabled = false;
    }
});