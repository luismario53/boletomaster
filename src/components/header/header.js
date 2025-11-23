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
            <header class="main-header">
                <img src="./src/assets/image 1.jpg" alt="Logo" class="logo" />

                <nav class="nav-menu">
                    <a href="#artistas">ARTISTAS</a>
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
        link.setAttribute("href", "./src/components/header/header.css");
        shadow.appendChild(link);
    };
}