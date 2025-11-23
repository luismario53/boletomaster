export class HeaderComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({mode: 'open'});

        this.#agregarEstilos(shadow);
        this.#render(shadow);
    }

    #render(shadow) {
        shadow.innerHTML += `
            <div class="card">
            <img class="cover" src="${imagen}" alt="${titulo}" />
            <div class="info">
                <h3>${titulo}</h3>
                <p>${artista}</p>
            </div>
            </div>
        `
    };

    #agregarEstilos(shadow) {
        const link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "./src/components/lanzamientos/lanzamientos.css");
        shadow.appendChild(link);
    };
}