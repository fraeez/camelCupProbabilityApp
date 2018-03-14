import * as _ from 'lodash';

export enum Color {
  Orange = "Orange",
    Green = "Green",
    Blue = "Blue",
    White = "White",
    Yellow = "Yellow"
}

export enum BonusType {
  Oasis = "Oasis +1",
  Desert = "Desert -1"
}

export class Result {
  stats: Stat[];
  totalIteration: number;
}

export class Stat {
  color: Color;
  first: number;
  second: number;
  firstPercent: number;
  secondPercent: number;
  position: number;
  stack: number;
  ev5?: number;
  ev3?: number;
  ev2?: number;
  bonusTileEV?: BonusTileEV[];
}

export class BonusTileEV {
  position: number;
  type: BonusType;
  numberOccurence: number;
}

export class Camel {
  color: Color;
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

export class BonusTile {
  type: BonusType;
  position: number;

  constructor(type, position) {
    this.type = type;
    this.position = position;
  } 
}

export class Game {
  camels: Camel[];
  dices: Dice[];
  turns: Turn[];
  bonusTiles: BonusTile[];

  constructor(nbOfFaces: number = 3) {
    this.camels = [new Camel(Color.Blue), new Camel(Color.Orange), new Camel(Color.Green), new Camel(Color.White), new Camel(Color.Yellow)];
    this.dices = this.camels.map(camel => new Dice(camel.color, 3));
    this.turns = [new Turn(this.dices)];
    this.bonusTiles = [];
  }
}
