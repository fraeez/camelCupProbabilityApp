import {
  a,
  l
} from '@angular/core/src/render3';
import {
  Injectable
} from '@angular/core';
import {
  BonusTile,
  BonusTileEV,
  BonusType,
  Camel,
  Color,
  Dice,
  Game,
  Result,
  Stat,
  Turn
} from './types';

import * as _ from 'lodash';

@Injectable()
export class HelpersService {

  constructor() {}

  getTileTypes(): BonusType[] {
    return [BonusType.Oasis, BonusType.Desert];
  }

  simulateTurn(game: Game): Result {
    let turn: Turn = game.turns.slice(-1)[0];
    let orderPermuter: Color[][] = this.getOrderPermuter(turn.dicesToRoll.map((dice: Dice) => dice.color));
    let dices = this.diceRoller(turn.dicesToRoll.length, game.dices[0].faces);
    _.forEach(game.bonusTiles, (bt => bt.triggered = 0));
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
        const camelOrder = this.moveCamels(_.cloneDeep(game.camels), _.cloneDeep(permutation), _.cloneDeep(dice), game.bonusTiles);
        stats.find(s => s.color === camelOrder[0].color).first++;
        stats.find(s => s.color === camelOrder[1].color).second++;
      })
    })
    _.forEach(game.bonusTiles, (bt => bt.ev = bt.triggered / totalIteration));

    stats.map(s => {
      s.firstPercent = s.first / totalIteration;
      s.secondPercent = s.second / totalIteration;
    })

    stats = _.orderBy(stats, ['position', 'stack'], ['desc', 'desc']);

    return {
      stats: stats,
      totalIteration: totalIteration
    };
  }


  private getOrderPermuter(data: any[]): any[][] {
    let permutation = [data.slice()];
    return permutation[0].length > 0 ? this.permutations(data.length, data, permutation) : permutation;
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
    if (numOfDice == 0) return [
      []
    ];
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

  invertStack(camels: Camel[]) {
    camels = _.orderBy(camels, "stack");
    let maxStack = camels[camels.length - 1].stack;
    _.forEach(camels, c => c.stack = maxStack--);
    return camels;
  }

  moveCamel(camelToMove: Camel, dice: number, camels: Camel[], bonusTiles: BonusTile[]): Camel[] {
    let camelsOnTop: Camel[] = _.filter(camels, (c: Camel) => c.position === camelToMove.position && c.stack > camelToMove.stack);
    camelsOnTop.push(camelToMove);
    const diceResult = dice;
    let newPosition = camelToMove.position + diceResult;
    const bonusTile = bonusTiles.find((bt: BonusTile) => bt.position === newPosition);
    if (bonusTile) {
      bonusTile.triggered++;
      newPosition = bonusTile.type === BonusType.Desert ? newPosition - 1 : newPosition + 1;
      if (bonusTile.type === BonusType.Desert) camelsOnTop = this.invertStack(camelsOnTop);
    }
    const camelsOnStack = _.filter(camels, {
      position: newPosition
    });

    _.forEach(camelsOnTop, (c: Camel) => {
      c.position = newPosition;
      c.stack += ((bonusTile && bonusTile.type === BonusType.Desert) ? 0 : camelsOnStack.length - camelToMove.stack);
    })

    if (bonusTile && bonusTile.type === BonusType.Desert) {
      _.forEach(camelsOnStack, (c: Camel) => {
        c.stack += camelsOnTop.length;
      })
    }
    return camels;
  }

  moveCamels(camels: Camel[], permutation: Color[], dicesResults: number[], bonusTiles: BonusTile[]): Camel[] {
    while (permutation.length > 0) {
      const luckyCamel: Camel = _.find(camels, {
        color: permutation.shift()
      });
      camels = this.moveCamel(luckyCamel, dicesResults.shift(), camels, bonusTiles);
    }
    return _.orderBy(camels, ['position', 'stack'], ['desc', 'desc']);
  }

  getAuthorizedPositionForTile(camels: Camel[], bonusTiles: BonusTile[], dices: Dice[] = []): number[] {
    const reducedCamels = camels.reduce((array, camel) => {
      if(dices.length === 0) return camels;
      if (dices.find((dice: Dice) => dice.color === camel.color)) array.push(camel);
      return array;
    }, [])
    const positionMap = reducedCamels.map(c => c.position);
    const min = Math.max(_.min(positionMap),2);
    const max = Math.min(_.max(positionMap) + 4, 17);
    return _.filter(_.range(min, max), position => !(_.find(camels, ['position', position]) || _.find(bonusTiles, ['position', position]) || _.find(bonusTiles, ['position', position + 1]) || _.find(bonusTiles, ['position', position - 1])))
  }

  calculateEVBet(probabilyFirst: number, probabilySecond: number, price: number, winIfFisrt: number, winIfSecond: number): number {
    return winIfFisrt * probabilyFirst + winIfSecond * probabilySecond - price * (1 - probabilyFirst - probabilySecond);
  }
}
