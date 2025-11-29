export class LanzamientoComponent extends HTMLElement {
    // tarjeta abierta 
    static tarjetaActiva = null;

    constructor() {
        super();
        this.isExpanded = false;
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });

        this.imagen = this.getAttribute("imagen") || "/assets/default.jpg";
        this.titulo = this.getAttribute("titulo") || "Título";
        this.artista = this.getAttribute("artista") || "Artista";
        
        this.linkSpotify = this.getAttribute("spotify-link");
        this.iconSpotify = this.getAttribute("icon-spotify");
        this.linkApple = this.getAttribute("apple-link");
        this.iconApple = this.getAttribute("icon-apple");
        this.linkYoutube = this.getAttribute("youtube-link");
        this.iconYoutube = this.getAttribute("icon-youtube");
        this.linkSoundCloud = this.getAttribute("soundcloud-link");
        this.iconSoundCloud = this.getAttribute("icon-soundcloud");

        this.#render(shadow);
        this.#agregarEstilos(shadow);
        this.#addInteractivity(shadow);
    }

    colapsar() {
        if (this.isExpanded) {
            this.isExpanded = false;
            const card = this.shadowRoot.querySelector('.card');
            if (card) {
                card.classList.remove('expanded');
            }
        }
    }

    #addInteractivity(shadow) {
        const cardElement = shadow.querySelector('.card');
        const platformLinks = shadow.querySelectorAll('.platform-link');

        cardElement.addEventListener('click', () => {
            if (this.isExpanded) {
                // cerrar si ya estaba abierta
                this.colapsar();
                LanzamientoComponent.tarjetaActiva = null;
            } else {
                
                
                // cerramos la otra
                if (LanzamientoComponent.tarjetaActiva && LanzamientoComponent.tarjetaActiva !== this) {
                    LanzamientoComponent.tarjetaActiva.colapsar();
                }

                // abrimos esta
                this.isExpanded = true;
                cardElement.classList.add('expanded');
                
                // activa
                LanzamientoComponent.tarjetaActiva = this;
            }
        });

        platformLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.stopPropagation(); 
            });
        });
    }

    #render(shadow) {
        const renderIcon = (link, iconPath, name) => {
            if (link && iconPath) {
                return `<a href="${link}" target="_blank" class="platform-link">
                            <img src="${iconPath}" alt="${name}">
                        </a>`;
            }
            return '';
        };

        shadow.innerHTML = `
            <div class="card">
                <div class="info-section">
                    <img class="cover" src="${this.imagen}" alt="${this.titulo}">
                    <div class="text-data">
                        <h3>${this.titulo}</h3>
                        <p>${this.artista}</p>
                    </div>
                </div>
                
                <div class="platforms-section">
                    <h4>ESCUCHALA EN:</h4>
                    <div class="icons-grid">
                        ${renderIcon(this.linkSpotify, this.iconSpotify, 'Spotify')}
                        ${renderIcon(this.linkApple, this.iconApple, 'Apple Music')}
                        ${renderIcon(this.linkYoutube, this.iconYoutube, 'YouTube')}
                        ${renderIcon(this.linkSoundCloud, this.iconSoundCloud, 'SoundCloud')}
                    </div>
                </div>
            </div>
        `;
    }

    #agregarEstilos(shadow) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/components/lanzamientos/lanzamiento.css";
        shadow.appendChild(link);
    }
}