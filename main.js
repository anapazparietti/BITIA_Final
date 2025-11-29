import { BitiaConnector } from './bitia_connector.js';

// --- CLASE MOCK PARA SIMULACIÓN ---
class MockConnector {
    constructor() {
        console.log("⚠️ Ejecutando en Modo Simulación (Sin Arduino)");
        this.onScroll = (direccion) => { 
            console.log(`[MOCK] Scroll simulado: ${direccion}`); 
        };
    }
    async conectar() {
        return true; 
    }
    setNucleo(nucleo) {
        console.log(`[MOCK] setNucleo(${nucleo}) llamado.`);
    }
    isMock = true;
}

// --- 1. INSTANCIACIÓN ---
const arduino = window.Serial ? new BitiaConnector() : new MockConnector();

const statusDisplay = document.getElementById('status');
const contentFrame = document.getElementById('contentFrame'); 
const btnConnect = document.getElementById('btnConnect');

// Exposición global (debug)
window.app = arduino;
window.contentFrame = contentFrame;

// --- 2. CONEXIÓN SOLO AL TOCAR EL BOTÓN ---
btnConnect.addEventListener("click", async () => {

    // Evitar múltiples conexiones
    if (btnConnect.dataset.connected === "true") return;

    const ok = await arduino.conectar();

    if (!ok) return;

    btnConnect.dataset.connected = "true";

    // Cambiar estado visual
    btnConnect.style.background = "#0f0";
    btnConnect.innerText = "✅ ACTIVO";

    if (statusDisplay) {
        statusDisplay.innerText = arduino.isMock 
            ? "Sistema en MODO SIMULACIÓN. Usa 8/0 o Flechas."
            : "Sistema Bitia Activo";

        statusDisplay.style.color = "#0f0";
    }

    // Configurar Nucleo inicial
    arduino.setNucleo(0);

    // Activar simulación si estamos en Mock
    if (arduino.isMock) {
        addKeyboardSimulators();
    }
});

// --- 3. FEEDBACK DE ERRORES (solo si no es mock) ---
if (!arduino.isMock) {
    arduino.onError = (err) => {
        if (statusDisplay) {
            statusDisplay.innerText = "Error: " + err;
            statusDisplay.style.color = "red";
        }
        console.error("Error de conexión serial:", err);
    };
}

// --- 4. SCROLL / COMANDO AL IFRAME ---
arduino.onScroll = (direccion) => {

    if (contentFrame.contentWindow) {
        contentFrame.contentWindow.postMessage({ 
            tipo: 'ENCODER_BITIA', 
            dir: direccion 
        }, '*');
    }
};

// --- 5. SIMULACIÓN DE ENCODER POR TECLADO ---
function addKeyboardSimulators() {
    console.log("Simulación activa. Usa Flecha Arriba/Abajo o teclas 8/0 para desplazar.");
    
    document.addEventListener('keydown', (event) => {

        if (event.repeat) return;
        
        let direccion = null;
        
        if (event.key === 'ArrowUp' || event.key === '8') {
            direccion = 'CW';

        } else if (event.key === 'ArrowDown' || event.key === '0') {
            direccion = 'CCW';
        }

        if (direccion) {
            arduino.onScroll(direccion); 
            event.preventDefault();
        }
    });
}

// --- 6. FUNCIÓN GLOBAL PARA CAMBIAR PÁGINAS ---
window.changePage = (url) => {
    if (!contentFrame.src.endsWith(url)) {
        contentFrame.src = url;
    }
};
