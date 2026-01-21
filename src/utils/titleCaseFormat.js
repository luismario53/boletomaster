export function toTitleCase(texto) {
    const excepciones = ['de', 'del', 'la', 'las', 'el', 'los', 'y', 'e', 'o', 'u', 'a', 'en', 'con', 'por', 'para'];
    
    return texto
        .toLowerCase()
        .split(' ')
        .map((palabra, index) => {
            if (index === 0 || !excepciones.includes(palabra)) {
                return palabra.charAt(0).toUpperCase() + palabra.slice(1);
            }
            return palabra;
        })
        .join(' ');
}