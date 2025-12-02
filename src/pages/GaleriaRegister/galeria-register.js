import { HeaderComponent } from "../../components/header/header.js";
import { FooterComponent } from "../../components/footer/footer.js";
import { fetchConAuth, protegerPagina, obtenerUsuario } from '../../utils/fetchConAuth.js'

window.customElements.define('header-info', HeaderComponent);
window.customElements.define('footer-info', FooterComponent);

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

document.getElementById('gallery-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.querySelector('.btn-auth');
    const originalText = btn.innerText
    btn.innerText = "PUBLICANDO...";
    btn.disabled = true;

    // URLs de las fotos
    const inputs = document.querySelectorAll('.photo-input');
    const imagenesArray = Array.from(inputs)
        .map(input => input.value.trim())
        .filter(url => url !== ""); 

    if (imagenesArray.length === 0) {
        alert("Debes agregar al menos una foto.");
        btn.innerText = "PUBLICAR GALERÍA";
        btn.disabled = false;
        return;
    }

    const nuevaGaleria = {
        evento: document.getElementById('evento').value,
        fecha: document.getElementById('fecha').value, // YYYY-MM-DD
        descripcion: document.getElementById('descripcion').value,
        imagenes: imagenesArray, // ARRAY CON TODAS LAS FOTOS
        createdAt: new Date()
    };


    console.log(nuevaGaleria)

    try {
        const response = await fetchConAuth("/api/galeria", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(nuevaGaleria),
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

        alert(`¡Álbum "${nuevaGaleria.evento}" publicado con ${imagenesArray.length} fotos!`);
        window.location.href = "/pages/Galeria/galeria.html";

    } catch (error) {
        btn.innerText = originalText
        btn.disabled = false
        console.error("Error de conexión:", error)
        alert("Error de conexión con el servidor")
    }

});