import { HeaderComponent } from "../../components/header/header.js";
import { FooterComponent } from "../../components/footer/footer.js";

window.customElements.define('header-info', HeaderComponent);
window.customElements.define('footer-info', FooterComponent);

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.querySelector('.btn-auth');
    btn.innerText = "REGISTRANDO...";
    btn.disabled = true;

    // Recopilar datos del formulario
    const datos = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        password: document.getElementById('password').value,
        
        // 🔒 IMPORTANTE: Aquí forzamos que siempre sea CLIENTE
        tipoUsuario: "CLIENTE",
        
        // Mongo pone la fecha solo, pero por si acaso en el mock:
        createdAt: new Date()
    };

    console.log("Enviando datos de NUEVO CLIENTE:", datos);

    // ==========================================
    // 🚧 MOCK REGISTER (Simulación)
    // ==========================================
    
    await new Promise(r => setTimeout(r, 1500)); // Simular espera de red

    // Aquí iría: await fetch('/api/usuarios/registro', { method: 'POST', body: ... })

    alert(`¡Bienvenido, ${datos.nombre}! Tu cuenta ha sido creada.`);
    window.location.href = "/pages/Login/login.html";
});