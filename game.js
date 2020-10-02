
document.addEventListener('DOMContentLoaded', () => {
    var firebaseConfig = {
        apiKey: "AIzaSyBYjs7NE0_jZFOWol1E75ZI9LDSDnZgwCo",
        authDomain: "flappybird472.firebaseapp.com",
        databaseURL: "https://flappybird472.firebaseio.com",
        projectId: "flappybird472",
        storageBucket: "flappybird472.appspot.com",
        messagingSenderId: "627712015956",
        appId: "1:627712015956:web:62391b763cd5ed76e1b7c1",
        measurementId: "G-QVP27J8SZQ"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    var database = firebase.database();

    const bird = document.querySelector('.birdImg');
    const display = document.querySelector('.game-container');

    let birdLeft = 220;
    let birdBottom = 100;
    let gravity = 1;
    let isGameOver = false;
    let score = 0;
    let highScore = 0;
    database.ref("sharedHighScore").on("value", function (snapshot) {
        highScore = snapshot.val();
    });

    function updateGame() {
        birdBottom -= gravity;
        bird.style.bottom = birdBottom + 'px';
        bird.style.left = birdLeft + 'px';
        if (birdBottom <= -30)
            gameOver();
    }
    let gameTimer = setInterval(updateGame, 10);
    let pipeTimer = setInterval(generatePipe, 3000);

    function controller(e) {
        if (!isGameOver && e.keyCode === 32) {
            jump();
        }
        if (isGameOver && e.keyCode === 82) {
            resetGame();
        }
    }

    function resetGame() {
        score = 0;
        $("#gameOver").hide();
        $(".birdImg").css({ 'transform': 'rotate(' + 0 + 'deg)' });
        isGameOver = false;
        birdBottom = 100;
        gameTimer = setInterval(updateGame, 10);
        pipeTimer = setInterval(generatePipe, 3000);
        console.log("reset game");
    }

    function jump() {
        if (birdBottom < 500) birdBottom += 50;
        bird.style.bottom = birdBottom + 'px';
        // function rotate(degree) {
        //     $(".birdImg").css({ 'transform': 'rotate(' + (degree) + 'deg)' });
        // }
        // rotate(-30);
        // setInterval(rotate(0), 2000);
    }
    document.addEventListener('keyup', controller);


    function generatePipe() {
        let pipeLeft = 500;
        let randHeight = Math.random() * 90;
        let pipeBottom = randHeight;
        let gap = 450;
        const pipe = document.createElement('div');
        const topPipe = document.createElement('div');
        if (!isGameOver) {
            pipe.classList.add('pipe');
            topPipe.classList.add('topPipe');
        }
        display.appendChild(pipe);
        display.appendChild(topPipe);
        pipe.style.left = pipeLeft + 'px';
        topPipe.style.left = pipeLeft + "px";
        pipe.style.bottom = pipeBottom + 'px';
        topPipe.style.bottom = pipeBottom + gap + 'px';

        if (!isGameOver) {
            updateScore();
        }

        function movePipe() {
            pipeLeft -= 2;
            pipe.style.left = pipeLeft + 'px';
            topPipe.style.left = pipeLeft + 'px';

            if (pipeLeft === -60) {
                clearInterval(timer);
                display.removeChild(pipe);
                display.removeChild(topPipe);
            }
            if ((pipeLeft > 200 && pipeLeft < 280 && birdLeft === 220 && (birdBottom < pipeBottom + 115 || birdBottom > pipeBottom + gap - 225)) || birdBottom <= -30) {
                console.log("collision detected");
                console.log("Bird position: " + birdLeft + ", " + birdBottom);
                console.log("Pipe position: " + pipe.style.left + ", " + pipe.style.bottom);
                console.log("Top pipe position: " + topPipe.style.left + ", " + topPipe.style.bottom);
                if (display.contains(pipe) && display.contains(topPipe)) {
                    display.removeChild(pipe);
                    display.removeChild(topPipe);
                }
                gameOver();
                clearInterval(timer);
            }
        }
        let timer;
        if (!isGameOver) timer = setInterval(movePipe, 20);
    }
    function gameOver() {
        console.log("Game over");
        $("#gameOver").show();
        $(".birdImg").css({ 'transform': 'rotate(' + (-90) + 'deg)' });
        clearInterval(gameTimer);
        clearInterval(pipeTimer);
        isGameOver = true;
        
    }

    function updateScore() {
        document.getElementById("gameScore").innerHTML = "Score: " + score;
        document.getElementById("highScore").innerHTML = "High Score: " + highScore;
        if (score > highScore) {
            database.ref("sharedHighScore").set(score);
            highScore += 10;
        }
        score += 10;
    }
});
