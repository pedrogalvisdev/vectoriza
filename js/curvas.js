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

// Gráfica interactiva de las curvas de nivel
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('#level-graph');
    const slider = document.querySelector('#level-k');

    if (!canvas || !slider) return;

    const context = canvas.getContext('2d');
    const valueLabel = document.querySelector('#level-k-value');
    const info = document.querySelector('#level-graph-info');

    function drawLevelCurve() {
        const k = Number(slider.value);
        const radius = Math.sqrt(k);

        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const scale = 17;

        context.clearRect(0, 0, width, height);

        // Fondo de la gráfica
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, width, height);

        // Cuadrícula
        context.strokeStyle = '#e7ebf2';
        context.lineWidth = 1;

        for (let x = centerX % scale; x < width; x += scale) {
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, height);
            context.stroke();
        }

        for (let y = centerY % scale; y < height; y += scale) {
            context.beginPath();
            context.moveTo(0, y);
            context.lineTo(width, y);
            context.stroke();
        }

        // Ejes coordenados
        context.strokeStyle = '#153866';
        context.lineWidth = 2;

        context.beginPath();
        context.moveTo(24, centerY);
        context.lineTo(width - 20, centerY);
        context.moveTo(centerX, 20);
        context.lineTo(centerX, height - 20);
        context.stroke();

        // Etiquetas de los ejes
        context.fillStyle = '#153866';
        context.font = '15px sans-serif';
        context.fillText('x', width - 18, centerY - 10);
        context.fillText('y', centerX + 10, 18);
        context.fillText('0', centerX + 7, centerY + 17);

        // Curva x² + y² = k
        context.beginPath();
        context.arc(centerX, centerY, radius * scale, 0, Math.PI * 2);
        context.strokeStyle = '#f2a30f';
        context.lineWidth = 4;
        context.stroke();

        // Marcar el radio sobre el eje x
        context.beginPath();
        context.moveTo(centerX, centerY);
        context.lineTo(centerX + radius * scale, centerY);
        context.strokeStyle = '#2b6cb0';
        context.lineWidth = 3;
        context.stroke();

        context.fillStyle = '#2b6cb0';
        context.beginPath();
        context.arc(centerX + radius * scale, centerY, 4, 0, Math.PI * 2);
        context.fill();

        valueLabel.textContent = `k = ${k}`;
        info.textContent = `Radio = √${k} ≈ ${radius.toFixed(2)} unidades. La curva contiene los puntos que cumplen x² + y² = ${k}.`;
    }

    slider.addEventListener('input', drawLevelCurve);
    drawLevelCurve();
});
