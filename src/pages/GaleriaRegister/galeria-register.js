import { HeaderComponent } from "../../components/header/header.js";
import { FooterComponent } from "../../components/footer/footer.js";

window.customElements.define('header-info', HeaderComponent);
window.customElements.define('footer-info', FooterComponent);

// --- 1. PROTECCIÓN DE PÁGINA ---
document.addEventListener('DOMContentLoaded', () => {
    const usuarioJSON = localStorage.getItem('usuario_sonicolirio');
    if (!usuarioJSON) {
        window.location.href = "/pages/Login/login.html";
        return;
    }
    const usuario = JSON.parse(usuarioJSON);
    if (usuario.tipoUsuario !== 'ORGANIZADOR' && usuario.tipoUsuario !== 'ADMIN') {
        alert("No tienes permisos.");
        window.location.href = "/pages/Principal/main.html";
    }
});

// --- 2. INPUTS DINÁMICOS ---
const container = document.getElementById('photos-container');
const addBtn = document.getElementById('add-photo-btn');

addBtn.addEventListener('click', () => {
    const div = document.createElement('div');
    div.className = 'input-group photo-row';
    // Aseguramos que el nuevo input también tenga la clase 'photo-input'
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
    btn.innerText = "PUBLICANDO...";
    btn.disabled = true;

    // A) Recopilar URLs
    // Buscamos todos los elementos con la clase .photo-input
    const inputs = document.querySelectorAll('.photo-input');
    
    const imagenesArray = Array.from(inputs)
        .map(input => input.value.trim()) // Obtenemos el texto
        .filter(url => url !== "");       // Quitamos vacíos

    console.log("📸 Fotos detectadas:", imagenesArray); // <--- MIRA LA CONSOLA

    if (imagenesArray.length === 0) {
        alert("Debes agregar al menos una URL de foto válida.");
        btn.innerText = "PUBLICAR GALERÍA";
        btn.disabled = false;
        return;
    }

    // B) Construir Objeto
    const nuevaGaleria = {
        evento: document.getElementById('evento').value,
        fecha: document.getElementById('fecha').value,
        descripcion: document.getElementById('descripcion').value,
        
        // ¡OJO AQUÍ! Usamos la clave 'fotos' para coincidir con el Modelo
        fotos: imagenesArray, 
        
        createdAt: new Date()
    };

    console.log("📤 Enviando al Backend:", nuevaGaleria);

    try {
        const token = localStorage.getItem('token');

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
            console.error(data);
            alert(data.error || data.message || "Error al crear la galería");
            btn.innerText = "PUBLICAR GALERÍA";
            btn.disabled = false;
            return;
        }

        alert(`¡Álbum publicado con ${imagenesArray.length} fotos!`);
        window.location.href = "/pages/Galeria/galeria.html";

    } catch (error) {
        console.error("Error:", error);
        alert("Error de conexión");
        btn.innerText = "PUBLICAR GALERÍA";
        btn.disabled = false;
    }
});