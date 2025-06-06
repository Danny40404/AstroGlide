let spieler = document.querySelector(".player");
let main = document.querySelector(".main");
let spielerWidth = spieler.clientWidth;
let spielerHeight = spieler.clientHeight;
let topPos = 0;
let stepUp = 100;
let fallstep = 1;
let fallmulti = 1.05;
let maxFallSpeed = 10;
let springen = 20;
let isJumping = false;

let windowWidth = window.clientWidth;
let windowHeight = window.clientHeight;

let scoreContainer = document.querySelector(".score");
let scorePoints = scoreContainer.querySelector(".points");
let currentScore = 0;
let startScore = true;

let menu1 = document.querySelector(".start-screen");
let menu2 = document.querySelector(".end-screen");

let levels;
let random;
let profil;
let play = false;

let container = document.querySelector(".main");
let vorhandenePipes = main.querySelector(".pipes");
let containerHeight = container.clientHeight;
let footerHeight = containerHeight * 0.1;
let maxTop = containerHeight - footerHeight - spielerHeight;

let pipesInterval;
let fallInterval;
let moveInterval;
let kollissionInterval;
let scoreInterval;


menu2.classList.add("hidden");
startButton = menu1.querySelector(".play-button");
resetButton = menu2.querySelector(".reset-button");

if (!play) {
    startButton.addEventListener("click", function() {
        menu1.classList.add("hidden");
        play = true;
        fallInterval = setInterval(fall, (1000/60));
        pipesInterval = setInterval(pipes, 1500);
        moveInterval = setInterval(movePipes, (1000/60));
        kollissionInterval = setInterval(kollission, (1000/60));
        
        window.addEventListener("keydown", function(e) {
            if (play && e.code === "Space") {
                e.preventDefault();
                jump();
            }
        });

        window.addEventListener("mousedown", function(e) {
            if (play && e.button === 0) {
                jump();
            }
        });
    })
}

resetButton.addEventListener("click", function () {
    
    

    clearInterval(fallInterval);
    clearInterval(pipesInterval);
    clearInterval(moveInterval);
    
    scorePoints.innerHTML = 0;

    if (vorhandenePipes) {
        main.removeChild(vorhandenePipes[0]);
    }

    topPos = 0;
    fallstep = 1;
    play = true;
    spieler.style.top = topPos + "px";
    play = true;

    menu2.classList.add("hidden");

    fallInterval = setInterval(fall, 1000 / 60);
    pipesInterval = setInterval(pipes, 1500);
    moveInterval = setInterval(movePipes, (1000/60));
    kollissionInterval = setInterval(kollission, (1000/60));
});

function pipes() {
    let main = document.querySelector(".main");
    let vorhandenePipes = main.querySelectorAll(".pipes");
    
    if (play) {
        let pipes = document.createElement("div");
        let pipe1 = document.createElement("div");
        let pipe2 = document.createElement("div");

        if (vorhandenePipes.length > 4) {
            main.removeChild(vorhandenePipes[0]);
        }

        main.appendChild(pipes);
        pipes.appendChild(pipe1);
        pipes.appendChild(pipe2);
        pipes.classList.add("pipes");
        pipe1.classList.add("pipe-top");
        pipe2.classList.add("pipe-bottom");

        random = Math.floor(Math.random() * 6);

        switch (random) {
            case 0:
                profil = "profil-0";
                break;
            case 1:
                profil = "profil-1";        
                break;
            case 2:
                profil = "profil-2";        
                break;
            case 3:
                profil = "profil-3";        
                break;
            case 4:
                profil = "profil-4";        
                break;
            case 5:
                profil = "profil-5";        
                break;
        }

        pipes.classList.add(profil);
    } else {
        vorhandenePipes.forEach(pipe => {
            main.removeChild(pipe);
        });
    }
};

function fall() {
    if (topPos >= maxTop) {
        console.log("Game Over");
        clearInterval(fallInterval);
        clearInterval(moveInterval);
        play = false;
        menu2.classList.remove("hidden");
    } else {
        fallstep = Math.min(fallstep * fallmulti, maxFallSpeed);
        topPos += fallstep;
        spieler.style.top = topPos + "px";
    }
}

function jump() {
    fallstep = 1;

    topPos -= stepUp;
    if (topPos < 0) {
        topPos = 0;
    }

    spieler.style.top = topPos + "px";
}

function movePipes() {
    let main = document.querySelector(".main");
    let vorhandenePipes = main.querySelectorAll(".pipes");
    vorhandenePipes = Array.from(vorhandenePipes);

    vorhandenePipes.forEach(pipe => {
        let pipeRight = parseFloat(pipe.style.right || 0);
        pipeRight = pipeRight + 0.66;
        pipe.style.right = pipeRight + "%";
    });
}

function kollission() {
    let main = document.querySelector(".main");
    let vorhandenePipes = main.querySelectorAll(".pipes");
    spielerBox = spieler.getBoundingClientRect();
    footerBox = document.querySelector(".footer").getBoundingClientRect();
    vorhandenePipes = Array.from(vorhandenePipes);
    
    vorhandenePipes.forEach(pipe => {
        let pipeTop = pipe.querySelector(".pipe-top");
        let pipeBottom = pipe.querySelector(".pipe-bottom");
        let pipeTopBox = pipeTop.getBoundingClientRect();
        let pipeBottomBox = pipeBottom.getBoundingClientRect();

        if (isColliding(spielerBox, pipeTopBox) || isColliding(spielerBox, pipeBottomBox) || isColliding(spielerBox, footerBox)) {
            play = false;
            clearInterval(fallInterval);
            clearInterval(moveInterval);
            clearInterval(kollissionInterval);
            menu2.classList.remove("hidden");
        }

        if (isColliding(spielerBox, pipe.getBoundingClientRect()) && (!isColliding(spielerBox, pipeTopBox) && !isColliding(spielerBox, pipeBottomBox) && !isColliding(spielerBox, footerBox))) {
            score(1);
        }
    });

}

function isColliding(a, b) {
    const c1 = a;
    const c2 = b;
        return !(
        c1.right  < c2.left  ||
        c1.left   > c2.right ||
        c1.bottom < c2.top   ||
        c1.top    > c2.bottom
    );
}

function score(a) {
    if (!play) return;

    if (startScore === true) {
        currentScore += a;
    }
    
    scorePoints.innerHTML = currentScore;
}