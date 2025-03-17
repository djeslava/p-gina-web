document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formulario-login");

    if (!form) {
        console.error("Error: No se encontró el formulario de login.");
        return;
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita el envío predeterminado del formulario

        const dniInput = document.getElementById("dni");
        const contrasenaInput = document.getElementById("contraseña");
        const contrasenaHelp = document.getElementById("contrasena-help"); // Mensaje de ayuda

        if (!dniInput || !contrasenaInput) {
            console.error("Error: No se encontraron los campos DNI o contraseña.");
            return;
        }

        const dni = dniInput.value.trim();
        const contraseña = contrasenaInput.value.trim();

        // Verificar si los campos están vacíos
        if (!dni || !contraseña) {
            mostrarNotificacion("Todos los campos son obligatorios", "warning");
            return;
        }

        // Validar que la contraseña tenga al menos 8 caracteres
        if (contraseña.length < 8) {
            contrasenaHelp.textContent = "⚠️ Mínimo 8 caracteres.";
            contrasenaHelp.style.color = "red";
            contrasenaInput.style.border = "2px solid red";
            return;
        } else {
            contrasenaHelp.textContent = ""; // Restablecer el texto de ayuda
            contrasenaHelp.style.color = ""; // Restablecer el color del texto
            contrasenaInput.style.border = ""; // Restablecer el borde del campo
        }

        console.log("Datos enviados al backend:", { dni, contraseña });

        try {
            const response = await fetch("http://localhost:3000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dni, contraseña })
            });

            const result = await response.json();
            console.log("Respuesta del servidor:", result);

            if (response.ok) {
                mostrarNotificacion("Inicio de sesión exitoso. Espera...", "success");
                setTimeout(() => {
                    window.location.href = "dashboard.html"; // Redirigir tras 2 segundos
                }, 2000);
            } else {
                mostrarNotificacion(result.error || "Error inesperado", "error");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            mostrarNotificacion("Error de conexión con el servidor", "error");
        }
    });
});

// **Función para mostrar notificaciones emergentes**
function mostrarNotificacion(mensaje, tipo) {
    const notificacion = document.createElement("div");
    notificacion.className = `notificacion ${tipo}`;
    notificacion.textContent = mensaje;
    
    // Agregar la notificación al contenedor (si no existe, se crea)
    let contenedorNotificaciones = document.getElementById("contenedor-notificaciones");
    if (!contenedorNotificaciones) {
        contenedorNotificaciones = document.createElement("div");
        contenedorNotificaciones.id = "contenedor-notificaciones";
        document.body.appendChild(contenedorNotificaciones);
    }

    contenedorNotificaciones.appendChild(notificacion);

    // Eliminar la notificación después de 3 segundos
    setTimeout(() => {
        notificacion.remove();
    }, 3000); // La notificación desaparece después de 3 segundos
}