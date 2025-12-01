export class CarouselComponent extends HTMLElement {

    constructor() {
        super();
        this.imagenes = [
            { id: "1", src: "/assets/eventos/evento1.png" },
            { id: "2", src: "/assets/eventos/evento2.png" }
        ];
        this.index = 0;
    }

    connectedCallback() {
        const shadow = this.attachShadow({mode: 'open'});
        this.#agregarEstilos(shadow);
        this.#render(shadow);
        this.#agregarEventos(shadow);
    }

    #render(shadow) {
        // Imagen para mostrar al inicio
        const imagenActual = this.imagenes[0].src;

        shadow.innerHTML += `
            <section class="eventos-carousel">

                <div class="slide-bg"></div>

                <button class="carousel-btn left-btn">
                    <img src="/assets/icons/arrow_left.png" alt="Anterior">
                </button>

                <div class="carousel-slide">
                    <div class="slides-container">
                        <img src="${imagenActual}" class="slide-img" alt="Evento destacado">
                    </div>

                    <div class="slide-bg"></div>
                </div>

                <button class="carousel-btn right-btn">
                    <img src="/assets/icons/arrow_right.png" alt="Siguiente">
                </button>

            </section>
        `;

        // el fondo
        const bg = shadow.querySelector(".slide-bg");
        bg.style.backgroundImage = `url('${imagenActual}')`;
    }

    #agregarEventos(shadow) {
        const btnLeft = shadow.querySelector(".left-btn");
        const btnRight = shadow.querySelector(".right-btn");
        const slideImg = shadow.querySelector(".slide-img"); // imagen central

        // redirección del eventO
        slideImg.addEventListener("click", () => {
            const eventoActual = this.imagenes[this.index];
            // manualmente
            window.location.href = `/pages/Evento/event-profile.html?id=${eventoActual.id}`;
        });

        btnLeft.addEventListener("click", () => {
            this.index = (this.index - 1 + this.imagenes.length) % this.imagenes.length;
            this.#actualizarImagen(shadow);
        });

        btnRight.addEventListener("click", () => {
            this.index = (this.index + 1) % this.imagenes.length;
            this.#actualizarImagen(shadow);
        });
    }

    #actualizarImagen(shadow) {
        const img = shadow.querySelector(".slide-img");
        const bg = shadow.querySelector(".slide-bg");

        const dataActual = this.imagenes[this.index];

        img.classList.add("fade-out");
        bg.classList.add("bg-fade-out");

        setTimeout(() => {
            img.src = dataActual.src;
            bg.style.backgroundImage = `url('${dataActual.src}')`;

            img.classList.remove("fade-out");
            bg.classList.remove("bg-fade-out");

        }, 300); // tiempo del efecto
    }

    #agregarEstilos(shadow) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        const rutaCSS = new URL('./carousel.css', import.meta.url).href;
        link.href = rutaCSS;
        shadow.appendChild(link);
    }
}