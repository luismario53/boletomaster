import { HeaderComponent } from "../../components/header/header.js";
import { FooterComponent } from "../../components/footer/footer.js";

window.customElements.define('header-info', HeaderComponent);
window.customElements.define('footer-info', FooterComponent);

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.querySelector('.btn-auth');
    const originalText = btn.innerText
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

    // console.log("Enviando datos de NUEVO CLIENTE:", datos);
    console.log(datos)

    try {
        const response = await fetch("/api/usuarios", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(datos),
        })

        const data = await response.json()

        // ✅ Verificar si la respuesta fue exitosa
        if (!response.ok) {
            // El servidor devolvió 400, 401, 500, etc.
            console.error("Ocurrió un error inesperado:", data)
            alert(data.error || data.message || "Error al registrar usuario")

            btn.innerText = originalText
            btn.disabled = false
            return
        }

        alert(`¡Bienvenido, ${datos.nombre}! Tu cuenta ha sido creada.`);
        window.location.href = "/pages/Login/login.html"

    } catch (error) {
        btn.innerText = originalText
        btn.disabled = false
        console.error("Error de conexión:", error)
        alert("Error de conexión con el servidor")
    }
});