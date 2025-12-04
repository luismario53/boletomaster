import { HeaderComponent } from "../../components/header/header.js";
import { FooterComponent } from "../../components/footer/footer.js";

window.customElements.define('header-info', HeaderComponent);
window.customElements.define('footer-info', FooterComponent);

document.addEventListener('DOMContentLoaded', () => {
    // 1. PROTECCIÓN DE PÁGINA
    const usuarioJSON = localStorage.getItem('usuario_sonicolirio');
    if (!usuarioJSON) {
        window.location.href = "/src/pages/Login/login.html";
        return;
    }
    const usuario = JSON.parse(usuarioJSON);
    if (usuario.tipoUsuario !== 'ORGANIZADOR' && usuario.tipoUsuario !== 'ADMIN') {
        alert("No tienes permisos.");
        window.location.href = "/pages/Principal/main.html";
        return;
    }

    // 2. CARGAR ARTISTAS (NUEVO)
    cargarArtistasCheckboxes();
});

async function cargarArtistasCheckboxes() {
    try {
        const container = document.getElementById('artistas-container');
        // Pedimos solo usuarios tipo ARTISTA
        const response = await fetch('http://localhost:5000/api/usuarios/tipo/ARTISTA');
        const artistas = await response.json();

        container.innerHTML = '';

        if (!response.ok || artistas.length === 0) {
            container.innerHTML = '<p>No hay artistas disponibles.</p>';
            return;
        }

        artistas.forEach(artista => {
            const div = document.createElement('label');
            div.className = 'checkbox-item';
            div.innerHTML = `
                <input type="checkbox" id="art-${artista._id}" value="${artista._id}" class="artista-check">
                <label>${artista.nombre}</label>
            `;
            container.appendChild(div);
        });

    } catch (error) {
        console.error("Error cargando artistas:", error);
    }
}

document.getElementById('evento-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.querySelector('.btn-auth');
    const originalText = btn.innerText;
    btn.innerText = "PUBLICANDO...";
    btn.disabled = true;

    // Recopilar Imágenes
    const imagenesInputs = document.querySelectorAll('.img-input');
    const imagenesArray = Array.from(imagenesInputs)
        .map(input => input.value.trim())
        .filter(url => url !== "");

    // RECOPILAR ARTISTAS SELECCIONADOS (NUEVO)
    const checkboxes = document.querySelectorAll('.artista-check:checked');
    const artistasIds = Array.from(checkboxes).map(cb => cb.value);

    const nuevoEvento = {
        titulo: document.getElementById('titulo').value,
        fecha: document.getElementById('fecha').value,
        hora: document.getElementById('hora').value,
        lugar: document.getElementById('lugar').value,
        direccion: document.getElementById('direccion').value,
        precio: Number(document.getElementById('precio').value),
        moneda: "MXN",
        stock: Number(document.getElementById('stock').value),
        descripcion: document.getElementById('descripcion').value,
        imagenes: imagenesArray,
        
        // Enviamos el array de IDs
        artistas: artistasIds, 
        
        createdAt: new Date()
    };

    console.log("📤 Enviando evento:", nuevoEvento);

    try {
        const token = localStorage.getItem('token');
        const response = await fetch("http://localhost:5000/api/eventos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(nuevoEvento),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(data);
            alert(data.mensaje || "Error al crear evento");
            btn.innerText = originalText;
            btn.disabled = false;
            return;
        }

        alert(`¡Evento "${nuevoEvento.titulo}" creado exitosamente!`);
        window.location.href = "/pages/Eventos/events.html";

    } catch (error) {
        console.error("Error:", error);
        alert("Error de conexión");
        btn.innerText = originalText;
        btn.disabled = false;
    }
});