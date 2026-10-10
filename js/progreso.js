document.addEventListener('DOMContentLoaded', () => {
    const readProgress = (key) => {
        try {
            return JSON.parse(localStorage.getItem(key)) || {};
        } catch (error) {
            return {};
        }
    };

    // Resultados de los tres cuestionarios
    const cuadricas = readProgress('vectorizaProgress');
    const conicas = readProgress('vectorizaConicasProgress');
    const curvas = readProgress('vectorizaCurvasProgress');

    const lessons = [
        {
            name: 'Cuádricas',
            attempts: cuadricas.attempts || 0,
            correctAnswers: cuadricas.correctAnswers || 0
        },
        {
            name: 'Cónicas',
            attempts: conicas.attempts || 0,
            correctAnswers: conicas.correctAnswers || 0
        },
        {
            name: 'Curvas de nivel',
            attempts: curvas.attempts || 0,
            correctAnswers: curvas.correctAnswers || 0
        }
    ];

    // Consideramos iniciado un tema cuando se responde su cuestionario
    const completed = lessons.filter((lesson) => lesson.attempts > 0).length;
    const attempts = lessons.reduce((total, lesson) => total + lesson.attempts, 0);
    const correct = lessons.reduce((total, lesson) => total + lesson.correctAnswers, 0);
    const percentage = Math.round((completed / lessons.length) * 100);

    const completedElement = document.querySelector('#completed-count');
    const attemptsElement = document.querySelector('#attempt-count');
    const correctElement = document.querySelector('#correct-count');
    const progressFill = document.querySelector('#lesson-progress-fill');
    const progressText = document.querySelector('#lesson-progress-text');

    if (completedElement) completedElement.textContent = completed;
    if (attemptsElement) attemptsElement.textContent = attempts;
    if (correctElement) correctElement.textContent = correct;

    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
        progressFill.setAttribute('aria-valuenow', percentage);
    }

    if (progressText) {
        progressText.textContent = `${completed} de ${lessons.length} temas iniciados (${percentage} %)`;
    }

    // Mostrar el detalle de cada tema si existe el contenedor
    const detail = document.querySelector('#progress-details');

    if (detail) {
        detail.replaceChildren();

        lessons.forEach((lesson) => {
            const item = document.createElement('div');
            item.className = 'progress-detail-item';

            const title = document.createElement('h3');
            title.textContent = lesson.name;

            const description = document.createElement('p');
            description.textContent = lesson.attempts > 0
                ? `Intentos: ${lesson.attempts} · Respuestas correctas: ${lesson.correctAnswers}`
                : 'Todavía no has respondido el cuestionario.';

            item.append(title, description);
            detail.appendChild(item);
        });
    }
});
