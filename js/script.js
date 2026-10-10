
document.addEventListener("DOMContentLoaded", () => {
    configurarNavegacion();
    configurarEstadosTemas();
    configurarDesplazamiento();
    configurarCuestionarioCuadricas();
});

/* =========================================
   1. NAVEGACIÓN
========================================= */

function configurarNavegacion() {
    const paginaActual = window.location.pathname
        .split("/")
        .pop() || "index.html";

    document.querySelectorAll(".nav-link").forEach((enlace) => {
        const destino = enlace.getAttribute("href");

        if (!destino || destino.startsWith("#")) {
            return;
        }

        const archivoDestino = destino.split("/").pop();

        if (archivoDestino === paginaActual) {
            enlace.classList.add("active");
            enlace.setAttribute("aria-current", "page");
        } else {
            enlace.classList.remove("active");
            enlace.removeAttribute("aria-current");
        }
    });
}

/* =========================================
   2. ESTADOS DE LOS TEMAS
========================================= */

function configurarEstadosTemas() {
    document.querySelectorAll(".topic-status").forEach((elemento) => {
        // Los enlaces disponibles conservan su estado.
        if (elemento.closest("a") || elemento.classList.contains("topic-link")) {
            return;
        }

        if (!elemento.textContent.trim()) {
            elemento.textContent = "Próximamente";
        }
    });
}

/* =========================================
   3. DESPLAZAMIENTO SUAVE
========================================= */

function configurarDesplazamiento() {
    document.querySelectorAll('a[href^="#"]').forEach((enlace) => {
        enlace.addEventListener("click", (evento) => {
            const destino = enlace.getAttribute("href");

            if (!destino || destino === "#") {
                return;
            }

            const seccion = document.querySelector(destino);

            if (seccion) {
                evento.preventDefault();

                seccion.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });
}

/* =========================================
   4. PROGRESO DE CUÁDRICAS
========================================= */

const CLAVE_PROGRESO_CUADRICAS = "vectorizaProgress";

function obtenerProgresoCuadricas() {
    try {
        const datos = localStorage.getItem(CLAVE_PROGRESO_CUADRICAS);

        if (!datos) {
            return {
                attempts: 0,
                correctAnswers: 0,
                completedLessons: []
            };
        }

        const progreso = JSON.parse(datos);

        return {
            attempts: Number(progreso.attempts) || 0,
            correctAnswers: Number(progreso.correctAnswers) || 0,
            completedLessons: Array.isArray(progreso.completedLessons)
                ? progreso.completedLessons
                : []
        };
    } catch (error) {
        console.error("No se pudo leer el progreso de Vectoriza:", error);

        return {
            attempts: 0,
            correctAnswers: 0,
            completedLessons: []
        };
    }
}

function guardarProgresoCuadricas(esCorrecta) {
    try {
        const progreso = obtenerProgresoCuadricas();

        progreso.attempts += 1;

        if (esCorrecta) {
            progreso.correctAnswers += 1;

            if (!progreso.completedLessons.includes("cuadricas")) {
                progreso.completedLessons.push("cuadricas");
            }
        }

        localStorage.setItem(
            CLAVE_PROGRESO_CUADRICAS,
            JSON.stringify(progreso)
        );
    } catch (error) {
        console.error("No se pudo guardar el progreso de Vectoriza:", error);
    }
}

/* =========================================
   5. CUESTIONARIO DE CUÁDRICAS
========================================= */

function configurarCuestionarioCuadricas() {
    const formulario = document.getElementById("quiz");

    if (!formulario) {
        return;
    }

    const botonComprobar = formulario.querySelector(
        'button[type="submit"], input[type="submit"]'
    );

    const botonReiniciar = formulario.querySelector(
        '[data-action="reset"], .reset-btn, .quiz-reset'
    );

    const respuestaCorrecta = "b";

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

        const feedback = formulario.querySelector(
            "#feedback, .quiz-feedback, .feedback"
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

        guardarProgresoCuadricas(esCorrecta);

        respondido = true;

        if (feedback) {
            feedback.textContent = esCorrecta
                ? "¡Correcto! Muy bien, identificaste la superficie cuádrica."
                : "No es correcto. Revisa el procedimiento e inténtalo de nuevo.";

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

            if (feedbackDisponible(formulario)) {
                const feedback = formulario.querySelector(
                    "#feedback, .quiz-feedback, .feedback"
                );

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

function feedbackDisponible(formulario) {
    return Boolean(
        formulario.querySelector("#feedback, .quiz-feedback, .feedback")
    );
}
