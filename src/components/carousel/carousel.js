export class CarouselComponent extends HTMLElement {

    constructor() {
        super();
        this.imagenes = []; 
        this.index = 0;
    }

    connectedCallback() {
        const shadow = this.attachShadow({mode: 'open'});
        this.#agregarEstilos(shadow);
        this.#cargarEventos(shadow);
    }

    async #cargarEventos(shadow) {
        try {
            const response = await fetch('http://localhost:5000/api/eventos');
            const data = await response.json();

            if (data.length > 0) {
                // MAPEO Y LIMPIEZA DE DATOS
                this.imagenes = data.map(evento => {
                    // 1. Obtener la ruta cruda
                    let rawSrc = (evento.imagenes && evento.imagenes.length > 0) 
                                 ? evento.imagenes[0] 
                                 : '/src/assets/eventos/evento1.png';

                    // 2. CORRECCIÓN DE RUTAS (Sanitización)
                    // Reemplazar todas las barras invertidas '\' por normales '/'
                    let cleanSrc = rawSrc.replace(/\\/g, '/');
                    
                    // Asegurar que empiece con '/' para que sea ruta absoluta
                    // (Evita que se concatene con /pages/Principal/...)
                    if (!cleanSrc.startsWith('/') && !cleanSrc.startsWith('http')) {
                        cleanSrc = '/' + cleanSrc;
                    }

                    return {
                        id: evento._id, 
                        src: cleanSrc
                    };
                });

                this.#render(shadow);
                this.#agregarEventos(shadow);
            } else {
                shadow.innerHTML = '<div style="height:430px; display:flex; justify-content:center; align-items:center; color:white;">No hay eventos destacados</div>';
            }

        } catch (error) {
            console.error("Error cargando carousel:", error);
            shadow.innerHTML = '<div style="height:430px; display:flex; justify-content:center; align-items:center; color:white;">Error al cargar eventos</div>';
        }
    }

    #render(shadow) {
        if (this.imagenes.length === 0) return;

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
                    <div class="slide-bg-overlay"></div>
                </div>

                <button class="carousel-btn right-btn">
                    <img src="/assets/icons/arrow_right.png" alt="Siguiente">
                </button>
            </section>
        `;

        // Aplicar imagen al fondo difuminado
        const bg = shadow.querySelector(".slide-bg");
        if(bg) {
            bg.style.backgroundImage = `url('${imagenActual}')`;
        }
    }

    #agregarEventos(shadow) {
        const btnLeft = shadow.querySelector(".left-btn");
        const btnRight = shadow.querySelector(".right-btn");
        const slideImg = shadow.querySelector(".slide-img");

        if (!btnLeft || !btnRight || !slideImg) return;

        slideImg.addEventListener("click", () => {
            const eventoActual = this.imagenes[this.index];
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

        if (!img || !bg) return;

        const dataActual = this.imagenes[this.index];

        // Fade Out
        img.classList.add("fade-out");
        bg.classList.add("bg-fade-out");

        setTimeout(() => {
            // Cambiar URLs
            img.src = dataActual.src;
            bg.style.backgroundImage = `url('${dataActual.src}')`;

            // Fade In
            img.classList.remove("fade-out");
            bg.classList.remove("bg-fade-out");

        }, 300); 
    }

    #agregarEstilos(shadow) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        const rutaCSS = new URL('./carousel.css', import.meta.url).href;
        link.href = rutaCSS;
        shadow.appendChild(link);
    }
}