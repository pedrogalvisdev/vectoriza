
document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("functions-quiz");

    if (!formulario) {
        console.error("No se encontró el cuestionario functions-quiz.");
        return;
    }

    const opciones = formulario.querySelectorAll(
        'input[name="answer"]'
    );

    const retroalimentacion = document.getElementById("feedback");

    const botonReiniciar = formulario.querySelector(
        '[data-action="reset"]'
    );

    const CLAVE_PROGRESO = "vectorizaFuncionesProgress";
    const RESPUESTA_CORRECTA = "b";

    function leerProgreso() {
        try {
            const datos = JSON.parse(
                localStorage.getItem(CLAVE_PROGRESO)
            );

            return {
                attempts: Number(datos?.attempts) || 0,
                correctAnswers: Number(datos?.correctAnswers) || 0
            };
        } catch (error) {
            return {
                attempts: 0,
                correctAnswers: 0
            };
        }
    }

    function guardarProgreso(respuestaCorrecta) {
        const progreso = leerProgreso();

        progreso.attempts += 1;

        if (respuestaCorrecta) {
            progreso.correctAnswers += 1;
        }

        try {
            localStorage.setItem(
                CLAVE_PROGRESO,
                JSON.stringify(progreso)
            );
        } catch (error) {
            console.error("No se pudo guardar el progreso:", error);
        }
    }

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const seleccionada = formulario.querySelector(
            'input[name="answer"]:checked'
        );

        if (!seleccionada) {
            if (retroalimentacion) {
                retroalimentacion.textContent =
                    "Selecciona una respuesta antes de continuar.";
                retroalimentacion.hidden = false;
            }

            return;
        }

        if (formulario.dataset.respondido === "true") {
            return;
        }

        const esCorrecta =
            seleccionada.value === RESPUESTA_CORRECTA;

        guardarProgreso(esCorrecta);

        formulario.dataset.respondido = "true";

        if (retroalimentacion) {
            retroalimentacion.textContent = esCorrecta
                ? "¡Correcto! El argumento de un logaritmo debe ser mayor que cero."
                : "No es correcto. Recuerda que el argumento de un logaritmo debe ser estrictamente mayor que cero.";

            retroalimentacion.hidden = false;
            retroalimentacion.setAttribute("role", "status");
        }

        opciones.forEach((opcion) => {
            opcion.disabled = true;
        });
    });

    if (botonReiniciar) {
        botonReiniciar.addEventListener("click", () => {
            formulario.reset();
            delete formulario.dataset.respondido;

            opciones.forEach((opcion) => {
                opcion.disabled = false;
            });

            if (retroalimentacion) {
                retroalimentacion.textContent = "";
                retroalimentacion.hidden = true;
            }
        });
    }
});
