
document.addEventListener("DOMContentLoaded", () => {
    configurarCuestionarioConicas();
});

const CLAVE_PROGRESO_CONICAS = "vectorizaConicasProgress";

function obtenerProgresoConicas() {
    try {
        const datos = localStorage.getItem(CLAVE_PROGRESO_CONICAS);
        const progreso = datos ? JSON.parse(datos) : {};

        return {
            attempts: Number(progreso.attempts) || 0,
            correctAnswers: Number(progreso.correctAnswers) || 0
        };
    } catch (error) {
        console.error("Error al leer el progreso de cónicas:", error);

        return {
            attempts: 0,
            correctAnswers: 0
        };
    }
}

function guardarProgresoConicas(esCorrecta) {
    try {
        const progreso = obtenerProgresoConicas();

        progreso.attempts += 1;

        if (esCorrecta) {
            progreso.correctAnswers += 1;
        }

        localStorage.setItem(
            CLAVE_PROGRESO_CONICAS,
            JSON.stringify(progreso)
        );
    } catch (error) {
        console.error("Error al guardar el progreso de cónicas:", error);
    }
}

function configurarCuestionarioConicas() {
    const formulario = document.getElementById("conic-quiz");

    if (!formulario) {
        return;
    }

    const respuestaCorrecta = "b";
    const feedback = formulario.querySelector(
        "#feedback, .quiz-feedback, .feedback"
    );

    const botonComprobar = formulario.querySelector(
        'button[type="submit"], input[type="submit"]'
    );

    const botonReiniciar = formulario.querySelector(
        '[data-action="reset"], .reset-btn, .quiz-reset'
    );

    let respondido = false;

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        if (respondido) {
            return;
        }

        const seleccionada = formulario.querySelector(
            'input[name="answer"]:checked, ' +
            'input[name="respuesta"]:checked, ' +
            'input[name="quiz"]:checked'
        );

        if (!seleccionada) {
            if (feedback) {
                feedback.textContent = "Selecciona una respuesta antes de comprobar.";
                feedback.className = "quiz-feedback incorrect";
                feedback.setAttribute("role", "alert");
            }

            return;
        }

        const esCorrecta =
            seleccionada.value.trim().toLowerCase() === respuestaCorrecta;

        guardarProgresoConicas(esCorrecta);
        respondido = true;

        if (feedback) {
            feedback.textContent = esCorrecta
                ? "¡Correcto! Identificaste correctamente la cónica."
                : "Respuesta incorrecta. Revisa las formas canónicas de las cónicas.";

            feedback.className = esCorrecta
                ? "quiz-feedback correct"
                : "quiz-feedback incorrect";

            feedback.setAttribute("role", "status");
        }

        formulario.querySelectorAll('input[type="radio"]').forEach((opcion) => {
            opcion.disabled = true;
        });

        if (botonComprobar) {
            botonComprobar.disabled = true;
        }

        if (botonReiniciar) {
            botonReiniciar.hidden = false;
        }
    });

    if (botonReiniciar) {
        botonReiniciar.addEventListener("click", () => {
            formulario.reset();

            formulario.querySelectorAll('input[type="radio"]').forEach((opcion) => {
                opcion.disabled = false;
            });

            if (feedback) {
                feedback.textContent = "";
                feedback.className = "quiz-feedback";
                feedback.removeAttribute("role");
            }

            if (botonComprobar) {
                botonComprobar.disabled = false;
            }

            respondido = false;
        });
    }
}
