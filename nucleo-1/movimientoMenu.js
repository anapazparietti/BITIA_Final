document.addEventListener('DOMContentLoaded', () => {

  const ventanas = Array.from(document.querySelectorAll('.calendario-ventana'));
  let indice = 0;

  // ⭐ IMPORTAR TECLAS (Igual que en el HTML) ⭐
  const KEYS = window.parent.BITIA_KEYS || { ACCION: '+', ARRIBA: '8', ABAJO: '0' };

  // Variable global de estado
  // (Se comparte con el HTML porque ambos están en el mismo window)
  if (typeof window.modoCalendario === 'undefined') {
      window.modoCalendario = 'normal'; 
  }
  const contenedor = document.querySelector('.contenedor-3d');

  let indiceActual = 0; 

  // Separacion entre las ventanas, distancias y las rotaciones d
  const CONFIG = {
    SEPARACION_X: 200, 
    // Distancia profundidad entre cada ventana
    PROFUNDIDAD_Z: 280, 
    ROTACION_Y: 12,    
    ESCALA_FRONT: 1.06, 
  };

  function actualizarVista() {
    ventanas.forEach((ventana, i) => {
        const offset = i - indiceActual;
        const absOffset = Math.abs(offset);

        // Si la ventana esta al frente
        if (offset === 0) {
            ventana.classList.add('front');
            ventana.style.transform = `scale(${CONFIG.ESCALA_FRONT}) translateZ(0px)`;
            ventana.style.opacity = '1';
            ventana.style.zIndex = '1000';
        } 
        // Si la ventana esta al detras de la del frente
        else {
            ventana.classList.remove('front');
            
            const z = -absOffset * CONFIG.PROFUNDIDAD_Z;
            
            const x = -offset * CONFIG.SEPARACION_X;
            
            const rotY = offset < 0 ? -CONFIG.ROTACION_Y : CONFIG.ROTACION_Y; 
            
            ventana.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${rotY}deg) scale(1)`;
            
            // Esto es la opacidad de las ventanas cuando esta lejos
            ventana.style.opacity = String(Math.max(0, 1 - absOffset * 0.30));
            ventana.style.zIndex = String(900 - absOffset);
        }
      });
    }

  // --- CONTROL MOVIMIENTO DEL MENU CON LA RUEDA DEL MOUSE --- 
  
  //let lastRueda = performance.now();
  //const RUEDA_DELAY = 120; //Probar cuando ponga los sonidos si esto ayuda subirlo

  //actualizarVista(); 

  //window.addEventListener('wheel', (e) => {
      //const now = performance.now();
      // delay para que no haya errores si lo paso rapido
      //if (now - lastRueda < RUEDA_DELAY) {
          //e.preventDefault();
          //return;
      //}
      //lastRueda = now;

      //e.preventDefault();

      //if (e.deltaY < 0 && indiceActual > 0) {
          //indiceActual--; // Rueda a arriba 
      //} else if (e.deltaY > 0 && indiceActual < ventanas.length - 1) {
          //indiceActual++; // Rueda a abajo
      //}

      //actualizarVista();
  //}, { passive: false });

  // --- CONTROL MOVIMIENTO DEL MENU CON LAS TECLAS ---

  let ultimoTiempoTecla = 0; 
  const TECLA_DELAY = 120; 

  window.addEventListener('keydown', (e) => {
    const now = performance.now();
        
      if (now - ultimoTiempoTecla < TECLA_DELAY) {
        return;
      }

      let indiceCambiado = false;
      const tecla = e.key.toLowerCase();

      if (tecla === 'y') {
          if (indiceActual > 0) {
              indiceActual--;
              indiceCambiado = true;
          }
        } 
        else if (tecla === 'k') {
            if (indiceActual < ventanas.length - 1) {
                indiceActual++;
                indiceCambiado = true;
            }
        }
        if (indiceCambiado) {
            ultimoTiempoTecla = now; // Reinicia el contador del delay
        }
        actualizarVista();
    });  
});