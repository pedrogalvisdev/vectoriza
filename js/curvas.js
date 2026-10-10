document.addEventListener('DOMContentLoaded', () => {
    const quiz = document.querySelector('#level-quiz');
    if (!quiz) return;

    const options = quiz.querySelectorAll('.quiz-option');
    const feedback = quiz.querySelector('#level-feedback');
    const checkButton = quiz.querySelector('#level-check');
    const resetButton = quiz.querySelector('#level-reset');

    let selected = null;
    let answered = false;

    options.forEach((option) => {
        option.addEventListener('click', () => {
            if (answered) return;

            options.forEach((item) => item.classList.remove('selected'));
            option.classList.add('selected');
            selected = option.dataset.answer;
            feedback.textContent = 'Respuesta seleccionada. Pulsa «Comprobar respuesta».';
            feedback.className = 'quiz-feedback';
        });
    });

    checkButton.addEventListener('click', () => {
        if (answered) return;

        if (!selected) {
            feedback.textContent = 'Primero selecciona una respuesta.';
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
            feedback.textContent = '¡Correcto! Al reemplazar k por 9, obtenemos x² + y² = 9, una circunferencia de radio 3.';
            feedback.className = 'quiz-feedback success';
        } else {
            feedback.textContent = 'No es esa. Recuerda reemplazar k por 9 en f(x,y) = x² + y².';
            feedback.className = 'quiz-feedback error';
        }

        try {
            const key = 'vectorizaCurvasProgress';
            const progress = JSON.parse(localStorage.getItem(key)) || {
                attempts: 0,
                correctAnswers: 0
            };

            progress.attempts += 1;
            if (correct) progress.correctAnswers += 1;

            localStorage.setItem(key, JSON.stringify(progress));
        } catch (error) {
            console.warn('No fue posible guardar el progreso de curvas de nivel.');
        }
    });

    resetButton.addEventListener('click', () => {
        selected = null;
        answered = false;

        options.forEach((option) => {
            option.disabled = false;
            option.classList.remove('selected', 'correct', 'incorrect');
        });

        feedback.textContent = 'Selecciona una respuesta y comprueba.';
        feedback.className = 'quiz-feedback';
    });
});
