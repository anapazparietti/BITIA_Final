const dialogos = [
  "Primero comenzaremos aprendiendo sobre la evolución de la música hasta la creación de la IA",
  "Utilizá el scroll para desplazarte !Buena suerte¡"
];

var loopImagenes=Array("../img/loop-feliz.png","../img/loop.png");

const cuadroDialogo = document.getElementById("loop-d");
var imagenLoop = document.querySelector(".loop-img");

let indiceD = 0;
var indiceLoop = 0;

cuadroDialogo.style.display = 'block';
imagenLoop.style.display ='block';
console.log("Loop hablaaaa");

  
  //PROBAR PONER ESTO EN EL CODIGO SI ES QUE LLEGA A FALLAR, YA QUE DE LA MANERA EN QUE ESTÁ AHORA, SE ESCUCHA A LA Z EN TODA LA PAGINA, LO QUE SI BIEN FACILITA PASAR LOS DIALOGOS DE LOOP, PUEDE ENTRAR EN CONFLICTO CON EL CODIGO DE ANA Y NACHO
  //cuadroDialogo.tabIndex = 0;
  //cuadroDialogo.focus();

  //cuadroDialogo.addEventListener('keydown', (e) => { etc, etc, etc.

  document.addEventListener('keydown', (e) => {
  if (e.key === 'z' || e.key === 'Z') {
    indiceD++;
    indiceLoop++;

    if (indiceD < dialogos.length) {
      cuadroDialogo.textContent = dialogos[indiceD];
      imagenLoop.src = loopImagenes[indiceLoop];
    } else {
      cuadroDialogo.style.display = "none";
      imagenLoop.style.display = "none";
      widgetClickeable();
    }
  }
});

  // ========== CAMBIAR DIALOGO CON CLICK ==========

  //cuadroDialogo.addEventListener("click", () => {
  //indiceD++;
  //indiceLoop++;

  //if (indiceD < dialogos.length) {
    //cuadroDialogo.textContent = dialogos[indiceD];
    //imagenLoop.src = loopImagenes[indiceLoop];
    //} else {
    //cuadroDialogo.style.display = "none";
    //imagenLoop.style.display = "none";
    //Hacer cliockeable y accesible el nucleo 1 despues d que se clickeen todos los dialogos  
    //widgetClickeable();
    //}
  //});