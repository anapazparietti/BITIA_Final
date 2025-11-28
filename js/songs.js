document.addEventListener("DOMContentLoaded", () => { 

    const songVideo = document.getElementById("canciones-video"); //HTMLVideoElement

    const songBtn = document.querySelectorAll(".song"); 
    
    const infoSong = document.querySelectorAll(".hide-msj");

    const selectedStyle = [ 
        {img1: "img/dust.png", img2: "img/dust-selected.png", video: "video/dustontheWind.mp4"}, 
        {img1: "img/rumbaCongo.png", img2: "img/rumbaCongo-selected.png", video: "video/rumbaCongo.mp4"},
        {img1: "img/heart.png", img2: "img/heart-selected.png", video: "video/heart.mp4"}, 
        {img1: "img/nostalgia.png", img2: "img/nostalgia-selected.png", video: "video/nostalgia.mp4"},
        {img1: "img/pasarella.png", img2: "img/pasarella-selected.png", video: "video/pasarella.mp4"} 
    ];

    //como el video no es un arreglo se hace una función para cambiar el src del video sin que se rompa el código
    function renderVideo(index){
        if(!songVideo) return; //!songVideo comprueba si la variable es null, undefined o falsy.
        songVideo.src = selectedStyle[index].video;
        songVideo.style.display = "block";

        // reload the media and autoplay
        if (typeof songVideo.load === "function"){ //Esta línea comprueba si el elemento tiene un método load.
            songVideo.load();
        }
        songVideo.play().catch(() => {/* autoplay might be blocked by browser */});
    }

    function resetVideo(){
        if(!songVideo) return;
        songVideo.pause();
        songVideo.currentTime = 0; // Reset playback position to the start
        songVideo.style.display = "none";
        songVideo.src = "";
    }

    // comprobar que no haya otra canción seleccionada y cambiar el estilo en ser necesario
    let selectedIndex = 0; // índice actual seleccionado (A y S lo cambian)
    let activeIndex = null; // índice actualmente confirmado (Digit1)
    let isVisible = false; // Variable global que indica si hay una canción visible

    // ---- NUEVO: función que actualiza visualmente la selección (solo imagen)
    function updateSelection(){
        songBtn.forEach((btn, i) => {
            btn.src = (i === selectedIndex) ? selectedStyle[i].img2 : selectedStyle[i].img1;
        });
    }

    // ---- NUEVO: función que confirma la selección (muestra info y video)
    function confirmSelection(){
        if(typeof loopIsVisible !== 'undefined' && loopIsVisible) return; // Validación de seguridad si loopIsVisible existe

        // Si la canción seleccionada ya está activa, pausa/reproduce
        if(activeIndex === selectedIndex && isVisible && (typeof enCancionApp !== 'undefined' ? enCancionApp : true)){
            if(songVideo.paused){
                songVideo.play();
            } else {
                songVideo.pause();
            }
            return;
        }

        // Cierra la anterior si hay una
        closeActiveSong();

        // Abre la nueva
        infoSong[selectedIndex].style.display = "block";
        renderVideo(selectedIndex);
        activeIndex = selectedIndex;
        isVisible = true;
    }

    // ejecutar el else de styleChange al cambiar de categoría ---
    const copyright = document.getElementById("copyright");
    const demandas = document.getElementById("demandas");

    function closeActiveSong() {
        // si hay una canción activa, ejecutar el "else" de styleChange
        if (activeIndex !== null) {
            infoSong[activeIndex].style.display = "none"; 
            songBtn[activeIndex].src = `${selectedStyle[activeIndex].img1}`;
            resetVideo(); 

            // limpia las referencias
            activeIndex = null;
            isVisible = false;
        } else{
            return;
        }
    }

    // Cada vez que cambies de categoría, se cierra cualquier canción abierta
    if (copyright)
        copyright.addEventListener("click", closeActiveSong);
    if (demandas)
        demandas.addEventListener("click", closeActiveSong);

    // ---- EVENTOS DE CLICK (mantienen compatibilidad con el mouse)
    songBtn.forEach((song, i) => {
        song.addEventListener("click", () => {
            selectedIndex = i;
            updateSelection();
            confirmSelection();
        });
    });

    //---------TECLADO--------
    window.addEventListener("keydown", (event)=>{
        if(event.defaultPrevented){ return; }
        
        // CAMBIO IMPORTANTE: Usamos event.key para detectar el valor de la tecla ('-', '8', '0')
        switch(event.key){
            
            case "-": // Antes era "Digit1" (Tecla 1)
                console.log("- pressed (Confirmar)");
                if(typeof enCancionApp !== 'undefined' && enCancionApp){
                    console.log(enCancionApp);
                    updateSelection();
                    confirmSelection();
                } else { return; }
                break;

            case "8": // Antes era "KeyA" (Anterior)
                // Chequeo de variables globales antes de ejecutar
                if((typeof loopIsVisible === 'undefined' || !loopIsVisible) && (typeof enCancionApp !== 'undefined' && enCancionApp)){
                    console.log("8 pressed (Anterior)");
                    selectedIndex = (selectedIndex - 1 + songBtn.length) % songBtn.length;
                    updateSelection();
                    closeActiveSong(); // cierra si hay una abierta
                }
                break;

            case "0": // Antes era "KeyS" (Siguiente)
                if((typeof loopIsVisible === 'undefined' || !loopIsVisible) && (typeof enCancionApp !== 'undefined' && enCancionApp)){
                    console.log("0 pressed (Siguiente)");
                    
                    if (window.resetSongSelection) {
                        selectedIndex = 0;
                        window.resetSongSelection = false;
                    } else {
                        selectedIndex = (selectedIndex + 1) % songBtn.length;
                    }

                    console.log(selectedIndex-1);
                    updateSelection();
                    closeActiveSong(); // cierra si hay una abierta
                }
                break;
        }
    });

    window.closeActiveSong = closeActiveSong; // para acceso externo (btn.js)

});
