import { Snake } from "./snake";

export interface GameOptions {
  onTick: () => void;
}

export class Game {
  map: any[];
  size: number;
  loopId: null | number;
  interval: number;
  paused: boolean;
  _preDate: number;
  options: GameOptions;

  food: number[] | null;

  snake: Snake;
  constructor(options: GameOptions) {
    this.map = [];
    this.size = 16;
    this.loopId = null;
    this.interval = 500;
    this.paused = false;
    this._preDate = Date.now();
    this.options = options || {};

    this.snake = new Snake();
    this.food = null;
    this.init();
  }

  init() {
    for (let i = 0; i < this.size; i++) {
      const row = [];
      for (let j = 0; j < this.size; j++) {
        row.push(0);
      }
      this.map.push(row);
    }
  }

  tick() {
    this.makeFood();
    const eating = this.eat();
    this.snake.move(eating);
    this.mark();
    this.options.onTick && this.options.onTick();
  }

  mark() {
    const map = this.map;
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        map[i][j] = 0;
      }
    }

    for (let k = 0, len = this.snake.body.length; k < len; k += 2) {
      this.snake.body[k + 1] %= this.size;
      this.snake.body[k] %= this.size;

      if (this.snake.body[k + 1] < 0) this.snake.body[k + 1] += this.size;
      if (this.snake.body[k] < 0) this.snake.body[k] += this.size;
      map[this.snake.body[k + 1]][this.snake.body[k]] = 1;
    }
    if (this.food) {
      map[this.food[1]][this.food[0]] = 1;
    }
  }

  start() {
    this.loopId = setInterval(() => {
      if (Date.now() - this._preDate > this.interval) {
        this._preDate = Date.now();
        if (!this.paused) {
          this.tick();
        }
      }
    }, 16);
  }

  stop() {
    this.loopId && clearInterval(this.loopId);
  }

  pause() {
    this.paused = true;
  }

  play() {
    this.paused = false;
  }

  reset() {
    this.paused = false;
    this.interval = 500;
    this.snake.body = [3, 1, 2, 1, 1, 1];
    this.food = null;
    this.snake.dir = "right";
  }

  toggleSpeed() {
    this.interval === 500 ? (this.interval = 150) : (this.interval = 500);
  }

  makeFood() {
    if (!this.food) {
      this.food = [this._rd(0, this.size - 1), this._rd(0, this.size - 1)];
      for (let k = 0, len = this.snake.body.length; k < len; k += 2) {
        if (
          this.snake.body[k + 1] === this.food[1] &&
          this.snake.body[k] === this.food[0]
        ) {
          this.food = null;
          this.makeFood();
          break;
        }
      }
    }
  }

  eat() {
    if (!this.food) return false;
    for (let k = 0, len = this.snake.body.length; k < len; k += 2) {
      if (
        this.snake.body[k + 1] === this.food[1] &&
        this.snake.body[k] === this.food[0]
      ) {
        this.food = null;
        return true;
      }
    }
    return false;
  }

  _rd(from: number, to: number) {
    return from + Math.floor(Math.random() * (to + 1));
  }
}

export default Game;
