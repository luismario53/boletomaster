import { HeaderComponent } from "../../components/header/header.js";
import { FooterComponent } from "../../components/footer/footer.js";

window.customElements.define('header-info', HeaderComponent);
window.customElements.define('footer-info', FooterComponent);

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const btn = document.querySelector('.btn-auth');
    const originalText = btn.innerText;
    btn.innerText = "VERIFICANDO...";
    btn.disabled = true;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })

        const data = await response.json()

        if (!response.ok) {
            alert(data.mensaje || data.error || "Credenciales inválidas")
            btn.innerText = originalText
            btn.disabled = false
            return
        }

        // Guardar tokens y usuario
        localStorage.setItem('token', data.token)
        localStorage.setItem('refreshToken', data.refreshToken)
        localStorage.setItem('usuario', JSON.stringify(data.usuario))

        alert(`¡Bienvenido ${data.usuario.nombre}!`)
        
        // Redirigir según tipo de usuario (opcional)
        window.location.href = "/pages/Principal/main.html"

    } catch (error) {
        console.error("Error de conexión:", error)
        alert("Error de conexión con el servidor")
        btn.innerText = originalText
        btn.disabled = false
    }
});