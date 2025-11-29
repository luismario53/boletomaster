export class CarouselComponent extends HTMLElement {

    constructor() {
        super();
        this.imagenes = [
            "/assets/eventos/evento1.png",
            "/assets/eventos/evento2.png"
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
        shadow.innerHTML += `
            <section class="eventos-carousel">

                <!-- Fondo Difuminado -->
                <div class="slide-bg"></div>

                <!-- Botón Izquierdo -->
                <button class="carousel-btn left-btn">
                    <img src="/assets/icons/arrow_left.png" alt="Anterior">
                </button>

                <!-- Contenedor Principal -->
                <div class="carousel-slide">
                    <div class="slides-container">
                        <img src="/assets/eventos/evento1.png" class="slide-img" alt="Evento 1">
                    </div>

                    <div class="slide-bg"></div>
                </div>

                <!-- Botón Derecho -->
                <button class="carousel-btn right-btn">
                    <img src="/assets/icons/arrow_right.png" alt="Siguiente">
                </button>

            </section>
        `;

        this.#actualizarImagen(shadow);
    }

    #agregarEventos(shadow) {
        const btnLeft = shadow.querySelector(".left-btn");
        const btnRight = shadow.querySelector(".right-btn");

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

    // fade out
    img.classList.add("fade-out");
    bg.classList.add("bg-fade-out");

    setTimeout(() => {
        // cambiar imagen
        img.src = this.imagenes[this.index];
        bg.style.backgroundImage = `url('${this.imagenes[this.index]}')`;

        // fade in
        img.classList.remove("fade-out");
        bg.classList.remove("bg-fade-out");

    }, 300); // tiempo del efecto
}

    #agregarEstilos(shadow) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/components/carousel/carousel.css";
        shadow.appendChild(link);
    }
}
