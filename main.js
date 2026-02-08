// vamos criar um cronometro usando HTML, JS, Css 
// tera 4 botoes, Setar, Resetar, Iniciar e Parar.
// o cronometro vai mostrar horas, minutos e segundos (sem milissegundos)

function start() {
    // inicia contagem regressiva usando remainingTime
    let remaining = Number(localStorage.getItem('remainingTime')) || 0;
    if (remaining <= 0) return;
    const endTime = Date.now() + remaining;
    localStorage.setItem('endTime', String(endTime));
    localStorage.setItem('isRunning', 'true');
    startLoop();
}

function stop() {
    const endTime = Number(localStorage.getItem('endTime')) || Date.now();
    let remaining = endTime - Date.now();
    if (remaining < 0) remaining = 0;
    localStorage.setItem('remainingTime', String(remaining));
    localStorage.setItem('isRunning', 'false');
    stopLoop();
    updateDisplay();
}

function reset() {
    localStorage.setItem('remainingTime', '0');
    localStorage.removeItem('endTime');
    localStorage.setItem('isRunning', 'false');
    stopLoop();
    updateDisplay();
}

function setTime() {
    // adiciona 30 segundos ao tempo restante
    const addMs = 30 * 1000;
    const isRunning = localStorage.getItem('isRunning') === 'true';
    if (isRunning) {
        const endTime = Number(localStorage.getItem('endTime')) || Date.now();
        const remaining = Math.max(0, endTime - Date.now());
        const newRemaining = remaining + addMs;
        localStorage.setItem('endTime', String(Date.now() + newRemaining));
    } else {
        const remaining = Number(localStorage.getItem('remainingTime')) || 0;
        localStorage.setItem('remainingTime', String(remaining + addMs));
    }
    updateDisplay();
}

let rafId = null;

function startLoop() {
    if (rafId) return;
    function frame() {
        updateDisplay();
        rafId = requestAnimationFrame(frame);
    }
    frame();
}

function stopLoop() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
}

function updateDisplay() {
    const displayEl = document.querySelector('.display');
    if (!displayEl) return;
    const isRunning = localStorage.getItem('isRunning') === 'true';
    let remaining = Number(localStorage.getItem('remainingTime')) || 0;
    if (isRunning) {
        const endTime = Number(localStorage.getItem('endTime')) || Date.now();
        remaining = endTime - Date.now();
    }
    if (remaining <= 0) {
        remaining = 0;
        if (isRunning) {
            localStorage.setItem('isRunning', 'false');
            stopLoop();
        }
    }
    const hours = Math.floor(remaining / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    const hh = String(hours).padStart(2,'0');
    const mm = String(minutes).padStart(2,'0');
    const ss = String(seconds).padStart(2,'0');
    displayEl.textContent = `${hh}:${mm}:${ss}`;
    updateButtons();
}

function updateButtons() {
    const isRunning = localStorage.getItem('isRunning') === 'true';
    const btnStart = document.getElementById('iniciar');
    const btnStop = document.getElementById('parar');
    if (btnStart) btnStart.disabled = isRunning;
    if (btnStop) btnStop.disabled = !isRunning;
}

function init() {
    // attach handlers
    const btnSet = document.getElementById('setar');
    const btnReset = document.getElementById('resetar');
    const btnStart = document.getElementById('iniciar');
    const btnStop = document.getElementById('parar');
    if (btnSet) btnSet.addEventListener('click', setTime);
    if (btnReset) btnReset.addEventListener('click', reset);
    if (btnStart) btnStart.addEventListener('click', start);
    if (btnStop) btnStop.addEventListener('click', stop);

    // ensure storage defaults
    if (localStorage.getItem('remainingTime') === null) localStorage.setItem('remainingTime','0');
    if (localStorage.getItem('isRunning') === 'true') {
        if (localStorage.getItem('endTime')) startLoop();
    }
    updateDisplay();
}

document.addEventListener('DOMContentLoaded', init);

