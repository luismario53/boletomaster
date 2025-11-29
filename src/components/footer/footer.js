export class FooterComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({mode: 'open'});
        this.#render(shadow);
        this.#agregarEstilos(shadow);
    }

    #render(shadow) {
        shadow.innerHTML = `
            <footer class="main-footer">
                <p class="nombre">SONICO LIRIO</p>

                <div class="social">
                    <a href="https://www.instagram.com/sonicoliriomx/" target="_blank">
                        <img src="/assets/icons/icon_instagram.png" alt="Instagram">
                    </a>

                    <a href="https://www.youtube.com/@sonicoliriomx" target="_blank">
                        <img src="/assets/icons/icon_youtube.png" alt="YouTube">
                    </a>
                </div>
            </footer>
        `;
    }

    #agregarEstilos(shadow) {
        const link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "/components/footer/footer.css");
        shadow.appendChild(link);
    }
}