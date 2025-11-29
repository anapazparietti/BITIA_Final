var loopIsVisible = true;

// Mostrar el valor de loopIsVisible cada segundo
setInterval(() => {
  console.log("loopIsVisible:", loopIsVisible);
  if(typeof enCancionApp !== 'undefined') {
      console.log("enCancionApp:", enCancionApp);
  }
}, 1000);

document.addEventListener("DOMContentLoaded", () => {

  const cuadro = document.getElementById("dialogo");
  const loop = document.querySelector(".loop");
  const nucleo3 = document.getElementById("nucleo3");

  let indice = 0;
  
  const dialogos = [
    "img/nucleo-2/dialogoN2-0.png",
    "img/nucleo-2/dialogoN2-1.png",
    "img/nucleo-2/dialogoN2-2.png",
    "img/nucleo-2/dialogoN2-3.png",
    "img/nucleo-2/dialogoN2-4.png",
  ];

  function renderDialogo() {
    cuadro.src = dialogos[indice];
    console.log("Diálogo mostrado: " + dialogos[indice]);
  }

  // ---  Función para pausar todos los videos si loopIsVisible === true ---
  function pauseVideosIfLoopVisible() {
    if (loopIsVisible) {
      const songVideo = document.getElementById("canciones-video");
      const demandaVideo = document.getElementById("demandas-video");

      if (songVideo && !songVideo.paused) {
        songVideo.pause();
        console.log("⏸ Video de canciones pausado por loopIsVisible");
      }
      if (demandaVideo && !demandaVideo.paused) {
        demandaVideo.pause();
        console.log("⏸ Video de demandas pausado por loopIsVisible");
      }
    }
  }

  // --- Mostrar el diálogo inicial si el loop está visible ---
  if (getComputedStyle(loop).display === "block") {
    renderDialogo();
    loopIsVisible = true;
    pauseVideosIfLoopVisible();

    document.addEventListener("keydown", (event) => {
      // CAMBIO: Ahora detecta la tecla "+" en lugar de "KeyZ"
      if (event.key === "+") {
        if (indice < dialogos.length - 1) {
          console.log("Presionaste +");
          indice++;
          renderDialogo();
          if (indice === 4) {
          loop.style.display = "none";
          indice++;
          ultimoDialogo();
          loopIsVisible = false;
        }
        } else {
          loop.style.display = "none";
          loopIsVisible = false;
        }
      }
    });
  } else {
    loopIsVisible = false;
  }

function ultimoDialogo() {
  console.log("El último diálogo se muestra después de 30 segundos");
  setTimeout(() => {
    indice = dialogos.length - 1;  // ✔ fijar índice correcto
    loop.style.display = "block";
    nucleo3.innerHTML = `<div><a href="Nucleo3.html">
      <img src="img/nucleo3-desbloqueado.png" alt="">
    </a></div>`;

    renderDialogo(); // ahora sí muestra dialogoN2-4.png
    console.log("Se muestra el último diálogo.");
    loopIsVisible = true;
    pauseVideosIfLoopVisible();
  }, 30000);
}


  // --- MutationObserver: detectar si aparece un nuevo video de demandas ---
  const observer = new MutationObserver(() => {
    pauseVideosIfLoopVisible();
  });
  observer.observe(document.body, { childList: true, subtree: true });

});