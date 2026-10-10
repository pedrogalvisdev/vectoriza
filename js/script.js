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

// Interacciones de la lección de superficies cuádricas.
document.addEventListener('DOMContentLoaded', () => {
    const quiz = document.querySelector('#quiz');

    if (!quiz) return;

    const options = quiz.querySelectorAll('.quiz-option');
    const feedback = quiz.querySelector('#quiz-feedback');
    const checkButton = quiz.querySelector('#check-answer');
    const resetButton = quiz.querySelector('#reset-quiz');

    let selectedAnswer = null;
    let answered = false;

    options.forEach((option) => {
        option.addEventListener('click', () => {
            if (answered) return;

            selectedAnswer = option.dataset.answer;

            options.forEach((item) => {
                item.classList.remove('selected');
            });

            option.classList.add('selected');
            feedback.textContent = 'Respuesta seleccionada. Pulsa "Comprobar respuesta".';
            feedback.className = 'quiz-feedback';
        });
    });

    checkButton.addEventListener('click', () => {
        if (!selectedAnswer) {
            feedback.textContent = 'Primero selecciona una respuesta.';
            feedback.className = 'quiz-feedback error';
            return;
        }

        answered = true;

        const correct = selectedAnswer === 'b';

        options.forEach((option) => {
            option.disabled = true;

            if (option.dataset.answer === 'b') {
                option.classList.add('correct');
            } else if (option.dataset.answer === selectedAnswer && !correct) {
                option.classList.add('incorrect');
            }
        });

        if (correct) {
            feedback.textContent =
                '¡Correcto! Es un elipsoide: los tres términos cuadrados tienen coeficientes positivos y la suma es igual a 1.';
            feedback.className = 'quiz-feedback success';
        } else {
            feedback.textContent =
                'Todavía no. La respuesta correcta es B, un elipsoide. Observa que los tres términos cuadrados son positivos y su suma es igual a 1.';
            feedback.className = 'quiz-feedback error';
        }
    });

    resetButton.addEventListener('click', () => {
        selectedAnswer = null;
        answered = false;

        options.forEach((option) => {
            option.disabled = false;
            option.classList.remove('selected', 'correct', 'incorrect');
        });

        feedback.textContent = 'Elige una opción para comprobar tu respuesta.';
        feedback.className = 'quiz-feedback';
    });
});

// Registro local del progreso académico.
document.addEventListener('DOMContentLoaded', () => {
    const storageKey = 'vectorizaProgress';

    function readProgress() {
        try {
            return JSON.parse(localStorage.getItem(storageKey)) || {
                completedLessons: [],
                attempts: 0,
                correctAnswers: 0
            };
        } catch {
            return {
                completedLessons: [],
                attempts: 0,
                correctAnswers: 0
            };
        }
    }

    function saveProgress(progress) {
        localStorage.setItem(storageKey, JSON.stringify(progress));
    }

    const quiz = document.querySelector('#quiz');

    if (quiz) {
        const checkButton = quiz.querySelector('#check-answer');
        const options = quiz.querySelectorAll('.quiz-option');

        checkButton.addEventListener('click', () => {
            const selected = quiz.querySelector('.quiz-option.selected');

            if (!selected || options[0].disabled) return;

            const progress = readProgress();
            progress.attempts += 1;

            if (selected.dataset.answer === 'b') {
                progress.correctAnswers += 1;
            }

            if (!progress.completedLessons.includes('cuadricas')) {
                progress.completedLessons.push('cuadricas');
            }

            saveProgress(progress);
        }, true);
    }

    // Mostrar las estadísticas en la página de progreso.
    const completedCount = document.querySelector('#completed-count');

    if (completedCount) {
        const progress = readProgress();
        const attempts = document.querySelector('#attempt-count');
        const correct = document.querySelector('#correct-count');
        const fill = document.querySelector('#lesson-progress-fill');
        const text = document.querySelector('#lesson-progress-text');

        completedCount.textContent = progress.completedLessons.length;
        attempts.textContent = progress.attempts;
        correct.textContent = progress.correctAnswers;

        const completed = progress.completedLessons.includes('cuadricas');
        fill.style.width = completed ? '100%' : '0%';
        text.textContent = completed
            ? 'Lección completada: ya respondiste el cuestionario al menos una vez.'
            : 'Todavía no has completado esta lección.';
    }
});
