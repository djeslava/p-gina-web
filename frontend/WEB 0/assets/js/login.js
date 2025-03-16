document.getElementById("formulario-login").addEventListener("submit", async function(event) {
    event.preventDefault();

    const dni = document.getElementById("dni").value.trim();
    const contraseña = document.getElementById("contrasena").value.trim();

    if (!dni || !contraseña) {
        mostrarNotificacion("⚠ Todos los campos son obligatorios", "error");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ DNI: dni, contraseña })
        });

        const result = await response.json();

        if (response.ok) {
            mostrarNotificacion("✅ Inicio de sesión exitoso. Redirigiendo...", "success");
            
            // Guardar el usuario en localStorage
            localStorage.setItem("usuario", JSON.stringify(result.usuario));

            setTimeout(() => {
                // Redirigir según el cargo
                switch (result.usuario.cargo) {
                    case "Administrador":
                        window.location.href = "dashboard_admin.html";
                        break;
                    case "Supervisor":
                        window.location.href = "dashboard_supervisor.html";
                        break;
                    default:
                        window.location.href = "dashboard.html"; // Página general
                        break;
                }
            }, 3000);
        } else {
            mostrarNotificacion(result.error, "error");
        }

    } catch (error) {
        mostrarNotificacion("⚠ Error inesperado en el servidor", "error");
    }
});

