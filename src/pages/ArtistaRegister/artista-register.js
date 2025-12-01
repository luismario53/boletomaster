import { HeaderComponent } from "../../components/header/header.js";
import { FooterComponent } from "../../components/footer/footer.js";

window.customElements.define('header-info', HeaderComponent);
window.customElements.define('footer-info', FooterComponent);

document.getElementById('artist-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.querySelector('.btn-auth');
    const originalText = btn.innerText;
    
    btn.innerText = "GUARDANDO...";
    btn.disabled = true;

    // 1. RECOPILAR DATOS DEL FORMULARIO
    const nuevoArtista = {
        // Datos Obligatorios de Usuario
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        telefono: document.getElementById('telefono').value,
        
        // 🔒 IMPORTANTE: Definir el rol automáticamente
        tipoUsuario: "ARTISTA",
        
        // Datos Específicos de Artista
        biografia: document.getElementById('biografia').value,
        
        // Objeto anidado de redes
        redesSociales: {
            instagram: document.getElementById('instagram').value,
            spotify: document.getElementById('spotify').value
        },

        // Imágenes (En un sistema real, aquí subirías los archivos primero)
        imagenes: {
            perfil: document.getElementById('imgPerfil').value || "/assets/default-artist.png",
            banner: document.getElementById('imgBanner').value || "/assets/default-banner.png"
        },

        createdAt: new Date()
    };

    console.log("📤 Enviando datos al Backend:", nuevoArtista);

    // ==========================================
    // 🚧 MOCK REQUEST (Simulación)
    // ==========================================
    
    // Aquí iría: await fetch('/api/usuarios/registro', { ... })
    await new Promise(r => setTimeout(r, 1500)); 

    alert(`¡Artista "${nuevoArtista.nombre}" registrado correctamente!`);
    
    // Opcional: Limpiar formulario o redirigir a la lista de artistas
    window.location.href = "/pages/Artistas/artists.html";
});