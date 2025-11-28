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
        // Simula la conexión instantánea y exitosa
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

// EXPOSICIÓN GLOBAL (Útil para debug)
window.app = arduino;
window.contentFrame = contentFrame;


// --- 2. CONEXIÓN Y ACTIVACIÓN (EJECUCIÓN INMEDIATA) ---
// La función se autoejecuta inmediatamente al cargar el script.
(async () => {
    // Intenta conectar (o simplemente devuelve 'true' en modo Mock)
    await arduino.conectar();
    
    // Feedback visual en el botón (Si el botón existe)
    if (btnConnect) {
        btnConnect.style.background = "#0f0";
        btnConnect.innerText = "✅ ACTIVO";
    }
    
    if (statusDisplay) {
        statusDisplay.innerText = arduino.isMock ? "Sistema en MODO SIMULACIÓN. Usa 8/0 o Flechas." : "Sistema Bitia Activo";
        statusDisplay.style.color = "#0f0";
    }

    // Configura el Nucleo inicial (simulado o real)
    arduino.setNucleo(0); 
    
    // --- Activa la Simulación por Teclado si estamos en modo Mock ---
    // ESTA ES LA CLAVE para la activación automática.
    if (arduino.isMock) {
        addKeyboardSimulators();
    }
})(); 


// --- 3. FEEDBACK DE ERRORES (Solo se define si no estamos en Mock) ---
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
        // ENVIAMOS EL MENSAJE POSTAL SEGURO
        contentFrame.contentWindow.postMessage({ 
            tipo: 'ENCODER_BITIA', 
            dir: direccion 
        }, '*');
    }
};


// --- 5. FUNCIÓN DE SIMULACIÓN POR TECLADO ---
function addKeyboardSimulators() {
    console.log("Simulación activa. Usa Flecha Arriba/Abajo o teclas 8/0 para desplazar.");
    
    document.addEventListener('keydown', (event) => {
        // Evita que el evento se dispare repetidamente si la tecla se mantiene pulsada
        if (event.repeat) return;
        
        let direccion = null;
        
        // 8 y Flecha Arriba simulan 'CW' (Sentido horario - Mover carrusel hacia adelante/abajo)
        if (event.key === 'ArrowUp' || event.key === '8') {
            direccion = 'CW'; 
            
        // 0 y Flecha Abajo simulan 'CCW' (Sentido anti-horario - Mover carrusel hacia atrás/arriba)
        } else if (event.key === 'ArrowDown' || event.key === '0') {
            direccion = 'CCW'; 
            
        // Por consistencia con el HTML, 'Enter' simula la ACCION (que es ACCION en el HTML)
        } else if (event.key.toLowerCase() === 'a') {
             // Usamos 'a' para simular la tecla ACCION del teclado externo
             // La lógica de long press debe ir en el HTML para la tecla ACCION
             // Por simplicidad en la simulación, solo enviamos un 'CLICK' para los otros botones
             // Nota: En Nucleo1.html, la tecla de acción es '+'
             
        }

        if (direccion) {
            // En el código de Nucleo1.html, el 'ENCODER_BITIA' espera 'CW' o 'CCW'
            // Tus teclas 8/0/Flechas simulan el encoder real.
            arduino.onScroll(direccion); 
            event.preventDefault(); // Evita el scroll nativo de la página maestra
        }
    });
}


// --- 6. FUNCIÓN AUXILIAR GLOBAL ---
window.changePage = (url) => {
    if (contentFrame.src.endsWith(url)) return;
    contentFrame.src = url;
};