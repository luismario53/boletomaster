import { HeaderComponent } from "../../components/header/header.js";
import { FooterComponent } from "../../components/footer/footer.js";

window.customElements.define('header-info', HeaderComponent);
window.customElements.define('footer-info', FooterComponent);

// CARGAR LISTA DE ARTISTAS PARA EL SELECTOR
document.addEventListener('DOMContentLoaded', () => {
    cargarArtistasEnSelector();
});

function cargarArtistasEnSelector() {
    // creo que esto vendria de fetch('/api/artistas')
    const artistasDisponibles = [
        { _id: "1", nombre: "MEXTASIS" },
        { _id: "2", nombre: "EDUL" },
        { _id: "3", nombre: "DISONANTE" },
        { _id: "0", nombre: "SONICO LIRIO (OFICIAL)" }
    ];

    const selector = document.getElementById('artistaSelector');

    artistasDisponibles.forEach(artista => {
        const option = document.createElement('option');
        option.value = artista._id; // Esto es lo que se guardarA en la BD
        option.textContent = artista.nombre;
        selector.appendChild(option);
    });
}

document.getElementById('merch-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.querySelector('.btn-auth');
    btn.innerText = "GUARDANDO...";
    btn.disabled = true;

    const imagenesInputs = document.querySelectorAll('.img-input');
    const imagenesArray = Array.from(imagenesInputs)
        .map(input => input.value.trim())
        .filter(url => url !== "");

    const tallasInputs = document.querySelectorAll('.talla-check:checked');
    const tallasArray = Array.from(tallasInputs).map(cb => cb.value);

    const nuevoProducto = {
        artistaId: document.getElementById('artistaSelector').value, 
        
        nombre: document.getElementById('nombre').value,
        precio: Number(document.getElementById('precio').value),
        moneda: "MXN",
        stock: Number(document.getElementById('stock').value),
        material: document.getElementById('material').value,
        descripcion: document.getElementById('descripcion').value,
        
        tallas: tallasArray,
        imagenes: imagenesArray,

        createdAt: new Date()
    };

    console.log("PRODUCTO CON VINCULACIÓN:", nuevoProducto);

    // ==========================================
    // REQUEST FALSA MOCK
    // ==========================================
    
    await new Promise(r => setTimeout(r, 1500)); 

    alert(`¡Producto "${nuevoProducto.nombre}" registrado exitosamente!`);
    
    // tienda o perfil del artista
    // window.location.href = `/pages/Artista/artist-profile.html?id=${nuevoProducto.artistaId}`;
    window.location.href = "/pages/Artistas/artists.html";
});