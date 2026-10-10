document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    const topicStatus = document.querySelectorAll('.topic-status');

    // Actualizar el enlace activo del menú.
    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            navLinks.forEach((item) => item.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Informar al estudiante cuando un tema aún está en desarrollo.
    topicStatus.forEach((status) => {
        status.textContent = 'Próximamente';
        status.setAttribute('aria-label', 'Tema en construcción');
    });

    // Mensaje temporal para las tarjetas que aún no tienen contenido.
    document.querySelectorAll('.feature-card > a').forEach((link) => {
        link.addEventListener('click', (event) => {
            const destination = link.getAttribute('href');

            if (destination === '#temas') {
                event.preventDefault();
                document.querySelector('#temas').scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    console.log('Vectoriza se ha cargado correctamente.');
});
