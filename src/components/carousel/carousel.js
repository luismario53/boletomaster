export class CarouselComponent extends HTMLElement {

    constructor() {
        super();
        // CAMBIO 1: Ahora guardamos el ID junto con la ruta de la imagen
        // Asegúrate de que estos IDs (1, 2) coincidan con los de tu base de datos o script de eventos
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
        // Obtenemos la primera imagen para mostrar al inicio
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

        // Inicializamos el fondo
        const bg = shadow.querySelector(".slide-bg");
        bg.style.backgroundImage = `url('${imagenActual}')`;
    }

    #agregarEventos(shadow) {
        const btnLeft = shadow.querySelector(".left-btn");
        const btnRight = shadow.querySelector(".right-btn");
        const slideImg = shadow.querySelector(".slide-img"); // Seleccionamos la imagen central

        // CAMBIO 2: Lógica de redirección al hacer click en la imagen
        slideImg.addEventListener("click", () => {
            const eventoActual = this.imagenes[this.index];
            // Redirigimos manualmente
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

        // Datos actuales
        const dataActual = this.imagenes[this.index];

        // fade out
        img.classList.add("fade-out");
        bg.classList.add("bg-fade-out");

        setTimeout(() => {
            // CAMBIO 3: Usamos .src porque ahora es un objeto
            img.src = dataActual.src;
            bg.style.backgroundImage = `url('${dataActual.src}')`;

            // fade in
            img.classList.remove("fade-out");
            bg.classList.remove("bg-fade-out");

        }, 300); // tiempo del efecto
    }

    #agregarEstilos(shadow) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        // Aseguramos ruta correcta con import.meta.url por si acaso
        const rutaCSS = new URL('./carousel.css', import.meta.url).href;
        link.href = rutaCSS;
        shadow.appendChild(link);
    }
}