import { HeaderComponent } from "../../components/header/header.js";
import { FooterComponent } from "../../components/footer/footer.js";

// Definimos los componentes
window.customElements.define('header-info', HeaderComponent);
window.customElements.define('footer-info', FooterComponent);

// --- 1. PROTECCIÓN DE PÁGINA (Manual) ---
document.addEventListener('DOMContentLoaded', () => {
    const usuarioJSON = localStorage.getItem('usuario_sonicolirio');
    
    if (!usuarioJSON) {
        alert("Debes iniciar sesión para acceder aquí.");
        window.location.href = "/src/pages/Login/login.html";
        return;
    }

    const usuario = JSON.parse(usuarioJSON);
    
    // Validar si es Organizador o Admin (Ajusta según tu lógica)
    if (usuario.tipoUsuario !== 'ORGANIZADOR' && usuario.tipoUsuario !== 'ADMIN') {
        alert("No tienes permisos para ver esta página.");
        window.location.href = "/pages/Principal/main.html";
    }
});

// --- 2. LÓGICA DE REGISTRO ---
document.getElementById('artist-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.querySelector('.btn-auth');
    const originalText = btn.innerText;
    
    btn.innerText = "GUARDANDO...";
    btn.disabled = true;

    // Recopilar datos
    const nuevoArtista = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        telefono: document.getElementById('telefono').value,
        tipoUsuario: "ARTISTA", // Rol fijo
        biografia: document.getElementById('biografia').value,
        redesSociales: {
            instagram: document.getElementById('instagram').value,
            spotify: document.getElementById('spotify').value
        },
        imagenes: {
            perfil: document.getElementById('imgPerfil').value || "/src/assets/default-artist.png",
            banner: document.getElementById('imgBanner').value || "/src/assets/default-banner.png"
        }
    };

    try {
        // Recuperamos el token para tener permiso
        const token = localStorage.getItem('token');

        // Petición al Backend (Puerto 5000)
        // NOTA: Asegúrate que la ruta en tu backend sea /api/auth/register O /api/usuarios
        // Si usas el AuthController que hicimos antes, es /api/auth/register
        const response = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Enviamos el token
            },
            body: JSON.stringify(nuevoArtista),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Error servidor:", data);
            alert(data.message || data.error || "Error al registrar artista");
            btn.innerText = originalText;
            btn.disabled = false;
            return;
        }

        alert(`¡Artista "${nuevoArtista.nombre}" registrado correctamente!`);
        window.location.href = "/pages/Artistas/artists.html";

    } catch (error) {
        console.error("Error de conexión:", error);
        alert("Error de conexión con el servidor (Puerto 5000)");
        btn.innerText = originalText;
        btn.disabled = false;
    }
});