import { HeaderComponent } from "../../components/header/header.js"
import { FooterComponent } from "../../components/footer/footer.js"
import { ArtistCardComponent } from "../../components/artist/artist-card.js"

const TIPO_USUARIO = 'ARTISTA'
window.customElements.define('footer-info', FooterComponent)
window.customElements.define('header-info', HeaderComponent)
window.customElements.define('artist-card', ArtistCardComponent)

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.artists-grid')
    renderizarArtistas(container)
})

async function renderizarArtistas(container) {

    try {
        const response = await fetch(`/api/usuarios/tipo/${TIPO_USUARIO}`)
        const data = await response.json()

        if (!response.ok) {
            console.error(data)
            alert(data.error || data.message || "Ocurrió un error inesperado")
            return
        }

        container.innerHTML = '' // Limpiamos por si acaso

        data.forEach(artista => {
            const { _id, nombre, imagenes } = artista
            const { perfil } = imagenes
            const card = document.createElement('artist-card')

            card.setAttribute('id', _id)
            card.setAttribute('nombre', nombre)
            
            if (perfil) {
                card.setAttribute('imagen', perfil)
            }

            container.appendChild(card)
        })


    } catch (error) {
        console.error("Error de conexión:", error)
        alert("Error de conexión con el servidor")
    }
}