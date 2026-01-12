
const selector = document.getElementById("selector");
const quiz = document.getElementById("quiz");
const resultado = document.getElementById("resultado");
const feedback = document.getElementById("feedback");
const preguntaActualContenedor = document.getElementById("pregunta-actual");

let preguntasCargadas = [];
let estado = {
    indiceActual: 0,
    aciertos: 0,
    fallos: 0
};

// --- CARGAR EXAMEN ---
selector.addEventListener("change", async () => {
    const url = selector.value;
    if (!url) return;

    const datos = await fetch(url).then(r => r.json());
    preguntasCargadas = datos.preguntas || datos; // Ajuste por si el JSON tiene .preguntas

    reiniciarEstadisticas();
    mostrarSiguientePregunta();
});

function reiniciarEstadisticas() {
    estado.indiceActual = 0;
    estado.aciertos = 0;
    estado.fallos = 0;
    quiz.innerHTML = "";
    resultado.textContent = "";
    feedback.textContent = "";
    preguntaActualContenedor.innerHTML = "";
}

// --- MOSTRAR UNA POR UNA ---
function mostrarSiguientePregunta() {
    feedback.textContent = "";

    if (estado.indiceActual >= preguntasCargadas.length) {
        finalizarExamen();
        return;
    }

    const p = preguntasCargadas[estado.indiceActual];
    actualizarMarcador();

    preguntaActualContenedor.innerHTML = `
        <div class="pregunta">
            <p><strong>Pregunta ${estado.indiceActual + 1} de ${preguntasCargadas.length}</strong></p>
            <p>${p.pregunta}</p>
            ${Object.entries(p.opciones).map(([letra, texto]) => `
                <label class="opcion">
                    <input type="radio" name="respuesta" value="${letra}">
                    ${letra}) ${texto}
                </label>
            `).join("")}
            <br>
            <button id="comprobar">Comprobar y Siguiente</button>
        </div>
    `;

    document.getElementById("comprobar").onclick = () => validarRespuesta(p);
}

function validarRespuesta(p) {
    const marcada = document.querySelector(`input[name="respuesta"]:checked`);

    if (!marcada) {
        // No penalizamos, solo avanzamos
        feedback.textContent = "⏭ Pregunta saltada (sin penalización)";
        feedback.style.color = "blue";
        estado.indiceActual++;
        mostrarSiguientePregunta();
        return;
    }

    if (marcada.value === p.correcta) {
        estado.aciertos++;
        feedback.textContent = "✔ ¡Correcto!";
        feedback.style.color = "green";
    } else {
        estado.fallos++;
        feedback.textContent = `✘ Incorrecto. La respuesta correcta era ${p.correcta.toUpperCase()}`;
        feedback.style.color = "red";
    }

    estado.indiceActual++;
    mostrarSiguientePregunta();
}

function actualizarMarcador() {
    const contestadas = estado.indiceActual;
    let notaSobreDiez = 0;

    if (contestadas > 0) {
        const puntosNetos = estado.aciertos - (estado.fallos / 3);
        notaSobreDiez = (puntosNetos / contestadas) * 10;
        if (notaSobreDiez < 0) notaSobreDiez = 0;
    }

    resultado.innerHTML = `
        <div class="marcador-container">
            <div class="stat">Aciertos: <span class="verde">${estado.aciertos}</span></div>
            <div class="stat">Fallos: <span class="rojo">${estado.fallos}</span></div>
            <div class="stat">Progreso: <span>${contestadas} / ${preguntasCargadas.length}</span></div>
            <div class="nota-actual">Nota actual: <strong>${notaSobreDiez.toFixed(2)}</strong></div>
        </div>
    `;
}

function finalizarExamen() {
    const noContestadas = preguntasCargadas.length - (estado.aciertos + estado.fallos);
    const notaFinal = ((estado.aciertos - (estado.fallos / 3)) / preguntasCargadas.length * 10).toFixed(2);

    preguntaActualContenedor.innerHTML = `
        <h2>¡Examen finalizado!</h2>
        <div style="font-size: 1.2em; border: 2px solid #333; padding: 20px;">
            <h3>Resumen Final:</h3>
            <p>Aciertos: ${estado.aciertos}</p>
            <p>Fallos: ${estado.fallos}</p>
            <p>No contestadas: ${noContestadas}</p>
            <p>Nota sobre 10: <strong>${notaFinal}</strong></p>
        </div>
        <button id="reiniciar">Reiniciar examen</button>
    `;

    document.getElementById("reiniciar").onclick = () => {
        reiniciarEstadisticas();
        mostrarSiguientePregunta();
    };
}
