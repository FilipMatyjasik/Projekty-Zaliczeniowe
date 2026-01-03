// TU SIE SKŁADA
import { CONFIG } from './config.js';
import { Vector2d } from './vector.js';
import { getRandomInt } from './utils.js';
import { Snake } from './snake.js';


// Podstawowa składnia #CANVAS
const canvas = document.querySelector("#snakeGame");
const ctx = canvas.getContext("2d");

// Zmienne stanu gry
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0; // Pobierz rekord z pamięci
let isGameOver = false; // Flaga czy gra się skończyła

// Elementy HTML do wyświetlania wyniku
const scoreEl = document.getElementById('currentScore');
const bestScoreEl = document.getElementById('bestScore');

function setup() {
	//TU ROZMIAR CANVASU W PIXELACH
	canvas.width = 400;
	canvas.height = 400;
	
	//WIELKOŚĆ KAFLA Z CONFIG
	CONFIG.cellSize = canvas.width / CONFIG.gridSize;

	// Wyświetl początkowy High Score
    bestScoreEl.innerText = highScore;
	console.log("Zaczynamy Grę. Rozmiar kafelka:", CONFIG.cellSize,", Najlepszy wynik:", highScore);
}

//Wywołanie funkcji
setup();

//Sterowanie
window.addEventListener('keydown', (event) => { //Odczytywanie inputu klawiatury
    // TO BLOKUJE PRZEWIJANIE STRONY STRZAŁKAMI
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(event.code) > -1) {
        event.preventDefault();
    }
	//Restart klawiszem po zakończeniu gry
	if (isGameOver) {
        location.reload();
        return;
    }
	const key = event.key;
		if (snake.lastDirection.y === 0) {			// Grupa pionowa sterowania
			// Góra(0,-1), Dół(0,1), Lewo(-1,0), Prawo(1,0)
			if (key === 'ArrowUp') snake.direction = new Vector2d(0, -1);
			if (key === 'ArrowDown') snake.direction = new Vector2d(0, 1);
		}

		if (snake.lastDirection.x === 0) {			// Grupa pozioma sterowania
			if (key === 'ArrowLeft') snake.direction = new Vector2d(-1, 0);
			if (key === 'ArrowRight') snake.direction = new Vector2d(1, 0);
		}
});
//Tworzenie węża
const snake = new Snake();
//Obiekt jedzonka - z funkcją pomocniczą
let food = getSafeFoodPosition(snake.body);

function gameLoop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height); //Wyczyść ekran
	const hasEaten = (snake.body[0].x === food.x && snake.body[0].y === food.y); //Sprawdzenie czy główka jest na jedzonku
	snake.update(hasEaten); //Aktualizacja pozycji(ruch węa)
	if (hasEaten) { //Jeżli zjadł to wylosuj nowe miejsce na jedzonko
        const newPos = getSafeFoodPosition(snake.body);
        food.x = newPos.x;
        food.y = newPos.y;
		// ZWIĘKSZANIE WYNIKU
        score++;
        scoreEl.innerText = score; // Aktualizacja HTML
	}
	snake.draw(ctx); //Rysowanie (wyświetlanie węża)
	// Rysowanie żarcia
	ctx.fillStyle = CONFIG.colors.food;
	ctx.fillRect(food.x * CONFIG.cellSize, food.y * CONFIG.cellSize, CONFIG.cellSize, CONFIG.cellSize);

	//GAME OVER
	if (snake.body[0].x < 0 || snake.body[0].x >= CONFIG.gridSize || snake.body[0].y < 0 || snake.body[0].y >= CONFIG.gridSize || checkSelfCollision()) {
		gameOver();
	}
}
// Funkcja pomocnicza: czy wąż ugryzł ogon?
function checkSelfCollision() {
    // Zaczynamy od 1, bo 0 to głowa
    for (let i = 1; i < snake.body.length; i++) {
        if (snake.body[i].equals(snake.body[0])) {
            return true;
        }
    }
    return false;
}

//Funkcja kończenia gry
function gameOver() {
    // Zatrzymaj pętlę gry
    clearInterval(gameInterval);
    isGameOver = true;

    // Obsługa High Score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore); // Zapis do pamięci przeglądarki
        bestScoreEl.innerText = highScore;
    }

    // Rysowanie ekranu końcowego na Canvasie
    drawGameOverScreen();
}
function drawGameOverScreen() {
    // Półprzezroczyste tło
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Tekst GAME OVER
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    
    ctx.font = "bold 40px Arial";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);

    // Wynik
    ctx.font = "20px Arial";
    ctx.fillText(`Twój wynik: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText(`Najlepszy: ${highScore}`, canvas.width / 2, canvas.height / 2 + 50);

    // Instrukcja restartu
    ctx.fillStyle = "#4CAF50"; // Zielony akcent
    ctx.font = "16px Arial";
    ctx.fillText("Naciśnij dowolny klawisz...", canvas.width / 2, canvas.height - 40);
}
// Funkcja szukająca bezpiecznego miejsca na jedzenie
function getSafeFoodPosition(snakeBody) {
    let newFoodPosition;
    let isOnSnake = true;

    // Pętla: Losuj tak długo, aż trafisz w pole, gdzie NIE MA węża
    while (isOnSnake) {
        newFoodPosition = new Vector2d(getRandomInt(CONFIG.gridSize), getRandomInt(CONFIG.gridSize));
        
        // Sprawdzamy czy wylosowana pozycja koliduje z którymkolwiek segmentem ciała
        // .some() zwraca true, jeśli chociaż jeden element spełnia warunek
        isOnSnake = snakeBody.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y);
    }

    return newFoodPosition;
}
const gameInterval = setInterval(gameLoop , CONFIG.gameSpeed);