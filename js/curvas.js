
document.addEventListener("DOMContentLoaded", () => {
    configurarGraficaCurvas();
});

/* =========================================
   GRÁFICA INTERACTIVA DE CURVAS DE NIVEL
   Función: f(x,y) = x² + y²
   Curva de nivel: x² + y² = k
========================================= */

function configurarGraficaCurvas() {
    const canvas = document.getElementById("level-graph");
    const deslizador = document.getElementById("level-k");
    const valorK = document.getElementById("level-k-value");
    const informacion = document.getElementById("level-graph-info");

    if (!canvas || !deslizador) {
        console.error("No se encontraron los elementos de la gráfica.");
        return;
    }

    const contexto = canvas.getContext("2d");

    if (!contexto) {
        console.error("No se pudo inicializar la gráfica.");
        return;
    }

    function dibujarGrafica() {
        const ancho = canvas.clientWidth;
        const alto = canvas.clientHeight;

        if (ancho <= 0 || alto <= 0) {
            return;
        }

        const proporcion = window.devicePixelRatio || 1;

        const anchoReal = Math.round(ancho * proporcion);
        const altoReal = Math.round(alto * proporcion);

        if (
            canvas.width !== anchoReal ||
            canvas.height !== altoReal
        ) {
            canvas.width = anchoReal;
            canvas.height = altoReal;
        }

        contexto.setTransform(proporcion, 0, 0, proporcion, 0, 0);

        const k = Math.max(1, Number(deslizador.value) || 1);
        const radio = Math.sqrt(k);

        // Fondo de la gráfica
        contexto.clearRect(0, 0, ancho, alto);
        contexto.fillStyle = "#ffffff";
        contexto.fillRect(0, 0, ancho, alto);

        // Centro y escala para que la circunferencia quepa
        const centroX = ancho / 2;
        const centroY = alto / 2;
        const escala = Math.min(ancho, alto) / 12;

        // Cuadrícula
        contexto.beginPath();
        contexto.strokeStyle = "#e3e8f1";
        contexto.lineWidth = 1;

        for (let i = -5; i <= 5; i++) {
            const posicionX = centroX + i * escala;
            const posicionY = centroY + i * escala;

            contexto.moveTo(posicionX, 0);
            contexto.lineTo(posicionX, alto);

            contexto.moveTo(0, posicionY);
            contexto.lineTo(ancho, posicionY);
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

        // Números de los ejes
        contexto.fillStyle = "#153866";
        contexto.font = "12px Arial";
        contexto.textAlign = "center";
        contexto.textBaseline = "top";

        for (let i = -5; i <= 5; i++) {
            if (i === 0) continue;

            contexto.fillText(
                String(i),
                centroX + i * escala,
                centroY + 7
            );
        }

        contexto.textAlign = "left";
        contexto.textBaseline = "middle";

        for (let i = -5; i <= 5; i++) {
            if (i === 0) continue;

            contexto.fillText(
                String(i),
                centroX + 7,
                centroY - i * escala
            );
        }

        // Etiquetas de los ejes
        contexto.font = "bold 14px Arial";
        contexto.textAlign = "right";
        contexto.textBaseline = "bottom";
        contexto.fillText("x", ancho - 8, centroY - 7);

        contexto.textAlign = "left";
        contexto.textBaseline = "top";
        contexto.fillText("y", centroX + 8, 5);

        // Circunferencia: x² + y² = k
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
        contexto.beginPath();
        contexto.moveTo(centroX, centroY);
        contexto.lineTo(
            centroX + radio * escala,
            centroY
        );

        contexto.strokeStyle = "#2b6cb0";
        contexto.lineWidth = 2;
        contexto.stroke();

        // Punto final del radio
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

        // Centro de la circunferencia
        contexto.beginPath();
        contexto.arc(
            centroX,
            centroY,
            4,
            0,
            Math.PI * 2
        );

        contexto.fillStyle = "#153866";
        contexto.fill();

        // Valor de k dentro de la gráfica
        contexto.fillStyle = "#122459";
        contexto.font = "bold 14px Arial";
        contexto.textAlign = "left";
        contexto.textBaseline = "top";
        contexto.fillText(`k = ${k}`, 12, 12);

        // Actualizar la información debajo de la gráfica
        if (informacion) {
            const radioTexto = Number.isInteger(radio)
                ? String(radio)
                : radio.toFixed(2);

            informacion.textContent =
                `Para k = ${k}, el radio es r = √${k} ≈ ${radioTexto}.`;
        }

        // Actualizar el indicador del deslizador
        if (valorK) {
            valorK.textContent = `k = ${k}`;
        }
    }

    // Dibujar al mover el deslizador
    deslizador.addEventListener("input", dibujarGrafica);
    deslizador.addEventListener("change", dibujarGrafica);

    // Redibujar cuando cambie el tamaño del área
    if ("ResizeObserver" in window) {
        const observador = new ResizeObserver(() => {
            dibujarGrafica();
        });

        observador.observe(canvas);
    } else {
        window.addEventListener("resize", dibujarGrafica);
    }

    // Dibujar la gráfica inicial
    dibujarGrafica();
}
