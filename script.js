(function() {
    const originalgetBoundingClientRect = Element.prototype.getBoundingClientRect;
    Object.defineProperty(Element.prototype, "getBoundingClientRect", {
        value: originalgetBoundingClientRect, configurable: false, writable: false
    })

    const topArray = ["45%", "40%", "55%", "35%", "25%", "60%"];
    const bottomArray = ["55%", "60%", "45%", "65%", "75%", "40%"];
    const className = "profil-6";
    let spieler = document.querySelector(".player");
    let spielerHeight = spieler.clientHeight;
    let topPos = 0;
    let stepUp = 100;
    let fallstep = 1;
    let fallmulti = 1.05;
    let maxFallSpeed = 15;
    let windowWidth = window.innerWidth;

    let scoreContainer = document.querySelector(".score");
    let scorePoints = scoreContainer.querySelector(".points");
    let currentScore = 0;
    let startScore = true;

    let menu1 = document.querySelector(".start-screen");
    let menu2 = document.querySelector(".end-screen");
    let menu3 = document.querySelector(".ranglist-screen");
    let openMenu = null;

    let random;
    let profil;
    let play = false;
    let send = true;

    let container = document.querySelector(".main");
    let containerHeight = container.clientHeight;
    let footerHeight = containerHeight * 0.1;
    let maxTop = containerHeight - footerHeight - spielerHeight;

    spieler.style.top = containerHeight / 2 + "px";
    let speed = 3;
    let pipesInterval;
    let pipesDelay = 2500;
    let maxPipesDelay = pipesDelay / 2;
    let reducePipesDelay = 0;
    let fallInterval;
    let moveInterval;
    let kollissionInterval;
    let lastPipe = 0;
    let path = "/AstroGlide/";

    menu2.classList.add("hidden");
    menu3.classList.add("hidden");

    let startButton = menu1.querySelector(".play-button");
    let restartButton = document.querySelector(".restart-button");
    let ranglistButton = document.querySelectorAll(".ranglist-button");
    let closeButton = document.querySelector(".close-button");
    let saveButton = document.querySelector(".save-button");
    let inputDescription = document.querySelector(".input-description");

    if (!play) {
        startButton.addEventListener("click", function() {
            menu1.classList.add("hidden");
            menu3.classList.add("hidden");

            play = true;
            currentScore = 0;
            fallInterval = setInterval(fall, (1000/60));
            pipesInterval = setInterval(pipes, (1000/60));
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

            window.addEventListener("touchstart", function(e) {
                if (play) {
                    e.preventDefault();
                    jump();
                }
            }, { passive: false });
        })
    }
    
    function refreshPlayer() {
        topPos = containerHeight / 2;
        spieler.style.top = topPos + "px";
    }

    restartButton.addEventListener("click", function () {
        clearInterval(fallInterval);
        clearInterval(pipesInterval);
        clearInterval(moveInterval);
        refreshPlayer();

        scorePoints.innerHTML = 0;
        currentScore = 0;

        let vorhandenePipes = document.querySelectorAll(".pipes");
        vorhandenePipes.forEach(pipe => pipe.remove());

        fallstep = 1;
        speed = 3;
        play = true;
        send = true;

        spieler.classList.remove("fly-away");
        menu2.classList.add("hidden");
        scoreContainer.classList.remove("hidden");

        fallInterval = setInterval(fall, 1000 / 60);
        pipesInterval = setInterval(pipes, pipesDelay);
        moveInterval = setInterval(movePipes, (1000/60));
        kollissionInterval = setInterval(kollission, (1000/60));

        const messageElement = document.querySelector(".save-message");
        messageElement.textContent = "";
        messageElement.classList.remove("success", "error");
        messageElement.classList.add("hidden");
        inputDescription.classList.remove("hidden");

        updateScoreBoard();
    });

    ranglistButton.forEach(button => {
        button.addEventListener("click", function () {
            if (!menu1.classList.contains("hidden")) {
                openMenu = 'start';
            } else {
                openMenu = 'end';
            }

            menu1.classList.add("hidden");
            menu2.classList.add("hidden");
            menu3.classList.remove("hidden");
        });
    });

    closeButton.addEventListener("click", function () {  
        menu3.classList.add("hidden");

        if (openMenu === 'start') {
            menu1.classList.remove("hidden");
        } else if (openMenu === 'end') {
            menu2.classList.remove("hidden");
        }
        
        openMenu = null;
    })
    
    saveButton.addEventListener("click", function () {
        if (!play && send) {
            let punkte = currentScore;
            let name = document.querySelector("#player-name").value;
            const messageElement = document.querySelector(".save-message");

            messageElement.classList.remove("success", "error");
            messageElement.classList.add("hidden");
            inputDescription.classList.add("hidden");

            if (name.trim() === "") {
                messageElement.textContent = "Bitte einen Namen eingeben.";
                messageElement.classList.add("error");
                messageElement.classList.remove("hidden");
                return;
            } 
            else{
                sendeScore(name, punkte);
            }
        }
    })

    function pipes() {
        if (!play) return;

        let main = document.querySelector(".main");
        let vorhandenePipes = main.querySelectorAll(".pipes");

        let now = Date.now();
        let elapsed = now - lastPipe;

        if (elapsed >= pipesDelay) {
            if (vorhandenePipes.length > 4) {
                main.removeChild(vorhandenePipes[0]);
            }

            let pipes = document.createElement("div");
            let pipe1 = document.createElement("div");
            let pipe2 = document.createElement("div");

            pipes.classList.add("pipes");
            pipe1.classList.add("pipe-top");
            pipe2.classList.add("pipe-bottom");
            
            random = Math.floor(Math.random() * 6);
            pipes.classList.add("profil-" + random);

            pipe1.style.height = topArray[random];
            pipe2.style.height = bottomArray[random];

            pipes.appendChild(pipe1);
            pipes.appendChild(pipe2);
            main.appendChild(pipes);

            lastPipe = now;
        }
    }

    function fall() {
        if (topPos >= maxTop) {
            clearInterval(fallInterval);
            clearInterval(moveInterval);
            clearInterval(pipesDelay);
            clearInterval(reducePipesDelay);
            play = false;
            spieler.classList.add("fly-away");
            document.querySelector(".end-score .points").textContent = currentScore;
            menu2.classList.remove("hidden");
            scoreContainer.classList.add("hidden");
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

        if (Element.prototype.getBoundingClientRect !== originalgetBoundingClientRect) {
            location.reload;
        }

        vorhandenePipes.forEach(pipe => {
            let pipeRight = parseFloat(pipe.style.right || 0);
            pipeRight = pipeRight + speed;
            pipe.style.right = pipeRight + "px";

            var pipeTop = pipe.querySelector(".pipe-top");
            var pipeBottom = pipe.querySelector(".pipe-bottom");
            var value = (pipe.classList.value);
            value = parseInt(value.replace(/\D+/, ""));

            if (value > topArray[topArray.length - 1] && value > bottomArray[bottomArray.length - 1]) {
                pipe.remove();
            } else {
                if (pipeTop.style.height != topArray[value] || pipeBottom.style.height != bottomArray[value]) {
                    pipe.remove();
                    location.reload();
                }
            }
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
                clearInterval(pipesDelay);
                clearInterval(reducePipesDelay);
                spieler.classList.add("fly-away");
                document.querySelector(".end-score .points").textContent = currentScore;
                menu2.classList.remove("hidden");
                scoreContainer.classList.add("hidden");
            }
            
            if (isColliding(spielerBox, pipe.getBoundingClientRect()) && (!isColliding(spielerBox, pipeTopBox) && !isColliding(spielerBox, pipeBottomBox) && !isColliding(spielerBox, footerBox))) {
                score(1);
                level(0.04);
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

    function level(scoreValue) {
        speed += scoreValue;
        pipesDelay = Math.max(maxPipesDelay, pipesDelay - scoreValue * 150);
    }

    function createStars(starCount = 50) {
        const main = document.querySelector('.main');
        let maxStarSize;

        if (windowWidth < 768) {
            maxStarSize = 0.7;
        } else if (windowWidth < 1200) {
            maxStarSize = 0.4;
        } else {
            maxStarSize = 0.15;
        }

        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.classList.add('star');

            const size = Math.random() * (maxStarSize - 0.5) + 0.5;
            star.style.width = size + 'vw';
            star.style.height = size + 'vw';
            star.style.top = Math.random() * 100 + '%';
            star.style.left = Math.random() * 100 + '%';
            star.style.opacity = Math.random() * 0.5 + 0.5;
            star.style.animationDelay = (Math.random() * 3) + 's';
            star.style.boxShadow = `0 0 ${size * 2}vw white`;

            main.appendChild(star);
        }
    }

    function scoreBoard() {
        $.ajax({
            type: "get",
            url: path + "data.php",
            success: function (response) {
                response.forEach(element => {
                    li = document.createElement("li");
                    pName = document.createElement("p");
                    pPoints = document.createElement("p");

                    pName.classList.add("name");
                    pPoints.classList.add("points");

                    pName.innerHTML = element["Name"];
                    pPoints.innerHTML = element["Score"];

                    if (element["Score"] > 0) {
                        li.appendChild(pName);
                        li.appendChild(pPoints);
                        document.querySelector(".ranglist").appendChild(li);
                    }
                });
            }
        });    
    }

    function updateScoreBoard() {
        ranglist = document.querySelector(".ranglist").querySelectorAll("li");
        ranglist = Array.from(ranglist);
        ranglist.forEach(element => {
            element.remove();
        });

        scoreBoard();
    }

    function balanceGame() {
        let newPipesDelay = (100 / 1024 * windowWidth) / 100 * pipesDelay;
    }

    function sendeScore(name, punkte) {
        const data = {
            dataname: name,
            datapunkte: punkte,
            datamaxfallspeed: maxFallSpeed
        };

        $.ajax({
            url: '/AstroGlide/data.php',
            method: 'POST',
            data: data,
            success: function(response) {
                const messageElement = document.querySelector(".save-message");
                try {
                    const res = typeof response === "string" ? JSON.parse(response) : response;

                    if (res.status === "error") {
                        messageElement.textContent = res.message;
                        messageElement.classList.add("error");
                        messageElement.classList.remove("hidden");
                        return false;
                    } else {
                        messageElement.textContent = res.message;
                        messageElement.classList.add("success");
                        messageElement.classList.remove("hidden");
                        send = false;
                    return;
                        return true;
                    }
                } catch (e) {
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
            }
        });
    }

    $(window).resize(function () { 
        windowWidth = window.innerWidth;
        containerHeight = container.clientHeight;
        spielerHeight = spieler.clientHeight;
        footerHeight = containerHeight * 0.1;
        maxTop = containerHeight - footerHeight - spielerHeight;
        refreshPlayer();
    });

    balanceGame();
    createStars(70);
    scoreBoard();

})();