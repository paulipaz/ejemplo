// Función que maneja la visualización de detalles de productos
function mostrarInfo(producto) {
    const infoArea = document.getElementById('infoDinamica');
    let contenido = '';

    // Lógica para decidir qué contenido mostrar
    if (producto === 'toldos') {
        contenido = '<strong>Detalles de Toldos:</strong> Ideales para exterior, nuestros toldos utilizan mecanismos manuales o motorizados y telas acrílicas o de PVC para máxima durabilidad y protección UV.';
        // Aplica clases CSS definidas en styles.css para dar estilo dinámico
        infoArea.classList.remove('card-cortina');
        infoArea.classList.add('card-toldo');
    } else if (producto === 'cortinas') {
        contenido = '<strong>Detalles de Cortinas Roller:</strong> Disponibles en sistemas Quantum® con opciones de automatización PowerView™, perfectas para cualquier ambiente interior.';
        // Aplica clases CSS definidas en styles.css para dar estilo dinámico
        infoArea.classList.remove('card-toldo');
        infoArea.classList.add('card-cortina');
    }

    infoArea.innerHTML = contenido;
    // Muestra el div que estaba inicialmente oculto en el HTML
    infoArea.style.display = 'block';

    // Desplazamiento suave hacia el área de información
    infoArea.scrollIntoView({ behavior: 'smooth' });
}
