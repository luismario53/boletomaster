export class MerchCardComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.productId = this.getAttribute("id");
        this.imagen = this.getAttribute("imagen") || "/assets/merch/merch1.png";
        this.nombre = this.getAttribute("nombre") || "Producto";
        this.precio = this.getAttribute("precio") || "";
        this.artista = this.getAttribute("artista") || "";

        const shadow = this.attachShadow({ mode: 'open' });
        this.#render(shadow);
        this.#agregarEstilos(shadow);
    }

    #render(shadow) {
        // Enlace al perfil de Merch
        const productUrl = this.productId 
            ? `/pages/Merch/merch-profile.html?id=${this.productId}` 
            : '#';

        shadow.innerHTML = `
            <a href="${productUrl}" class="card-link">
                <div class="card">
                    <div class="info-section">
                        <div class="text-band">${this.artista}</div>
                        <img class="cover" src="${this.imagen}" alt="${this.nombre}">
                        <div class="text-data">
                            <h3>${this.nombre}</h3>
                            ${this.precio ? `<p class="price">${this.precio}</p>` : ''}
                        </div>
                    </div>
                </div>
            </a>
        `;
    }

    #agregarEstilos(shadow) {
        const link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        const rutaCSS = new URL('./merch-card.css', import.meta.url).href;
        link.setAttribute("href", rutaCSS);
        shadow.appendChild(link);
    }
}