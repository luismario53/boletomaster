import { HeaderComponent } from "../../components/header/header.js";
import { FooterComponent } from "../../components/footer/footer.js";
// Importamos la nueva tarjeta de evento
import { EventCardComponent } from "../../components/event/event-card.js";

window.customElements.define('footer-info', FooterComponent);
window.customElements.define('header-info', HeaderComponent);
window.customElements.define('event-card', EventCardComponent);

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.events-list');
    cargarEventos(container);
});

function cargarEventos(container) {
    // ==========================================
    // DATOS HARCODEADOS
    // ==========================================
    
    //  YYYY-MM-DD para ordenar
    const mockEventos = [
        {
            _id: "1",
            nombre: "Brote Delirios",
            fecha: "2025-07-07",
            precio: "Gratuito",
            lugar: "Bauba Cafe, Laguna del Nainari",
            imagen: "/assets/eventos/evento1.png"
        },
        {
            _id: "2",
            nombre: "Noche Neon",
            fecha: "2025-07-12",
            precio: "$120 MXN",
            lugar: "Neon Fiesta Vip",
            imagen: "/assets/eventos/evento2.png"
        }
    ];

    // ordenamos de más próximo a más lejano
    mockEventos.sort((a, b) => {
        const fechaA = new Date(a.fecha);
        const fechaB = new Date(b.fecha);
        return fechaA - fechaB; // el próximo primero
    });
    
    container.innerHTML = '';

    mockEventos.forEach(evento => {
        const card = document.createElement('event-card');
        
        card.setAttribute('id', evento._id);

        card.setAttribute('nombre', evento.nombre);
        card.setAttribute('fecha', evento.fecha);
        card.setAttribute('precio', evento.precio);
        card.setAttribute('lugar', evento.lugar);
        if(evento.imagen) card.setAttribute('imagen', evento.imagen);

        container.appendChild(card);
    });
}