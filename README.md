# R-TAM - Real-Time Access Monitoring System

**R-TAM** es un sistema de monitoreo y control de acceso en tiempo real diseñado para gestionar de forma eficiente el ingreso de usuarios a instalaciones, con roles diferenciados, autenticación segura y control de sesiones.

---

## 🚀 Tecnologías utilizadas

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js + Express
- **Base de datos:** PostgreSQL
- **Autenticación:** bcryptjs + express-session
- **Almacenamiento de sesiones:** connect-pg-simple (PostgreSQL)
- **Deploy:** [Render](https://render.com)

---

## 📁 Estructura del Proyecto

📦 r-tam/ ┣ 📂 backend/ ┃ ┣ 📜 server.js ┃ ┣ 📂 config/ ┃ ┃ ┗ 📜 db.js ┃ ┣ 📂 routes/ ┃ ┃ ┗ 📜 userRoutes.js ┗ 📂 frontend/ ┣ 📜 index.html ┣ 📜 login.html ┣ 📜 dashboard.html ┣ 📜 registro.html ┗ 📂 assets/ ┣ 📂 css/ ┣ 📂 js/ ┣ 📂 images/ ┗ 📂 dashboard/


## 🌐 URLs del proyecto
Frontend: https://r-tam.onrender.com

Backend API: https://r-tam.onrender.com/api

## 🔐 Funcionalidades
Registro de nuevos usuarios con validaciones.

Inicio de sesión y redirección por rol.

Protección de rutas (por sesión activa).

Cierre de sesión con eliminación de cookies.

Notificaciones pasivas de errores y estados.

## 🛠️ Autor y contacto
Desarrollado por los siguientes parnedices del SENA para el programa tecnológico Análisis y Desarrollo de Software: <br>
- Edwin Ramírez Sosa
- Jesús David Eslava
- Jhon Edward Lucumi Collazos
- Luis Angel Motta Valero
