
const canvas = document.getElementById('game');
const ctx = canvas.getContext("2d");

const ground = new Image();
ground.src = "Foto/BackGround.png";

const foodImg = new Image();
foodImg.src = "Foto/Food.png";

// Перезапуск игры
document.getElementById('Restart').addEventListener('click', function () {
    location.reload();
});

let box = 32;
let score = 0;

var food = {
    x: Math.floor(Math.random() * 17 + 1) * box,
    y: Math.floor(Math.random() * 15 + 3) * box,
};

let snake = [{ x: 9 * box, y: 10 * box }];

// Скрытая кнопка
var btn = document.getElementById('btn');
btn.style.display = 'none';
btn.addEventListener('click', function () {
    window.location.href = 'https://pawel-shykuta.github.io/For-People/';
});

let dir;

// Основная функция отрисовки
function drawGame() {
    ctx.drawImage(ground, 0, 0);
    ctx.drawImage(foodImg, food.x, food.y);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i == 0 ? "black" : "blue";
        ctx.beginPath();
        ctx.arc(snake[i].x + box / 2, snake[i].y + box / 2, box / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.fillText(score, box * 2.5, box * 1.7);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (snakeX < box || snakeX > box * 17 || snakeY < 3 * box || snakeY > box * 17) {
        clearInterval(game);
    }

    if (dir == "left") snakeX -= box;
    if (dir == "right") snakeX += box;
    if (dir == "up") snakeY -= box;
    if (dir == "down") snakeY += box;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * 17 + 1) * box,
            y: Math.floor(Math.random() * 15 + 3) * box,
        };
        if (score >= 10) {
            btn.style.display = 'block';
        }
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };
    eatTail(newHead, snake);
    snake.unshift(newHead);
}

// Функция для проверки столкновения с хвостом
function eatTail(head, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (head.x == arr[i].x && head.y == arr[i].y) clearInterval(game);
    }
}

// Обработчик направления с клавиатуры
document.addEventListener("keydown", function (event) {
    if ((event.key === "ArrowLeft" || event.key === "a") && dir != "right") {
        dir = "left";
    } else if ((event.key === "ArrowUp" || event.key === "w") && dir != "down") {
        dir = "up";
    } else if ((event.key === "ArrowRight" || event.key === "d") && dir != "left") {
        dir = "right";
    } else if ((event.key === "ArrowDown" || event.key === "s") && dir != "up") {
        dir = "down";
    }
});

// Добавление touch-событий для мобильных устройств
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', function (event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}, false);

canvas.addEventListener('touchend', function (event) {
    let touchEndX = event.changedTouches[0].clientX;
    let touchEndY = event.changedTouches[0].clientY;

    let diffX = touchStartX - touchEndX;
    let diffY = touchStartY - touchEndY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0 && dir != "right") {
            dir = "left";
        } else if (diffX < 0 && dir != "left") {
            dir = "right";
        }
    } else {
        if (diffY > 0 && dir != "down") {
            dir = "up";
        } else if (diffY < 0 && dir != "up") {
            dir = "down";
        }
    }
}, false);

// Управление кнопками
document.getElementById('Left').addEventListener('click', function () {
    if (dir != "right") dir = "left";
});

document.getElementById('Right').addEventListener('click', function () {
    if (dir != "left") dir = "right";
});

document.getElementById('Up').addEventListener('click', function () {
    if (dir != "down") dir = "up";
});

document.getElementById('Bottom').addEventListener('click', function () {
    if (dir != "up") dir = "down";
});

// Запуск игры
let game = setInterval(drawGame, 100);