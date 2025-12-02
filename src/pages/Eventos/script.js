import { HeaderComponent } from "../../components/header/header.js";
import { FooterComponent } from "../../components/footer/footer.js";
import { formatearFechaDisplay } from '../../utils/fechaFormateada.js'
// Importamos la nueva tarjeta de evento
import { EventCardComponent } from "../../components/event/event-card.js";

window.customElements.define('footer-info', FooterComponent);
window.customElements.define('header-info', HeaderComponent);
window.customElements.define('event-card', EventCardComponent);

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.events-list');
    cargarEventos(container);
});

async function cargarEventos(container) {

    try {
        const response = await fetch(`/api/eventos`)
        const data = await response.json()

        if (!response.ok) {
            console.error(data)
            alert(data.error || data.message || "Ocurrió un error inesperado")
            return
        }

        container.innerHTML = '' // Limpiamos por si acaso

        console.log(data)
        // ordenamos de más próximo a más lejano
        data.sort((a, b) => {
            const fechaA = new Date(a.fecha);
            const fechaB = new Date(b.fecha);
            return fechaA - fechaB; // el próximo primero
        });

        data.forEach(evento => {
            console.log(evento)
            const { _id, titulo, fecha, precio, lugar, imagenes } = evento
            const fechaFormateada = formatearFechaDisplay(fecha)

            const card = document.createElement('event-card');
            
            card.setAttribute('id', _id);

            card.setAttribute('nombre', titulo);
            card.setAttribute('fecha', fechaFormateada);
            card.setAttribute('precio', `$ ${precio}`);
            card.setAttribute('lugar', lugar);
            if(imagenes) card.setAttribute('imagen', imagenes[0]);

            container.appendChild(card);
        });

    } catch (error) {
        console.error("Error de conexión:", error)
        alert("Error de conexión con el servidor")
    }
}