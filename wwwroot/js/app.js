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
    // Ajustamos por si el JSON viene con una propiedad .preguntas o es un array directo
    preguntasCargadas = datos.preguntas || datos; 
    
    reiniciarEstadisticas();
    mostrarSiguientePregunta();
});

function reiniciarEstadisticas() {
    estado.indiceActual = 0;
    estado.aciertos = 0;
    estado.fallos = 0;
    quiz.innerHTML = ""; // Limpiamos el modo "lista completa"
    resultado.textContent = "";
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
        feedback.textContent = "⚠️ Por favor, selecciona una opción.";
        feedback.style.color = "orange";
        return;
    }

    if (marcada.value === p.correcta) {
        estado.aciertos++;
        alert("✔ ¡Correcto!"); // Opcional, puedes usar el div feedback
    } else {
        estado.fallos++;
        alert(`✘ Incorrecto. La respuesta era la ${p.correcta.toUpperCase()}`);
    }

    estado.indiceActual++;
    mostrarSiguientePregunta();
}

function actualizarMarcador() {
    const contestadas = estado.indiceActual; // Preguntas que ya pasaron
    
    // Si aún no hemos contestado ninguna, la nota es 0.00
    let notaSobreDiez = 0;

    if (contestadas > 0) {
        // Fórmula de puntos netos (AGE): Aciertos - (Fallos / 3)
        const puntosNetos = estado.aciertos - (estado.fallos / 3);
        
        // Calculamos la nota sobre 10 basada SOLO en las contestadas hasta ahora
        notaSobreDiez = (puntosNetos / contestadas) * 10;
        
        // Evitamos notas negativas si hay muchísimos fallos
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
    preguntaActualContenedor.innerHTML = "<h2>¡Examen finalizado!</h2>";
    const notaFinal = ((estado.aciertos - (estado.fallos / 3)) / preguntasCargadas.length * 10).toFixed(2);
    
    resultado.innerHTML = `
        <div style="font-size: 1.2em; border: 2px solid #333; padding: 20px;">
            <h3>Resumen Final:</h3>
            <p>Aciertos: ${estado.aciertos}</p>
            <p>Fallos: ${estado.fallos}</p>
            <p>Nota sobre 10: <strong>${notaFinal}</strong></p>
        </div>
    `;
}