export class Vector2d {
	constructor (x, y) {
		this.x = x;
		this.y = y;
	}

	//Metoda dodawania wektorów do obecnego
	add(vector) {
		this.x += vector.x;
		this.y += vector.y;
	}
	//Metoda sprawdzająca kolizję głowy
	equals(other) {
		return this.x === other.x && this.y === other.y
	}

	clone() {
		return new Vector2d(this.x, this.y);
	}

}
