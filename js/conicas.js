document.addEventListener('DOMContentLoaded', () => {
    const quiz = document.querySelector('#conic-quiz');
    if (!quiz) return;

    const options = quiz.querySelectorAll('.quiz-option');
    const feedback = quiz.querySelector('#conic-feedback');
    const check = quiz.querySelector('#conic-check');
    const reset = quiz.querySelector('#conic-reset');

    let selected = null;
    let answered = false;

    options.forEach((option) => {
        option.addEventListener('click', () => {
            if (answered) return;

            selected = option.dataset.answer;

            options.forEach((item) => item.classList.remove('selected'));
            option.classList.add('selected');

            feedback.textContent = 'Respuesta seleccionada. Ahora comprueba tu resultado.';
            feedback.className = 'quiz-feedback';
        });
    });

    check.addEventListener('click', () => {
        if (answered) return;

        if (!selected) {
            feedback.textContent = 'Selecciona una respuesta primero.';
            feedback.className = 'quiz-feedback error';
            return;
        }

        answered = true;
        const correct = selected === 'b';

        options.forEach((option) => {
            option.disabled = true;

            if (option.dataset.answer === 'b') {
                option.classList.add('correct');
            } else if (option.dataset.answer === selected) {
                option.classList.add('incorrect');
            }
        });

        if (correct) {
            feedback.textContent =
                '¡Correcto! La hipérbola tiene términos cuadrados con signos opuestos en su forma canónica.';
            feedback.className = 'quiz-feedback success';
        } else {
            feedback.textContent =
                'La respuesta correcta es B. La diferencia entre los términos cuadrados es una característica de la hipérbola en esta forma canónica.';
            feedback.className = 'quiz-feedback error';
        }

        try {
            const key = 'vectorizaConicasProgress';
            const progress = JSON.parse(localStorage.getItem(key)) || {
                attempts: 0,
                correctAnswers: 0
            };

            progress.attempts += 1;
            if (correct) progress.correctAnswers += 1;

            localStorage.setItem(key, JSON.stringify(progress));
        } catch (error) {
            console.warn('No fue posible guardar el progreso de cónicas.', error);
        }
    });

    reset.addEventListener('click', () => {
        selected = null;
        answered = false;

        options.forEach((option) => {
            option.disabled = false;
            option.classList.remove('selected', 'correct', 'incorrect');
        });

        feedback.textContent = 'Selecciona una respuesta.';
        feedback.className = 'quiz-feedback';
    });
});
