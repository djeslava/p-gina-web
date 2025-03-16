document.getElementById("formulario-registro").addEventListener("submit", async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());    

    // Validación en frontend antes de enviar la solicitud al backend
    if (!data.DNI || !data.nombre || !data.email || !data.contraseña || !data["confirmar-contrasena"] || !data.cargo) {
        mostrarNotificacion("Faltan campos por completar.", "warning");
        return;
    }

    if (data.contraseña !== data["confirmar-contrasena"]) {
        mostrarNotificacion("Las contraseñas no coinciden.", "error");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/registro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            mostrarNotificacion("Usuario registrado exitosamente. Espera...", "success");
            setTimeout(() => {
                window.location.href = "index.html"; // Redirigir tras 2 segundos
            }, 2000);
        } else if (response.status === 409) {  
            mostrarNotificacion("El usuario ya está registrado.", "error");
        } else {
            mostrarNotificacion(result.error || "Error inesperado en el servidor.", "error");
        }
    } catch (error) {
        mostrarNotificacion("Error inesperado en el servidor.", "error");
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


