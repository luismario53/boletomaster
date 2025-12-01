import { HeaderComponent } from "../../components/header/header.js";
import { FooterComponent } from "../../components/footer/footer.js";

window.customElements.define('header-info', HeaderComponent);
window.customElements.define('footer-info', FooterComponent);

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log("Intentando login con:", email);

    // ==========================================
    // 🚧 MOCK LOGIN (Sustituir por Fetch)
    // ==========================================
    
    // Simulamos una espera
    const btn = document.querySelector('.btn-auth');
    const originalText = btn.innerText;
    btn.innerText = "VERIFICANDO...";
    btn.disabled = true;

    await new Promise(r => setTimeout(r, 1000));

    // Validación fake
    if (email.includes('@')) {
        alert("Login Exitoso (Simulado). Redirigiendo...");
        // Guardaríamos el token aquí: localStorage.setItem('token', '12345');
        window.location.href = "/pages/Principal/principal.html";
    } else {
        alert("Error: Credenciales inválidas");
        btn.innerText = originalText;
        btn.disabled = false;
    }
});