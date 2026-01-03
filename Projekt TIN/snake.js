// WŚCIEKŁY WĄŻ
import { Vector2d } from './vector.js';
import { CONFIG } from './config.js';

export class Snake {
	constructor() {
		// Głowa węża na środku planszy
		const center = Math.floor(CONFIG.gridSize / 2); //LICZENIE ŚRODKA PLANSZY
		this.body = [new Vector2d(center, center)]; //WSTAWIENIE GŁOWY NA ŚRODEK PLANSZY

		// WSPÓŁŻĘDNE WĘŻA NA 'DZIEŃ DOBRY'
		this.direction = new Vector2d(0, 0);
		this.lastDirection = new Vector2d(0, 0);
	}
	
	//RYSOWANIE WŚCIEKŁEGO WĘGOŻA
	draw(ctx) {
		ctx.fillStyle = CONFIG.colors.snake;
		// Iterujemy przez każdy segment i rysujemy go jako kwadrat
		this.body.forEach(segment => {
			ctx.fillRect(
				segment.x * CONFIG.cellSize,
				segment.y * CONFIG.cellSize,
				CONFIG.cellSize + 1, // +1 daje efekt siatki gładkiej linii 
				CONFIG.cellSize + 1
			);
		});
		//Rysowanie oczu na głowie
		const head = this.body[0];
        ctx.fillStyle = "black";
		// Lewe oko
        ctx.fillRect(
            head.x * CONFIG.cellSize + CONFIG.cellSize * 0.2, 
            head.y * CONFIG.cellSize + CONFIG.cellSize * 0.2, 
            4, 4
        );
        // Prawe oko
        ctx.fillRect(
            head.x * CONFIG.cellSize + CONFIG.cellSize * 0.6, 
            head.y * CONFIG.cellSize + CONFIG.cellSize * 0.2, 
            4, 4
        );
	}
	//Przemieszczanie sie węża
	update(hasEaten) {
		// Zapisz ostatni wykonany ruch
        this.lastDirection = this.direction.clone();
		// 1. Tworzenie nowej głowy na podstawie obecnej (index 0)
		const newHead = this.body[0].clone();
		newHead.add(this.direction);
		// 2. Wstawiamy nową głowę na początek tablicy
		this.body.unshift(newHead)
		// 3. Usuwamy ostatni element tablicy, pod zachowanie długości (bez tego w momencie zjedzenia wąż mógłby rosnąć w nieskończoność) ale <=> gdy zjemy jedzonko
		if (hasEaten === false) {
			this.body.pop();
		}
	}
}