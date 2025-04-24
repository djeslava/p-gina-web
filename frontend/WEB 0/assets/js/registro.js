document.getElementById("formulario-registro").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    // Obtener los valores de contraseña
    const passwordField = document.getElementById("contrasena");
    const confirmPasswordField = document.getElementById("confirmar-contrasena");
    const password = data.contraseña;
    const confirmPassword = data["confirmar-contrasena"];

    // Obtener el elemento para mostrar errores de la contraseña
    const passwordHelp = document.getElementById("contrasena-help");

    // Validación en frontend antes de enviar la solicitud al backend
    if (!data.DNI || !data.nombre || !data.email || !data.contraseña || !data["confirmar-contrasena"] || !data.cargo) {
        mostrarNotificacion("Faltan campos por completar.", "warning");
        return;
    }

    // Verificar que la contraseña tenga al menos 8 caracteres
    if (password.length < 8) {
        passwordHelp.textContent = "⚠️ Mínimo 8 caracteres, incluyendo una letra y un número.";
        passwordHelp.style.color = "red";
        return; // Detener el envío del formulario
    } else {
        passwordHelp.textContent = "✅ Contraseña válida.";
        passwordHelp.style.color = "green";
        passwordField.style.border = "2px solid green";
    }

    // Verificar si las contraseñas coinciden
    if (password !== confirmPassword) {
        confirmPasswordField.value = ""; // Limpiar el campo
        confirmPasswordField.placeholder = "⚠ Las contraseñas no coinciden";
        confirmPasswordField.style.border = "2px solid red";
        return;
    } else {
        confirmPasswordField.style.border = "2px solid green";
    }

    try {
        const response = await fetch("http://localhost:5432/api/registro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include" // Enviar cookies de sesión 
        });

        const result = await response.json();

        if (response.ok) {
            mostrarNotificacion("Usuario registrado exitosamente. Espera...", "success");
            setTimeout(() => {
                window.location.href = "index.html"; // Redirigir tras 2 segundos
            }, 2000);
        } else if (response.status === 409) {
            mostrarNotificacion("El usuario ya está registrado", "error");
        } else {
            mostrarNotificacion(result.error || "Error inesperado en el servidor", "error");
        }
    } catch (error) {
        mostrarNotificacion("Error inesperado en el servidor", "error");
    }
});

// **Función para mostrar notificaciones emergentes**
function mostrarNotificacion(mensaje, tipo) {
    const notificacion = document.createElement("div");
    notificacion.classList.add("notificacion", tipo);
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);

    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}


