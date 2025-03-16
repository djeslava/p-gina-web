// document.getElementById("formulario-login").addEventListener("submit", async function(event) {
//     event.preventDefault();

//     const dni = document.getElementById("DNI").value.trim();
//     const contraseña = document.getElementById("contrasena").value.trim();

//     if (!dni || !contraseña) {
//         mostrarNotificacion("⚠ Todos los campos son obligatorios", "error");
//         return;
//     }

//     try {
//         const response = await fetch("http://localhost:3000/api/login", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ DNI: dni, contraseña })
//         });

//         const result = await response.json();

//         if (response.ok) {
//             mostrarNotificacion("✅ Inicio de sesión exitoso. Redirigiendo...", "success");
            
//             // Guardar el usuario en localStorage
//             localStorage.setItem("usuario", JSON.stringify(result.usuario));

//             setTimeout(() => {
//                 // Redirigir según el cargo
//                 switch (result.usuario.cargo) {
//                     case "Administrador":
//                         window.location.href = "dashboard_admin.html";
//                         break;
//                     case "Supervisor":
//                         window.location.href = "dashboard_supervisor.html";
//                         break;
//                     default:
//                         window.location.href = "dashboard.html"; // Página general
//                         break;
//                 }
//             }, 3000);
//         } else {
//             mostrarNotificacion(result.error, "error");
//         }

//     } catch (error) {
//         mostrarNotificacion("⚠ Error inesperado en el servidor", "error");
//     }
// });

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formulario-login");

    if (!form) {
        console.error("Error: No se encontró el formulario de login.");
        return;
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const dniInput = document.getElementById("dni");
        const contrasenaInput = document.getElementById("contraseña");

        if (!dniInput || !contrasenaInput) {
            console.error("Error: No se encontraron los campos DNI o contraseña.");
            return;
        }

        const dni = dniInput.value.trim();
        const contraseña = contrasenaInput.value.trim();

        if (!dni || !contraseña) {
            mostrarNotificacion("Todos los campos son obligatorios", "error");
            return;
        }

        // const formData = new FormData(this);
        // const data = Object.fromEntries(formData.entries());

        console.log("Datos enviados al backend:", { dni, contraseña }); // 👈 Agregar esta línea

        try {
            const response = await fetch("http://localhost:3000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dni, contraseña })
            });

            const result = await response.json();
            console.log("Respuesta del servidor:", result);

            if (response.ok) {
                mostrarNotificacion("Inicio de sesión exitoso", "success");
                setTimeout(() => {
                    window.location.href = "dashboard.html"; // Redirigir tras 3 segundos
                }, 3000);
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
    
    document.body.appendChild(notificacion);

    setTimeout(() => {
        notificacion.remove();
    }, 3000); // La notificación desaparece después de 3 segundos
}