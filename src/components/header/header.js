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
        const logoURL = new URL('/assets/logo.jpg', import.meta.url).href;
        const homeURL = "../../pages/Principal/main.html";
        const artistasURL = "../../pages/Artistas/artists.html";


        shadow.innerHTML += `
            <header class="main-header">
                <a href="${homeURL}" class="logo-link">
                    <img src="${logoURL}" alt="Logo" class="logo" />
                </a>

                <nav class="nav-menu">
                    <a href="${artistasURL}">ARTISTAS</a>
                    <a href="#eventos">EVENTOS</a>
                    <a href="#galeria">GALERÍA</a>
                    <a href="#contacto">CONTACTO</a>
                </nav>
            </header>
        `
    };

    #agregarEstilos(shadow) {
        const link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "/components/header/header.css");
        shadow.appendChild(link);
    };
}