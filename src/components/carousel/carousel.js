export class CarouselComponent extends HTMLElement {

    constructor() {
        super();
        this.imagenes = []; 
        this.index = 0;
    }

    // Observamos el atributo 'filtro-artista'
    static get observedAttributes() {
        return ['filtro-artista'];
    }

    connectedCallback() {
        const shadow = this.attachShadow({mode: 'open'});
        this.#agregarEstilos(shadow);
        
        // Obtenemos el atributo si existe
        const artistaId = this.getAttribute('filtro-artista');
        this.#cargarEventos(shadow, artistaId);
    }
    
    // Si el atributo cambia dinámicamente
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'filtro-artista' && oldValue !== newValue) {
            const shadow = this.shadowRoot;
            if(shadow) {
                // Limpiar y recargar
                this.imagenes = [];
                const container = shadow.querySelector('.eventos-carousel');
                if(container) container.remove(); 
                
                this.#cargarEventos(shadow, newValue);
            }
        }
    }

    async #cargarEventos(shadow, artistaId = null) {
        try {
            // Lógica de URL Inteligente
            let url = 'http://localhost:5000/api/eventos';
            
            if (artistaId) {
                console.log("🎡 Carousel filtrando por artista:", artistaId);
                url = `http://localhost:5000/api/eventos/artista/${artistaId}`;
            }

            const response = await fetch(url);
            const data = await response.json();

            if (data.length > 0) {
                this.imagenes = data.map(evento => {
                    let rawSrc = (evento.imagenes && evento.imagenes.length > 0) 
                                 ? evento.imagenes[0] 
                                 : '/assets/eventos/evento1.png';

                    let cleanSrc = rawSrc.replace(/\\/g, '/');
                    if (!cleanSrc.startsWith('/') && !cleanSrc.startsWith('http')) {
                        cleanSrc = '/' + cleanSrc;
                    }

                    return { id: evento._id, src: cleanSrc };
                });

                this.#render(shadow);
                this.#agregarEventos(shadow);
            } else {
                // Mensaje diferente según si es filtro o no
                const msg = artistaId 
                    ? 'Este artista no tiene próximos eventos.' 
                    : 'No hay eventos destacados.';
                shadow.innerHTML = `<div style="height:300px; display:flex; justify-content:center; align-items:center; color:#888;">${msg}</div>`;
            }

        } catch (error) {
            console.error("Error cargando carousel:", error);
        }
    }

    // ... #render, #agregarEventos, #actualizarImagen, #agregarEstilos SE QUEDAN IGUAL ...
    // (Copia el resto de tu archivo carousel.js original aquí abajo)
    #render(shadow) {
        if (this.imagenes.length === 0) return;
        const imagenActual = this.imagenes[0].src;
        shadow.innerHTML += `
            <section class="eventos-carousel">
                <div class="slide-bg"></div>
                <button class="carousel-btn left-btn"><img src="/assets/icons/arrow_left.png"></button>
                <div class="carousel-slide">
                    <div class="slides-container"><img src="${imagenActual}" class="slide-img"></div>
                    <div class="slide-bg-overlay"></div>
                </div>
                <button class="carousel-btn right-btn"><img src="/assets/icons/arrow_right.png"></button>
            </section>
        `;
        const bg = shadow.querySelector(".slide-bg");
        if(bg) bg.style.backgroundImage = `url('${imagenActual}')`;
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
        img.classList.add("fade-out");
        bg.classList.add("bg-fade-out");
        setTimeout(() => {
            img.src = dataActual.src;
            bg.style.backgroundImage = `url('${dataActual.src}')`;
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