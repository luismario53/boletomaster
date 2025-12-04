import { HeaderComponent } from "../../components/header/header.js";
import { FooterComponent } from "../../components/footer/footer.js";

window.customElements.define('header-info', HeaderComponent);
window.customElements.define('footer-info', FooterComponent);

// 1. PROTECCIÓN DE PÁGINA
document.addEventListener('DOMContentLoaded', () => {
    const usuarioJSON = localStorage.getItem('usuario_sonicolirio');
    
    if (!usuarioJSON) {
        alert("Debes iniciar sesión.");
        window.location.href = "/pages/Login/login.html";
        return;
    }

    const usuario = JSON.parse(usuarioJSON);
    
    // Solo ARTISTAS (o admins) pueden entrar
    if (usuario.tipoUsuario !== 'ARTISTA' && usuario.tipoUsuario !== 'ADMIN') {
        alert("Esta sección es exclusiva para Artistas.");
        window.location.href = "/pages/Usuario/usuario.html";
    }
});

// 2. LOGICA DE REGISTRO
document.getElementById('lanzamiento-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.querySelector('.btn-auth');
    const originalText = btn.innerText;
    btn.innerText = "PUBLICANDO...";
    btn.disabled = true;

    // Recuperamos el usuario para saber QUIÉN es el artista
    const usuario = JSON.parse(localStorage.getItem('usuario_sonicolirio'));

    const nuevoLanzamiento = {
        idArtista: usuario._id, // EL ID DEL ARTISTA LOGUEADO
        nombreArtista: usuario.nombre, // Guardamos el nombre también por comodidad
        
        titulo: document.getElementById('titulo').value,
        imagen: document.getElementById('imagen').value,
        spotify: document.getElementById('spotify').value,
        youtube: document.getElementById('youtube').value,
        
        createdAt: new Date()
    };

    console.log("📤 Enviando Lanzamiento:", nuevoLanzamiento);

    try {
        const token = localStorage.getItem('token');

        const response = await fetch("http://localhost:5000/api/lanzamientos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(nuevoLanzamiento),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(data);
            alert(data.mensaje || "Error al registrar lanzamiento");
            btn.innerText = originalText;
            btn.disabled = false;
            return;
        }

        alert(`¡"${nuevoLanzamiento.titulo}" publicado con éxito!`);
        window.location.href = "/pages/Usuario/usuario.html";

    } catch (error) {
        console.error("Error de conexión:", error);
        alert("Error de conexión con el servidor (Puerto 5000)");
        btn.innerText = originalText;
        btn.disabled = false;
    }
});