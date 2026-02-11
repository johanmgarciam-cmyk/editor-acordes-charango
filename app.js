// Esperamos a que todo el DOM cargue
document.addEventListener('DOMContentLoaded', () => {
    const boton = document.getElementById('miBoton');

    boton.addEventListener('click', () => {
        alert('¡Funciona! 🎉');
        console.log('El botón fue presionado.');
    });
});
