let windowWidth = window.clientWidth;
let windowHeight = window.clientHeight;

let spieler = document.querySelector(".player");
let main = document.querySelector(".main");
let spielerWidth = spieler.clientWidth;
let spielerHeight = spieler.clientHeight;
let topPos = 0;
let stepUp = 100;
let fallstep = 1;
let fallmulti = 1.05;
let maxFallSpeed = 15;
let springen = 20;
let isJumping = false;

let scoreContainer = document.querySelector(".score");
let scorePoints = scoreContainer.querySelector(".points");
let currentScore = 0;
let startScore = true;

let menu1 = document.querySelector(".start-screen");
let menu2 = document.querySelector(".end-screen");
let menu3 = document.querySelector(".ranglist-screen");

let levels;
let random;
let profil;
let play = false;

let container = document.querySelector(".main");
let vorhandenePipes = main.querySelector(".pipes");
let containerHeight = container.clientHeight;
let footerHeight = containerHeight * 0.1;
let maxTop = containerHeight - footerHeight - spielerHeight;

spieler.style.top = containerHeight / 2 + "px";
speed = 0.33;
let pipesInterval;
let fallInterval;
let moveInterval;
let kollissionInterval;
let scoreInterval;

menu2.classList.add("hidden");
menu3.classList.add("hidden");

startButton = menu1.querySelector(".play-button");
let restartButton = document.querySelector(".restart-button");
ranglistButton = document.querySelector(".ranglist-button");

if (!play) {
    startButton.addEventListener("click", function() {
        menu1.classList.add("hidden");
        menu3.classList.add("hidden");

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

restartButton.addEventListener("click", function () {
    clearInterval(fallInterval);
    clearInterval(pipesInterval);
    clearInterval(moveInterval);
    
    scorePoints.innerHTML = 0;
    currentScore = 0;

    let vorhandenePipes = document.querySelectorAll(".pipes");
    vorhandenePipes.forEach(pipe => pipe.remove());

    topPos = containerHeight / 2;
    spieler.style.top = topPos + "px";
    fallstep = 1;
    play = true;

    menu2.classList.add("hidden");

    fallInterval = setInterval(fall, 1000 / 60);
    pipesInterval = setInterval(pipes, 1500);
    moveInterval = setInterval(movePipes, (1000/60));
    kollissionInterval = setInterval(kollission, (1000/60));
});

ranglistButton.addEventListener("click", function () {
    menu1.classList.add("hidden");
    menu2.classList.add("hidden");
    menu3.classList.remove("hidden");
});

function pipes() {
    let main = document.querySelector(".main");
    let vorhandenePipes = main.querySelectorAll(".pipes");
    
    if (play) {
        let pipes = document.createElement("div");
        let pipe1 = document.createElement("div");
        let pipe2 = document.createElement("div");
        let pipe3 = document.createElement("div");
        let pipe4 = document.createElement("div");

        if (vorhandenePipes.length > 4) {
            main.removeChild(vorhandenePipes[0]);
        }

        main.appendChild(pipes);
        pipes.appendChild(pipe1);
        pipes.appendChild(pipe2);
        pipe1.appendChild(pipe3);
        pipe2.appendChild(pipe4);

        pipes.classList.add("pipes");
        pipe1.classList.add("pipe-top");
        pipe2.classList.add("pipe-bottom");
        pipe3.classList.add("pipe-lip");
        pipe4.classList.add("pipe-lip");

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
        pipeRight = pipeRight + speed;
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
    level(currentScore);
}

function level(currentScore) {
    speed = 0.33 * (currentScore / 100 + 1);
}

function createStars(starCount = 50) {
    const main = document.querySelector('.main');

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');

        // Größe zufällig 2 bis 5 px
        const size = Math.random() * 3 + 2;
        star.style.width = size + 'px';
        star.style.height = size + 'px';

        // Position zufällig (in Prozent)
        star.style.top = Math.random() * 100 + '%';
        star.style.left = Math.random() * 100 + '%';

        // Animationsverzögerung zufällig (damit Sterne nicht synchron flackern)
        star.style.animationDelay = (Math.random() * 3) + 's';

        main.appendChild(star);
    }
}

createStars(70);