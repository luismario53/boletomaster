import { HeaderComponent } from "../../components/header/header.js"
import { FooterComponent } from "../../components/footer/footer.js"
import { fetchConAuth, protegerPaginaPorRol, obtenerUsuario } from '../../utils/fetchConAuth.js'

window.customElements.define('header-info', HeaderComponent)
window.customElements.define('footer-info', FooterComponent)

const TIPO_USUARIO = 'ARTISTA'

protegerPaginaPorRol()
// CARGAR LISTA DE ARTISTAS PARA EL SELECTOR
document.addEventListener('DOMContentLoaded', () => {
    cargarArtistasEnSelector()
})

async function cargarArtistasEnSelector() {

    try {
        const response = await fetchConAuth(`/api/usuarios/tipo/${TIPO_USUARIO}`)
        const data = await response.json()

        if (!response.ok) {
            console.error(data)
            alert(data.error || data.message || "Ocurrió un error inesperado")
            return
        }

        const selector = document.getElementById('artistaSelector')
        selector.innerHTML = ''

        // Agregar opción por defecto (placeholder)
        const defaultOption = document.createElement('option')
        defaultOption.value = ''
        defaultOption.textContent = '-- Selecciona un artista --'
        defaultOption.disabled = true
        defaultOption.selected = true
        selector.appendChild(defaultOption)

        data.forEach(artista => {
            const { _id, nombre } = artista
            const option = document.createElement('option')
            option.value = _id
            option.textContent = nombre
            selector.appendChild(option)
        })

    } catch (error) {
        console.error("Error de conexión:", error)
        alert("Error de conexión con el servidor")
    }

}

document.getElementById('merch-form').addEventListener('submit', async (e) => {
    e.preventDefault()

    const btn = document.querySelector('.btn-auth')
    btn.innerText = "GUARDANDO..."
    btn.disabled = true

    const imagenesInputs = document.querySelectorAll('.img-input')
    const imagenesArray = Array.from(imagenesInputs)
        .map(input => input.value.trim())
        .filter(url => url !== "")

    const tallasInputs = document.querySelectorAll('.talla-check:checked')
    const tallasArray = Array.from(tallasInputs).map(cb => cb.value)

    const nuevoProducto = {
        idArtista: document.getElementById('artistaSelector').value, 
        
        nombre: document.getElementById('nombre').value,
        precio: Number(document.getElementById('precio').value),
        moneda: "MXN",
        stock: Number(document.getElementById('stock').value),
        material: document.getElementById('material').value,
        descripcion: document.getElementById('descripcion').value,
        
        tallas: tallasArray,
        imagenes: imagenesArray,

        createdAt: new Date()
    }

    console.log(nuevoProducto)

    try {
        const response = await fetchConAuth("/api/merch", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(nuevoProducto),
        })

        const data = await response.json()
        console.log(data)

        if (!response.ok) {
            console.error(data)
            alert(data.error || data.message || "Ocurrió un error inesperado")
            btn.innerText = originalText
            btn.disabled = false
            return
        }

        alert(`Merch registrado correctamente!`)
        window.location.href = "/pages/Usuario/usuario.html"

    } catch (error) {
        btn.innerText = originalText
        btn.disabled = false
        console.error("Error de conexión:", error)
        alert("Error de conexión con el servidor")
    }
})