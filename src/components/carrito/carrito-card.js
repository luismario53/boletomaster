export class CarritoCardComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // 1. Obtenemos el ID para el enlace
        this.eventId = this.getAttribute("id");
        
        this.imagen = this.getAttribute("imagen") || "/assets/default-event.png";
        this.nombre = this.getAttribute("nombre") || "Evento";
        this.precio = this.getAttribute("precio") || "Gratis";
        this.talla = this.getAttribute("talla") || "Sin Talla";
        this.cantidad = this.getAttribute("cantidad") || 0;

        const shadow = this.attachShadow({ mode: 'open' });
        this.#render(shadow);
        this.#agregarEstilos(shadow);
    }

    #render(shadow) {
        const merchUrl = this.eventId ? `/pages/Merch/merch-profile.html?id=${this.eventId}` : '#';

        shadow.innerHTML = `
            <a href="${merchUrl}" class="card-link">
                <div class="card">
                    <div class="img-container">
                        <img src="${this.imagen}" alt="${this.nombre}">
                    </div>

                    <div class="info-container">
                        <div class="main-info">
                            <h3>${this.nombre}</h3>
                            <p class="precio">Precio: $${this.precio}</p>
                            <p class="talla">Talla: ${this.talla}</p>
                        </div>
                        
                    </div>
                </div>
            </a>
        `;
    }

    #agregarEstilos(shadow) {
        const link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        const rutaCSS = new URL('./carrito-card.css', import.meta.url).href;
        link.setAttribute("href", rutaCSS);
        shadow.appendChild(link);
    }
}