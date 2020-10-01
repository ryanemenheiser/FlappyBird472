
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
    let bulletCount = 0;
    //let lock = false;
    let score = 0;
    let highScore = 0;
    database.ref("sharedHighScore").on("value", function (snapshot) {
        highScore = snapshot.val();
    });

    function updateGame() {
        birdBottom -= gravity;
        bird.style.bottom = birdBottom + 'px';
        bird.style.left = birdLeft + 'px';
        //bulletCollisionDetect();
        //updateBullets();
    }
    let gameTimer = setInterval(updateGame, 10);

    function controller(e) {
        if (e.keyCode === 32) {
            jump();
        }
        // if (e.keyCode === 70) {
        //     //lock = true;
        //     let xloc = parseFloat(bird.style.left);
        //     let yloc = parseFloat(bird.style.bottom);
        //     //console.log("BOTTOM: " + yloc);
        //     //console.log("bird: " + xloc + ", " + yloc);
        //     fireBullet(xloc, yloc, bulletCount);
        //     // setTimeout(function () {
        //     //     lock = false;
        //     // }, 250);
        //     console.log("shooting");
        // }
    }

    function jump() {
        if (birdBottom < 500) birdBottom += 50;
        bird.style.bottom = birdBottom + 'px';
        //console.log(birdBottom);
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

        //add walls to pipe
        // let wallLeft = 500;
        // let wallBottom = randHeight + 300;
        // const wall = document.createElement('div');
        // if (!isGameOver) wall.classList.add('wall');
        // display.appendChild(wall);
        // wall.style.left = wallLeft + 'px';
        // wall.style.bottom = wallBottom + 'px';
        if (!isGameOver) {
            updateScore();
        }


        function movePipe() {
            pipeLeft -= 2;
            // wallLeft -= 2;
            pipe.style.left = pipeLeft + 'px';
            // wall.style.left = wallLeft + 'px';
            topPipe.style.left = pipeLeft + 'px';

            if (pipeLeft === -60) {
                clearInterval(timer);
                display.removeChild(pipe);
                // display.removeChild(wall);
                display.removeChild(topPipe)
            }
            if (
                pipeLeft > 200 && pipeLeft < 280 && birdLeft === 220 && (birdBottom < pipeBottom + 115 || birdBottom > pipeBottom + gap - 225) || birdBottom === -30) {
                gameOver();
                clearInterval(timer);
            }
        }
        let timer = setInterval(movePipe, 20);
        if (!isGameOver) setTimeout(generatePipe, 3000);
    }
    generatePipe();


    function gameOver() {
        clearInterval(gameTimer);
        isGameOver = true;
        document.removeEventListener('keyup', controller);
    }

    function fireBullet(x, y, num) {
        bulletCount++;
        let bul_img = `<img id=${num} class='bullet' src='assets/bullet.png' style='left: ${x +
            60}px; bottom: ${y}px; width: ${16}px; height: ${40}px; transform: rotate(90deg);'>`;
        document.getElementById("bulletListDiv").innerHTML += bul_img;
    }

    function updateBullets() {
        let bList = document.getElementsByClassName("bullet");
        for (let bullet of bList) {
            let bullet_x = parseFloat(bullet.style.left);
            let bullet_y = parseFloat(bullet.style.bottom);
            bullet_x += 5;
            //bullet_y += 0;
            bullet.style.left = bullet_x + "px";
            bullet.style.bottom = bullet_y + "px";
            // console.log("bird: " + birdLeft + ", " + birdBottom);
            // console.log("bullet: " + bullet_x + ", " + bullet_y);
            if (
                bullet_x > 500 ||
                bullet_y < 0 ||
                bullet_y > 730 ||
                bullet_y < 0
            ) {
                bullet.remove();
            }
        }
    }

    //doesn't work
    function bulletCollisionDetect() {
        // let wallList = document.getElementsByClassName("wall");
        // for (let wall of wallList) {
        //     let bList = document.getElementsByClassName("bullet");
        //     for (let bullet of bList) {
        //         if (bulletCollide(wall, bullet)) {
        //             console.log("removed bullet from wall");
        //             bullet.remove();
        //         }
        //     }
        // }

        let pipe = document.getElementById("pipe");
        //for (let pipe of pipeList) {
        let bList = document.getElementsByClassName("bullet");
        for (let bullet of bList) {
            if (bulletCollide(pipe, bullet)) {
                console.log("removed bullet from pipe");
                bullet.remove();
            }
        }
        //}
    }

    //doesn't work
    function bulletCollide(wall, bullet) {

        let wall_x = parseFloat(wall.style.left);
        let wall_y = parseFloat(wall.style.bottom);
        //let wall_w = parseFloat(wall.style.width);
        let wall_h = parseFloat(wall.style.height);

        let bullet_x = parseFloat(bullet.style.left);
        let bullet_y = parseFloat(bullet.style.bottom);
        //let bullet_w = parseFloat(bullet.style.width);
        //let bullet_h = parseFloat(bullet.style.height);
        //console.log(wall_y);
        // return !(
        //     wall_y + wall_h < bullet_y ||
        //     wall_y > bullet_y ||
        //     wall_x < bullet_x ||
        //     wall_x > bullet_x + wall_h
        // );
        //if (!(wall_x > 200 && wall_x < 280 && bullet_x === 220 && bullet_y < wall_y + 153 || bullet_y === -30)) return false;
        if (bullet_y > wall_y) console.log("fuck" + " " + bullet_y);
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
