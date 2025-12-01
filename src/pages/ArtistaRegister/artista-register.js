import { HeaderComponent } from "../../components/header/header.js"
import { FooterComponent } from "../../components/footer/footer.js"
import { fetchConAuth, protegerPagina, obtenerUsuario } from '../../utils/fetchConAuth.js'

window.customElements.define('header-info', HeaderComponent)
window.customElements.define('footer-info', FooterComponent)

protegerPagina()
document.getElementById('artist-form').addEventListener('submit', async (e) => {
    e.preventDefault()

    const btn = document.querySelector('.btn-auth')
    const originalText = btn.innerText
    
    btn.innerText = "GUARDANDO..."
    btn.disabled = true

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
    }

    try {
        const response = await fetchConAuth("/api/usuarios", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(nuevoArtista),
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

        // Solo llega aquí si response.ok es true (status 200-299)
        alert(`¡Artista "${nuevoArtista.nombre}" registrado correctamente!`)
        window.location.href = "/pages/Artistas/artists.html"

    } catch (error) {
        console.error("Error de conexión:", error)
        alert("Error de conexión con el servidor")
    }

})