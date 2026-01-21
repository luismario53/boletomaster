export class YoutubeLatestComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        this.channelId = this.getAttribute('channel-id');
        if(!this.channelId) {
            console.error("el channel-id");
            return;
        }
        this.#agregarEstilos(shadow);
        this.#fetchLatestVideo(shadow);
    }

    async #fetchLatestVideo(shadow) {
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${this.channelId}`;
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

        try {
            const loader = document.createElement('div');
            loader.className = 'loading';
            loader.textContent = 'Buscando último video...';
            shadow.appendChild(loader);
            
            const response = await fetch(apiUrl);
            const data = await response.json();

            loader.remove();

            if (data.items && data.items.length > 0) {
                const latestVideo = data.items[0];
                const videoId = this.#extractVideoId(latestVideo.link);
                this.#render(shadow, videoId, latestVideo.title);
            } else {
                shadow.innerHTML += `<p class="loading">No se encontraron videos recientes.</p>`;
            }

        } catch (error) {
            console.error("Error al obtener video:", error);
            shadow.innerHTML += `<p class="error-msg">No se pudo cargar el video.</p>`;
        }
    }

    #extractVideoId(url) {
    // Handles standard, short (youtu.be), and embed links
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : null;
}

    #render(shadow, videoId, title) {
        const container = document.createElement('div');
        container.className = 'video-container';
        
        container.innerHTML = `
            <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/${videoId}" 
                title="${title}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
        
        shadow.appendChild(container);
    }

    #agregarEstilos(shadow) {
        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', '/components/youtube/youtube-latest.css');
        shadow.appendChild(link);
    }
}