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
        // CORRECCIÓN 1: URL Absoluta al puerto 5000
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.mensaje || data.error || "Credenciales inválidas");
            btn.innerText = originalText;
            btn.disabled = false;
            return;
        }

        // Guardar tokens
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        
        // CORRECCIÓN 2: USAR LA LLAVE CORRECTA ('usuario_sonicolirio')
        // Esto es lo que lee tu Header y tu Perfil
        localStorage.setItem('usuario_sonicolirio', JSON.stringify(data.usuario));

        alert(`¡Bienvenido ${data.usuario.nombre}!`);
        
        // Redirigir al home (Asegúrate que la ruta sea correcta según tu estructura)
        window.location.href = "/pages/Principal/main.html";

    } catch (error) {
        console.error("Error de conexión:", error);
        alert("Error de conexión con el servidor (Asegúrate que el backend corre en el puerto 5000)");
        btn.innerText = originalText;
        btn.disabled = false;
    }
});