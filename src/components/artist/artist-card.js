// src/components/artist/artist-card.js

export class ArtistCardComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // LEEMOS EL ID. Si no hay, no ponemos enlace.
        this.artistId = this.getAttribute("id");
        this.imagen = this.getAttribute("imagen") || "/assets/default-user.png";
        this.nombre = this.getAttribute("nombre") || "Artista";

        const shadow = this.attachShadow({ mode: 'open' });
        this.#render(shadow);
        this.#agregarEstilos(shadow);
    }

    #render(shadow) {
        // Si tenemos ID, creamos la URL. Si no, dejamos href vacío o #
        const profileUrl = this.artistId ? `/pages/Artista/artist-profile.html?id=${this.artistId}` : `#`;

        shadow.innerHTML = `
            <a href="${profileUrl}" class="card-link">
                <div class="card">
                    <div class="info-section">
                        <img class="cover" src="${this.imagen}" alt="${this.nombre}">
                        <div class="text-data">
                            <h3>${this.nombre}</h3>
                        </div>
                    </div>
                </div>
            </a>
        `;
    }

    #agregarEstilos(shadow) {
        const link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        const rutaCSS = new URL('./artist-card.css', import.meta.url).href;
        link.setAttribute("href", rutaCSS);
        shadow.appendChild(link);
    }
}