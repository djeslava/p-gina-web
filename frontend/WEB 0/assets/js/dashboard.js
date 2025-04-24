// PENDIENTE: CORREGIR LA VERIFICACIÓN DE SESIÓN

// Verificar la sesión del usuario al cargar la página
const BACKEND_URL = "https://r-tam.onrender.com";

document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch(`${BACKEND_URL}/api/verificar-sesion`, {
            method: "GET",
            credentials: "include", // Importante para enviar la cookie de sesión
        });

        const result = await response.json();
        console.log("Estado de sesión:", result);

        if (!response.ok || !result.autenticado) {
            // document.body.innerHTML = ""; // Evita mostrar el contenido de dashboard            
            // mostrarNotificacion("Acceso denegado. Inicia sesión primero.", "error");
            window.location.href = "index.html"; // Redirigir al login

        } else {
            mostrarNotificacion(`Bienvenido, ${result.usuario}.`, "success");
        }

    } catch (error) {
        console.error("Error al verificar sesión:", error);
        mostrarNotificacion("Error al validar la sesión.", "error");
        setTimeout(() => {
            window.location.href = "index.html";
        }, 150000);
    }
});

// Cerrar sesión
document.querySelector(".logout").addEventListener("click", async function (event) {
    event.preventDefault(); // Evitar que el enlace actúe como un link normal

    try {
        const response = await fetch("/api/logout", {
            method: "POST",
            credentials: "include", // Para que se envíen cookies de sesión
            headers: { "Content-Type": "application/json" }
        });

        const result = await response.json();
        console.log("Respuesta del servidor:", result);

        if (response.ok) {
            mostrarNotificacion("Sesión cerrada correctamente.", "success");

            setTimeout(() => {
                window.location.href = "index.html"; // Redirigir después de 2 segundos
            }, 150000);
        } else {
            mostrarNotificacion(result.error || "Error al cerrar sesión.", "error");
        }

    } catch (error) {
        console.error("❌ Error en la solicitud de cierre de sesión:", error);
        mostrarNotificacion("Error de conexión con el servidor.", "error");
    }
});

// Función para mostrar notificaciones emergentes
function mostrarNotificacion(mensaje, tipo) {
    const notificacion = document.createElement("div");
    notificacion.className = `notificacion ${tipo}`;
    notificacion.textContent = mensaje;

    document.body.appendChild(notificacion);

    setTimeout(() => {
        notificacion.remove();
    }, 2000); // La notificación desaparece después de 2 segundos
}
