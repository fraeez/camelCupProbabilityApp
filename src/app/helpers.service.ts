import {
  Injectable
} from '@angular/core';
import {
  Camel,
  Color,
  Dice,
  Game,
  Stat,
  Result,
  Turn
} from './types';

import * as _ from 'lodash';

@Injectable()
export class HelpersService {

  constructor() {}

  simulateTurn(game: Game): Result {
    let turn: Turn = game.turns.slice(-1)[0];
    let orderPermuter: Color[][] = this.getOrderPermuter(turn.dicesToRoll.map((dice: Dice) => dice.color));
    let dices = this.diceRoller(turn.dicesToRoll.length, game.dices[0].faces);
    let stats: Stat[] = game.camels.map(c => {
      return {
        color: c.color,
        first: 0,
        second: 0,
        firstPercent: 0,
        secondPercent: 0,
        position: c.position,
        stack: c.stack,
      }
    })
    let totalIteration = 0;
    _.forEach(orderPermuter, permutation => {
      _.forEach(dices, dice => {
        totalIteration++;
        const camelOrder = this.moveCamels(_.cloneDeep(game.camels), _.cloneDeep(permutation), _.cloneDeep(dice));
        stats.find(s => s.color === camelOrder[0].color).first++;
        stats.find(s => s.color === camelOrder[1].color).second++;
      })
    })

    stats.map(s => {
      s.firstPercent = s.first / totalIteration;
      s.secondPercent = s.second / totalIteration;
    })

    return {
      stats: stats,
      totalIteration: totalIteration
    };
  }


  private getOrderPermuter(data: any[]): any[][] {
    let permutation = [data.slice()];
    return permutation[0].length > 0 ? this.permutations(data.length, data, permutation): permutation;
  }

  swap(arr: any[], x: number, y: number) {
    var t = arr[x];
    arr[x] = arr[y];
    arr[y] = t;
    return arr;
  }

  permutations(len: number, ary: any[], results: any[][]) {
    var i = 0,
      l = len - 1;
    if (len === 1) return results;
    else {
      for (i; i < l; i++) {
        this.permutations(l, ary, results);
        l % 2 ? this.swap(ary, i, l) : this.swap(ary, 0, l);
        results.push(_.cloneDeep(ary));
      }
      this.permutations(l, ary, results);
    }
    return results;
  }

  diceRoller(numOfDice, numberOfFaces) {
    if(numOfDice == 0) return [[]];
    const dice = _.fill(new Array(numOfDice), numberOfFaces);
    return _.reduce(dice, (a, b) => {
      return _.flatten(_.map(a, (x) => {
        return _.map(b, (y) => {
          return x.concat([y]);
        });
      }), true);
    }, [
      []
    ]);
  };

  moveCamel(camelToMove: Camel, dice: number, camels: Camel[]): Camel[] {
    const camelsOnTop: Camel[] = _.filter(camels, (c: Camel) => c.position === camelToMove.position && c.stack > camelToMove.stack);
    camelsOnTop.push(camelToMove);
    const diceResult = dice;
    const newPosition = camelToMove.position + diceResult;
    const receivingStack = _.filter(camels, {
      position: newPosition
    }).length;
    _.forEach(camelsOnTop, (c: Camel) => {
      c.position = newPosition;
      c.stack += receivingStack - camelToMove.stack;
    })
    return camels;
  }

  moveCamels(camels: Camel[], permutation: Color[], dicesResults: number[]): Camel[] {
    while (permutation.length > 0) {
      const luckyCamel: Camel = _.find(camels, {
        color: permutation.shift()
      });
      camels = this.moveCamel(luckyCamel, dicesResults.shift(), camels);

    }
    return _.orderBy(camels, ['position', 'stack'], ['desc', 'desc']);
  }

  calculateEVBet(probabilyFirst: number, probabilySecond: number, price: number, winIfFisrt: number, winIfSecond: number): number {
    return winIfFisrt * probabilyFirst + winIfSecond * probabilySecond - price * (1-probabilyFirst-probabilySecond);
  }
}