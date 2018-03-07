import * as _ from 'lodash';

export enum Color {
  Orange = "Orange",
  Green = "Green",
  Blue = "Blue",
  White = "White",
  Yellow = "Yellow"
}

export class Stats {
  first: number;
  second: number;
  constructor() {
    this.first = -1;
    this.second = -1;
  }
}

export class Camel {
  color: Color;
  stats: Stats;
  position: number;
  stack: number;

  constructor(color: Color) {
    this.color = color;
    this.position = 0;
    this.stack = 0;
  }
}

export class Dice {
  faces: number[];
  color: Color;

  constructor(color: Color, nbOfFaces: number) {
    this.faces = _.range(1, nbOfFaces + 1);
    this.color = color;
  }
}

export class Turn {
    dicesToRoll: Dice[];

    constructor(dices: Dice[]) {
        this.dicesToRoll = _.cloneDeep(dices);
    }
}

export class Game {
  camels: Camel[];
  dices: Dice[];
  turns: Turn[]; 

  constructor(nbOfFaces: number = 3) {
    this.camels = [new Camel(Color.Blue), new Camel(Color.Orange), new Camel(Color.Green), new Camel(Color.White), new Camel(Color.Yellow)];
    this.dices = this.camels.map(camel => new Dice(camel.color, 3));
    this.turns = [new Turn(this.dices)];
  }
}
