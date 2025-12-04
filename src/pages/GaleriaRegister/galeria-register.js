import { HeaderComponent } from "../../components/header/header.js";
import { FooterComponent } from "../../components/footer/footer.js";

// Definimos componentes
window.customElements.define('header-info', HeaderComponent);
window.customElements.define('footer-info', FooterComponent);

// --- 1. PROTECCIÓN DE PÁGINA MANUAL ---
document.addEventListener('DOMContentLoaded', () => {
    const usuarioJSON = localStorage.getItem('usuario_sonicolirio');
    
    if (!usuarioJSON) {
        alert("Debes iniciar sesión para acceder aquí.");
        window.location.href = "/src/pages/Login/login.html";
        return;
    }

    const usuario = JSON.parse(usuarioJSON);
    
    // Verificar rol
    if (usuario.tipoUsuario !== 'ORGANIZADOR' && usuario.tipoUsuario !== 'ADMIN') {
        alert("No tienes permisos para ver esta página.");
        window.location.href = "/src/pages/Principal/main.html";
    }
});

// --- 2. LÓGICA DE INPUTS DINÁMICOS ---
const container = document.getElementById('photos-container');
const addBtn = document.getElementById('add-photo-btn');

addBtn.addEventListener('click', () => {
    const div = document.createElement('div');
    div.className = 'input-group photo-row';
    
    div.innerHTML = `
        <input type="text" class="photo-input" placeholder="URL de la imagen..." required>
        <button type="button" class="remove-btn" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    container.appendChild(div);
});

// --- 3. GUARDAR GALERÍA ---
document.getElementById('gallery-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.querySelector('.btn-auth');
    const originalText = btn.innerText;
    
    btn.innerText = "PUBLICANDO...";
    btn.disabled = true;

    // A) Recopilar URLs de las fotos
    const inputs = document.querySelectorAll('.photo-input');
    const imagenesArray = Array.from(inputs)
        .map(input => input.value.trim())
        .filter(url => url !== ""); 

    // Validación mínima
    if (imagenesArray.length === 0) {
        alert("Debes agregar al menos una foto.");
        btn.innerText = originalText;
        btn.disabled = false;
        return;
    }

    // B) Construir Objeto
    // Asegúrate de que tu backend espere "fotos" o "imagenes" en el array
    const nuevaGaleria = {
        evento: document.getElementById('evento').value,
        fecha: document.getElementById('fecha').value,
        descripcion: document.getElementById('descripcion').value,
        fotos: imagenesArray, // Enviaremos el array de strings
        createdAt: new Date()
    };

    console.log("📤 Enviando Galería:", nuevaGaleria);

    try {
        const token = localStorage.getItem('token');

        // Petición directa al Backend (Puerto 5000)
        const response = await fetch("http://localhost:5000/api/galeria", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(nuevaGaleria),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Error servidor:", data);
            alert(data.error || data.message || "Error al crear la galería");
            btn.innerText = originalText;
            btn.disabled = false;
            return;
        }

        alert(`¡Álbum "${nuevaGaleria.evento}" publicado con ${imagenesArray.length} fotos!`);
        window.location.href = "/src/pages/Galeria/galeria.html";

    } catch (error) {
        console.error("Error de conexión:", error);
        alert("Error de conexión con el servidor (Puerto 5000)");
        btn.innerText = originalText;
        btn.disabled = false;
    }
});