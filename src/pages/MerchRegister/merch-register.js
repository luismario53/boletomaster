import { HeaderComponent } from "../../components/header/header.js";
import { FooterComponent } from "../../components/footer/footer.js";

window.customElements.define('header-info', HeaderComponent);
window.customElements.define('footer-info', FooterComponent);

const TIPO_USUARIO = 'ARTISTA';

// --- 1. PROTECCIÓN DE PÁGINA MANUAL ---
document.addEventListener('DOMContentLoaded', () => {
    const usuarioJSON = localStorage.getItem('usuario_sonicolirio');
    
    if (!usuarioJSON) {
        alert("Debes iniciar sesión para acceder aquí.");
        window.location.href = "/src/pages/Login/login.html";
        return;
    }

    const usuario = JSON.parse(usuarioJSON);
    
    if (usuario.tipoUsuario !== 'ORGANIZADOR' && usuario.tipoUsuario !== 'ADMIN') {
        alert("No tienes permisos para ver esta página.");
        window.location.href = "/src/pages/Principal/main.html";
        return;
    }

    // Si pasó la seguridad, cargamos los artistas
    cargarArtistasEnSelector();
});

// --- 2. CARGAR ARTISTAS (Para el Select) ---
async function cargarArtistasEnSelector() {
    try {
        // Usamos la ruta pública que configuramos antes
        const response = await fetch(`http://localhost:5000/api/usuarios/tipo/${TIPO_USUARIO}`);
        const data = await response.json();

        if (!response.ok) {
            console.error(data);
            alert(data.error || data.message || "Error al cargar artistas");
            return;
        }

        const selector = document.getElementById('artistaSelector');
        selector.innerHTML = '';

        // Opción por defecto
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '-- Selecciona un artista --';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        selector.appendChild(defaultOption);

        data.forEach(artista => {
            const { _id, nombre } = artista;
            const option = document.createElement('option');
            option.value = _id;
            option.textContent = nombre;
            selector.appendChild(option);
        });

    } catch (error) {
        console.error("Error de conexión:", error);
        alert("Error de conexión al cargar la lista de artistas");
    }
}

// --- 3. GUARDAR PRODUCTO ---
document.getElementById('merch-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.querySelector('.btn-auth');
    const originalText = btn.innerText;
    
    btn.innerText = "GUARDANDO...";
    btn.disabled = true;

    // Recopilar datos complejos (Arrays)
    const imagenesInputs = document.querySelectorAll('.img-input');
    const imagenesArray = Array.from(imagenesInputs)
        .map(input => input.value.trim())
        .filter(url => url !== "");

    const tallasInputs = document.querySelectorAll('.talla-check:checked');
    const tallasArray = Array.from(tallasInputs).map(cb => cb.value);

    // Construir objeto
    const nuevoProducto = {
        // Asegúrate de que tu modelo en backend espere "artista" o "idArtista"
        // En Mongoose suele ser: artista: { type: ObjectId, ref: 'Usuario' }
        idArtista: document.getElementById('artistaSelector').value, 
        
        nombre: document.getElementById('nombre').value,
        precio: Number(document.getElementById('precio').value),
        moneda: "MXN",
        stock: Number(document.getElementById('stock').value),
        material: document.getElementById('material').value,
        descripcion: document.getElementById('descripcion').value,
        
        tallas: tallasArray,
        imagenes: imagenesArray, // Tu backend debe esperar un array de strings

        createdAt: new Date()
    };

    console.log("📤 Enviando Merch:", nuevoProducto);

    try {
        const token = localStorage.getItem('token');

        const response = await fetch("http://localhost:5000/api/merch", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(nuevoProducto),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(data);
            alert(data.error || data.message || "Error al registrar producto");
            btn.innerText = originalText;
            btn.disabled = false;
            return;
        }

        alert(`¡Producto registrado correctamente!`);
        // Redirigir a la tienda
        window.location.href = "/pages/Merchs/merchs.html";

    } catch (error) {
        console.error("Error de conexión:", error);
        alert("Error de conexión con el servidor (Puerto 5000)");
        btn.innerText = originalText;
        btn.disabled = false;
    }
});