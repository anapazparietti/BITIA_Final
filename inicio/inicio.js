document.addEventListener("DOMContentLoaded", function() {

const startButton = document.querySelector(".btn-start img");
const startContainer = document.querySelector(".start");
const loaderContainer = document.querySelector(".loader");

    window.addEventListener("keydown", (event) => {
        if (event.defaultPrevented) return;
        if (event.code === "KeyZ"|| event.code === "Equal" || event.code === "NumpadAdd") {
            console.log("Start button pressed");
            startButton.src = "btn-pressed.jpg";//cambia la imagen al estado presionado
            setTimeout(() => {
            startContainer.style.display = "none";
            loaderContainer.style.display = "block";
                setTimeout(() => {
                    //ACÁ TENES QUE CAMBIAR LA RUTA AL NUCLEO1
                window.location.href = "nucleo1.html";
                }, 1000);//supuestamente es el tiempo que tarda en cargar el nucleo1
            }, 1000);//tiempo que el boton se ve presionado
      }
    });
});