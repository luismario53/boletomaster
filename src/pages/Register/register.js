import { HeaderComponent } from "../../components/header/header.js";
import { FooterComponent } from "../../components/footer/footer.js";

window.customElements.define('header-info', HeaderComponent);
window.customElements.define('footer-info', FooterComponent);

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.querySelector('.btn-auth');
    const originalText = btn.innerText;
    btn.innerText = "REGISTRANDO...";
    btn.disabled = true;

    // Recopilar datos
    const datos = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        password: document.getElementById('password').value,
        tipoUsuario: "CLIENTE" // Por defecto en registro público
    };

    try {
        // CONEXIÓN REAL AL BACKEND (Puerto 5000)
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        const data = await response.json();

        if (response.ok) {
            alert(`¡Cuenta creada! Bienvenido, ${datos.nombre}. Ahora inicia sesión.`);
            window.location.href = "/pages/Login/login.html";
        } else {
            // Error del backend (ej: correo duplicado)
            alert(data.message || "Error al registrar");
            btn.innerText = originalText;
            btn.disabled = false;
        }

    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo conectar con el servidor.");
        btn.innerText = originalText;
        btn.disabled = false;
    }
});