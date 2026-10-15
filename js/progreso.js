
document.addEventListener("DOMContentLoaded", actualizarPanelProgreso);

const LECCIONES_VECTORIZA = [
    {
        id: "funciones",
        nombre: "Funciones de varias variables",
        clave: "vectorizaFuncionesProgress",
        pagina: "funciones.html"
    },
    {
        id: "cuadricas",
        nombre: "Superficies cuádricas",
        clave: "vectorizaProgress",
        pagina: "cuadricas.html"
    },
    {
        id: "conicas",
        nombre: "Cónicas",
        clave: "vectorizaConicasProgress",
        pagina: "conicas.html"
    },
    {
        id: "curvas",
        nombre: "Curvas de nivel",
        clave: "vectorizaCurvasProgress",
        pagina: "curvas.html"
    }
];

/* =========================================
   LECTURA DEL PROGRESO
========================================= */

function leerEstadisticas(clave) {
    try {
        const contenido = localStorage.getItem(clave);
        const datos = contenido ? JSON.parse(contenido) : {};

        const intentos = Math.max(0, Number(datos.attempts) || 0);
        const aciertos = Math.max(0, Number(datos.correctAnswers) || 0);

        return {
            attempts: intentos,
            correctAnswers: Math.min(aciertos, intentos)
        };
    } catch (error) {
        console.error("Error al leer las estadísticas:", error);

        return {
            attempts: 0,
            correctAnswers: 0
        };
    }
}

/* =========================================
   CÁLCULO DE ESTADÍSTICAS
========================================= */

function calcularProgresoGeneral() {
    const lecciones = LECCIONES_VECTORIZA.map((leccion) => {
        const estadisticas = leerEstadisticas(leccion.clave);

        return {
            ...leccion,
            ...estadisticas,
            porcentajeAciertos: estadisticas.attempts > 0
                ? Math.round(
                    estadisticas.correctAnswers /
                    estadisticas.attempts * 100
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
        leccionesIniciadas / lecciones.length * 100
    );

    const porcentajeAciertos = intentosTotales > 0
        ? Math.round(respuestasCorrectas / intentosTotales * 100)
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

    actualizarDescripcion(progreso);
    renderizarDetalleProgreso(progreso.lecciones);
}

function establecerTexto(id, valor) {
    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.textContent = String(valor);
    }
}

function actualizarDescripcion(progreso) {
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
        `Has iniciado ${progreso.leccionesIniciadas} de ` +
        `${progreso.lecciones.length} temas. Llevas ` +
        `${progreso.intentosTotales} intentos y un ` +
        `${progreso.porcentajeAciertos}% de respuestas correctas.`;
}

/* =========================================
   DETALLE DE CADA LECCIÓN
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

        const titulo = document.createElement("h3");
        const enlace = document.createElement("a");

        enlace.href = leccion.pagina;
        enlace.textContent = leccion.nombre;
        titulo.appendChild(enlace);

        const estado = document.createElement("p");
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
            titulo,
            estado,
            intentos,
            aciertos,
            porcentaje
        );

        contenedor.appendChild(tarjeta);
    });
}
