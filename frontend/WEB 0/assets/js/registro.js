document.getElementById('formulario-registro').addEventListener('submit', async (e) => {
    e.preventDefault();

    const DNI = document.getElementById('dni').value;
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const contraseña = document.getElementById('contrasena').value;
    const cargo = document.getElementById('cargo').value;

    const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ DNI, nombre, email, contraseña, cargo })
    });

    const data = await response.json();
    alert(data.message || data.error);
});
