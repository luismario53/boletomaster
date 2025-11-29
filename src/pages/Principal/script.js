import { HeaderComponent } from "../../components/header/header.js";
import { CarouselComponent } from "../../components/carousel/carousel.js";
import { LanzamientoComponent } from "../../components/lanzamientos/lanzamiento.js";
import { FooterComponent } from "../../components/footer/footer.js";
import { YoutubeLatestComponent } from "../../components/youtube/youtube-latest.js";

window.customElements.define('footer-info', FooterComponent);
window.customElements.define('lanzamiento-card', LanzamientoComponent);
window.customElements.define('carousel-info', CarouselComponent);
window.customElements.define('header-info', HeaderComponent);
window.customElements.define('youtube-latest', YoutubeLatestComponent);