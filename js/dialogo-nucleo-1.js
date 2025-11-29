document.addEventListener("DOMContentLoaded", () => {

var loopVisible = true;  

const cuadroDialogo = document.getElementById("loop-d");
const loopC = document.querySelector(".loop");
const nucleo2Des = document.getElementById("nucleo2");

let indiceD = 0;

const dialogosLoop = [
  "../Diseño/Loops/nucleo1d1.png",
  "../Diseño/Loops/nucleo1d2.png"
];

function renderDialogo() {    
    cuadroDialogo.src = dialogosLoop[indiceD]; 
    console.log("Diálogo mostrado: " + dialogosLoop[indiceD]);
}

setTimeout(() => {
    nucleo2.innerHTML = `<div><a href="Nucleo2.html">
      <img src="img/player-widget.png" alt="">
    </a></div>`;  
}, 5000);

// --- Mostrar el diálogo inicial si el loop está visible ---

  if (getComputedStyle(loopC).display === "block") {
    renderDialogo();
    loopVisible = true;

    document.addEventListener("keydown", (event) => {
      // CAMBIO: Ahora detecta la tecla "+" en lugar de "KeyZ"
      if (event.key === "+") {
        if (indiceD < dialogosLoop.length - 1){
          console.log("Presionaste +");
          indiceD++;
          renderDialogo();
          if (indiceD === 4) {
          loopC.style.display = "none";
          indiceD++;
          ultimoDialogo();
          loopVisible = false;
        }
        } else {
          loopC.style.display = "none";
          loopVisible = false;
        }
      }
    });
  } else {
    loopVisible = false;
  }

  // ========== CAMBIAR DIALOGO CON CLICK ==========

  //cuadroDialogo.addEventListener("click", () => {
  //indiceD++;
  //indiceLoop++;

  //if (indiceD < dialogosLoop.length) {
    //cuadroDialogo.textContent = dialogosLoop[indiceD];
    //imagenLoop.src = loopImagenes[indiceLoop];
    //} else {
    //cuadroDialogo.style.display = "none";
    //imagenLoop.style.display = "none";
    //Hacer cliockeable y accesible el nucleo 1 despues d que se clickeen todos los dialogos  
    //widgetClickeable();
    //}
  //});
});