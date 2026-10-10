
document.addEventListener("DOMContentLoaded", () => {
    configurarCuestionarioCurvas();
    configurarGraficaCurvas();
});

/* =========================================
   1. PROGRESO DEL CUESTIONARIO
========================================= */

const CLAVE_PROGRESO_CURVAS = "vectorizaCurvasProgress";

function obtenerProgresoCurvas() {
    try {
        const datos = localStorage.getItem(CLAVE_PROGRESO_CURVAS);
        const progreso = datos ? JSON.parse(datos) : {};

        return {
            attempts: Number(progreso.attempts) || 0,
            correctAnswers: Number(progreso.correctAnswers) || 0
        };
    } catch (error) {
        console.error("Error al leer el progreso de curvas:", error);

        return {
            attempts: 0,
            correctAnswers: 0
        };
    }
}

function guardarProgresoCurvas(esCorrecta) {
    try {
        const progreso = obtenerProgresoCurvas();

        progreso.attempts += 1;

        if (esCorrecta) {
            progreso.correctAnswers += 1;
        }

        localStorage.setItem(
            CLAVE_PROGRESO_CURVAS,
            JSON.stringify(progreso)
        );
    } catch (error) {
        console.error("Error al guardar el progreso de curvas:", error);
    }
}

/* =========================================
   2. CUESTIONARIO DE CURVAS DE NIVEL
========================================= */

function configurarCuestionarioCurvas() {
    const formulario = document.getElementById("level-quiz");

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
                feedback.textContent =
                    "Selecciona una respuesta antes de comprobar.";
                feedback.className = "quiz-feedback incorrect";
                feedback.setAttribute("role", "alert");
            }

            return;
        }

        const esCorrecta =
            seleccionada.value.trim().toLowerCase() === respuestaCorrecta;

        guardarProgresoCurvas(esCorrecta);
        respondido = true;

        if (feedback) {
            feedback.textContent = esCorrecta
                ? "¡Correcto! Comprendiste la idea de una curva de nivel."
                : "Respuesta incorrecta. Recuerda que una curva de nivel representa f(x, y) = k.";

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

/* =========================================
   3. GRÁFICA INTERACTIVA
   Función: x² + y² = k
========================================= */

function configurarGraficaCurvas() {
    const canvas = document.getElementById("level-canvas");
    const deslizador = document.getElementById("k-slider");
    const valorK = document.getElementById("k-value");
    const radioTexto = document.getElementById("radius-value");

    if (!canvas || !deslizador) {
        return;
    }

    const contexto = canvas.getContext("2d");

    if (!contexto) {
        console.error("No se pudo inicializar la gráfica de curvas de nivel.");
        return;
    }

    function ajustarCanvas() {
        const rectangulo = canvas.getBoundingClientRect();
        const proporcion = window.devicePixelRatio || 1;

        const ancho = Math.max(1, Math.round(rectangulo.width * proporcion));
        const alto = Math.max(1, Math.round(rectangulo.height * proporcion));

        if (canvas.width !== ancho || canvas.height !== alto) {
            canvas.width = ancho;
            canvas.height = alto;
        }

        contexto.setTransform(proporcion, 0, 0, proporcion, 0, 0);

        dibujarGrafica();
    }

    function dibujarGrafica() {
        const ancho = canvas.clientWidth;
        const alto = canvas.clientHeight;

        if (!ancho || !alto) {
            return;
        }

        const k = Math.max(0, Number(deslizador.value) || 0);
        const radio = Math.sqrt(k);

        const escala = Math.min(ancho, alto) / 12;
        const centroX = ancho / 2;
        const centroY = alto / 2;

        contexto.clearRect(0, 0, ancho, alto);

        // Fondo
        contexto.fillStyle = "#ffffff";
        contexto.fillRect(0, 0, ancho, alto);

        // Cuadrícula
        contexto.beginPath();
        contexto.strokeStyle = "#e3e8f1";
        contexto.lineWidth = 1;

        for (let x = centroX % escala; x < ancho; x += escala) {
            contexto.moveTo(x, 0);
            contexto.lineTo(x, alto);
        }

        for (let y = centroY % escala; y < alto; y += escala) {
            contexto.moveTo(0, y);
            contexto.lineTo(ancho, y);
        }

        contexto.stroke();

        // Ejes cartesianos
        contexto.beginPath();
        contexto.strokeStyle = "#153866";
        contexto.lineWidth = 1.5;

        contexto.moveTo(0, centroY);
        contexto.lineTo(ancho, centroY);

        contexto.moveTo(centroX, 0);
        contexto.lineTo(centroX, alto);

        contexto.stroke();

        // Etiquetas de los ejes
        contexto.fillStyle = "#153866";
        contexto.font = "12px Arial";
        contexto.fillText("x", ancho - 16, centroY - 8);
        contexto.fillText("y", centroX + 8, 14);

        // Curva de nivel: circunferencia de radio √k
        contexto.beginPath();
        contexto.arc(
            centroX,
            centroY,
            radio * escala,
            0,
            Math.PI * 2
        );

        contexto.strokeStyle = "#f2a30f";
        contexto.lineWidth = 3;
        contexto.stroke();

        // Radio desde el origen hasta la circunferencia
        if (radio > 0) {
            contexto.beginPath();
            contexto.moveTo(centroX, centroY);
            contexto.lineTo(
                centroX + radio * escala,
                centroY
            );

            contexto.strokeStyle = "#2b6cb0";
            contexto.lineWidth = 2;
            contexto.stroke();

            contexto.beginPath();
            contexto.arc(
                centroX + radio * escala,
                centroY,
                4,
                0,
                Math.PI * 2
            );

            contexto.fillStyle = "#2b6cb0";
            contexto.fill();
        }

        // Punto central
        contexto.beginPath();
        contexto.arc(centroX, centroY, 3, 0, Math.PI * 2);
        contexto.fillStyle = "#153866";
        contexto.fill();

        // Información del nivel
        contexto.fillStyle = "#122459";
        contexto.font = "bold 14px Arial";
        contexto.fillText(`k = ${k}`, 12, 22);
    }

    function actualizarValores() {
        const k = Number(deslizador.value);
        const radio = Math.sqrt(k);

        if (valorK) {
            valorK.textContent = String(k);
        }

        if (radioTexto) {
            radioTexto.textContent = radio.toFixed(2);
        }

        dibujarGrafica();
    }

    deslizador.addEventListener("input", actualizarValores);

    if ("ResizeObserver" in window) {
        const observador = new ResizeObserver(ajustarCanvas);
        observador.observe(canvas);
    } else {
        window.addEventListener("resize", ajustarCanvas);
    }

    actualizarValores();
    ajustarCanvas();
}
