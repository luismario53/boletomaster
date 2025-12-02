export class EventCardComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // 1. Obtenemos el ID para el enlace
        this.eventId = this.getAttribute("id");
        
        this.imagen = this.getAttribute("imagen") || "/assets/default-event.png";
        this.nombre = this.getAttribute("nombre") || "Evento";
        this.fechaRaw = this.getAttribute("fecha");
        this.precio = this.getAttribute("precio") || "Gratis";
        this.lugar = this.getAttribute("lugar") || "Por confirmar";

        const shadow = this.attachShadow({ mode: 'open' });
        this.#render(shadow);
        this.#agregarEstilos(shadow);
    }

    #formatearFecha(fechaString) {
        if (!fechaString) return "Fecha pendiente";
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const fecha = new Date(fechaString + 'T00:00:00'); 
        return fecha.toLocaleDateString('es-ES', opciones);
    }

    #render(shadow) {
        // const fechaLegible = this.#formatearFecha(this.fechaRaw);
        const fechaLegible = this.fechaRaw
        const eventUrl = this.eventId ? `/pages/Evento/event-profile.html?id=${this.eventId}` : '#';

        shadow.innerHTML = `
            <a href="${eventUrl}" class="card-link">
                <div class="card">
                    <div class="img-container">
                        <img src="${this.imagen}" alt="${this.nombre}">
                    </div>

                    <div class="info-container">
                        <div class="main-info">
                            <h3>${this.nombre}</h3>
                            <p class="date">📅 ${fechaLegible}</p>
                            <p class="location">📍 ${this.lugar}</p>
                        </div>
                        
                        <div class="price-action">
                            <span class="price">${this.precio}</span>
                            <span class="btn-tickets">VER DETALLES</span>
                        </div>
                    </div>
                </div>
            </a>
        `;
    }

    #agregarEstilos(shadow) {
        const link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        const rutaCSS = new URL('./event-card.css', import.meta.url).href;
        link.setAttribute("href", rutaCSS);
        shadow.appendChild(link);
    }
}