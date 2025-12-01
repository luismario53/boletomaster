import { HeaderComponent } from "../../components/header/header.js";
import { FooterComponent } from "../../components/footer/footer.js";

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
    btn.innerText = "PUBLICANDO...";
    btn.disabled = true;

    // URLs de las fotos
    const inputs = document.querySelectorAll('.photo-input');
    const fotosArray = Array.from(inputs)
        .map(input => input.value.trim())
        .filter(url => url !== ""); 

    if (fotosArray.length === 0) {
        alert("Debes agregar al menos una foto.");
        btn.innerText = "PUBLICAR GALERÍA";
        btn.disabled = false;
        return;
    }

    const nuevaGaleria = {
        evento: document.getElementById('evento').value,
        fecha: document.getElementById('fecha').value,
        descripcion: document.getElementById('descripcion').value,
        fotos: fotosArray, // ARRAY CON TODAS LAS FOTOS
        createdAt: new Date()
    };

    console.log("📤 GALERÍA LISTA PARA BACKEND:", nuevaGaleria);

    // ==========================================
    // REQUEST FALSA
    // ==========================================
    
    await new Promise(r => setTimeout(r, 1500)); 

    alert(`¡Álbum "${nuevaGaleria.evento}" publicado con ${fotosArray.length} fotos!`);
    window.location.href = "/pages/Galeria/galeria.html";
});