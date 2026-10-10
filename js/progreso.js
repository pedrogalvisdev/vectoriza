
document.addEventListener("DOMContentLoaded", () => {
    actualizarPanelProgreso();
});

/* =========================================
   CONFIGURACIÓN
========================================= */

const LECCIONES_VECTORIZA = [
    {
        id: "cuadricas",
        nombre: "Superficies cuádricas",
        clave: "vectorizaProgress"
    },
    {
        id: "conicas",
        nombre: "Cónicas",
        clave: "vectorizaConicasProgress"
    },
    {
        id: "curvas",
        nombre: "Curvas de nivel",
        clave: "vectorizaCurvasProgress"
    }
];

/* =========================================
   LECTURA DE DATOS
========================================= */

function leerEstadisticas(clave) {
    try {
        const contenido = localStorage.getItem(clave);

        if (!contenido) {
            return {
                attempts: 0,
                correctAnswers: 0
            };
        }

        const datos = JSON.parse(contenido);

        return {
            attempts: Math.max(0, Number(datos.attempts) || 0),
            correctAnswers: Math.max(
                0,
                Number(datos.correctAnswers) || 0
            )
        };
    } catch (error) {
        console.error(`No se pudieron leer las estadísticas de ${clave}:`, error);

        return {
            attempts: 0,
            correctAnswers: 0
        };
    }
}

/* =========================================
   CÁLCULO DEL PROGRESO
========================================= */

function calcularProgresoGeneral() {
    const lecciones = LECCIONES_VECTORIZA.map((leccion) => {
        const estadisticas = leerEstadisticas(leccion.clave);

        return {
            ...leccion,
            ...estadisticas,
            porcentajeAciertos: estadisticas.attempts > 0
                ? Math.round(
                    (estadisticas.correctAnswers / estadisticas.attempts) * 100
                )
                : 0
        };
    });

    const intentosTotales = lecciones.reduce(
        (total, leccion) => total + leccion.attempts,
        0
    );

    const respuestasCorrectas = lecciones.reduce(
        (total, leccion) => total + leccion.correctAnswers,
        0
    );

    const leccionesIniciadas = lecciones.filter(
        (leccion) => leccion.attempts > 0
    ).length;

    const porcentajeLecciones = Math.round(
        (leccionesIniciadas / LECCIONES_VECTORIZA.length) * 100
    );

    const porcentajeAciertos = intentosTotales > 0
        ? Math.round((respuestasCorrectas / intentosTotales) * 100)
        : 0;

    return {
        lecciones,
        intentosTotales,
        respuestasCorrectas,
        leccionesIniciadas,
        porcentajeLecciones,
        porcentajeAciertos
    };
}

/* =========================================
   ACTUALIZACIÓN DEL PANEL
========================================= */

function actualizarPanelProgreso() {
    const progreso = calcularProgresoGeneral();

    establecerTexto("completed-count", progreso.leccionesIniciadas);
    establecerTexto("attempt-count", progreso.intentosTotales);
    establecerTexto("correct-count", progreso.respuestasCorrectas);

    const barra = document.querySelector(
        "#progress-bar, .progress-bar-fill"
    );

    if (barra) {
        barra.style.width = `${progreso.porcentajeLecciones}%`;
        barra.setAttribute("role", "progressbar");
        barra.setAttribute("aria-valuemin", "0");
        barra.setAttribute("aria-valuemax", "100");
        barra.setAttribute(
            "aria-valuenow",
            String(progreso.porcentajeLecciones)
        );
    }

    establecerDescripcion(progreso);
    renderizarDetalleProgreso(progreso.lecciones);
}

function establecerTexto(id, valor) {
    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.textContent = String(valor);
    }
}

function establecerDescripcion(progreso) {
    const descripcion = document.querySelector(
        "#progress-description, .progress-description"
    );

    if (!descripcion) {
        return;
    }

    if (progreso.intentosTotales === 0) {
        descripcion.textContent =
            "¡Empieza tu aprendizaje! Resuelve un cuestionario para registrar tu progreso.";
        return;
    }

    descripcion.textContent =
        `Has iniciado ${progreso.leccionesIniciadas} de ${LECCIONES_VECTORIZA.length} temas ` +
        `y llevas ${progreso.intentosTotales} intentos, con un ${progreso.porcentajeAciertos}% ` +
        "de respuestas correctas.";
}

/* =========================================
   DETALLE POR LECCIÓN
========================================= */

function renderizarDetalleProgreso(lecciones) {
    const contenedor = document.getElementById("progress-details");

    if (!contenedor) {
        return;
    }

    contenedor.replaceChildren();

    lecciones.forEach((leccion) => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "progress-detail-card";

        const encabezado = document.createElement("h3");
        encabezado.textContent = leccion.nombre;

        const estado = document.createElement("p");
        estado.className = "progress-detail-status";
        estado.textContent = leccion.attempts > 0
            ? "Cuestionario iniciado"
            : "Pendiente";

        const intentos = document.createElement("p");
        intentos.textContent = `Intentos: ${leccion.attempts}`;

        const aciertos = document.createElement("p");
        aciertos.textContent =
            `Respuestas correctas: ${leccion.correctAnswers}`;

        const porcentaje = document.createElement("p");
        porcentaje.textContent =
            `Porcentaje de aciertos: ${leccion.porcentajeAciertos}%`;

        tarjeta.append(
            encabezado,
            estado,
            intentos,
            aciertos,
            porcentaje
        );

        contenedor.appendChild(tarjeta);
    });
}
