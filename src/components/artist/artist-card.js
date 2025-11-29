export class ArtistCardComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        
        // Datos básicos
        this.imagen = this.getAttribute("imagen") || "/assets/default-user.png";
        this.nombre = this.getAttribute("nombre") || "Artista";

        this.#render(shadow);
        this.#agregarEstilos(shadow);
    }

    #render(shadow) {
        shadow.innerHTML = `
            <div class="card">
                <div class="info-section">
                    <img class="cover" src="${this.imagen}" alt="${this.nombre}">
                    <div class="text-data">
                        <h3>${this.nombre}</h3>
                    </div>
                </div>
            </div>
        `;
    }

    #agregarEstilos(shadow) {
        const link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        // Asegúrate de que el CSS esté en la misma carpeta que este JS
        const rutaCSS = new URL('./artist-card.css', import.meta.url).href;
        link.setAttribute("href", rutaCSS);
        shadow.appendChild(link);
    }
}