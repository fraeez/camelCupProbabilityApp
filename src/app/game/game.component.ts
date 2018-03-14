import {
  HelpersService
} from '../helpers.service';
import {
  Component,
  OnInit
} from '@angular/core';
import { BonusTile, Color, Game, Result, Stat, Turn } from '../types';
import {
  MatDialog
} from '@angular/material';
import {
  ModalDiceComponent
} from '../modal-dice/modal-dice.component';
import { ModalTileComponent } from '../modal-tile/modal-tile.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  game: Game;
  result: Result;
  currentTurn: Turn;

  constructor(public helpersService: HelpersService, public dialog: MatDialog) {}

  ngOnInit() {
    this.game = new Game();
    this.currentTurn = this.game.turns.slice(-1)[0];
    this.simulateTurnAndCalculateEV(this.game); 
  }

  isToRoll(color: Color): boolean {
    return this.currentTurn.dicesToRoll.find(dice => dice.color === color) ? true : false;
  }

  simulateTurnAndCalculateEV(game: Game) {
    this.result = this.helpersService.simulateTurn(this.game);
    this.result.stats.map((stat: Stat) => {
      stat.ev5 = this.helpersService.calculateEVBet(stat.firstPercent, stat.secondPercent, 1, 5, 1);
      stat.ev3 = this.helpersService.calculateEVBet(stat.firstPercent, stat.secondPercent, 1, 3, 1);
      stat.ev2 = this.helpersService.calculateEVBet(stat.firstPercent, stat.secondPercent, 1, 2, 1);
    })
  }

  openTileModal() {
    const dialogRef = this.dialog.open(ModalTileComponent);
    dialogRef.afterClosed().subscribe((tile: BonusTile) => {
      if(tile) {
        this.game.bonusTiles.push(tile);
      }
    })
  }

  openModalDice(color) {
    const dialogRef = this.dialog.open(ModalDiceComponent, {
      data: this.game.dices.find(d => d.color === color)
    });

    dialogRef.afterClosed().subscribe(diceNumber => {
      if (diceNumber) {
        this.game.camels = this.helpersService.moveCamel(this.game.camels.find(c => c.color === color), diceNumber, this.game.camels, this.game.bonusTiles);
        this.currentTurn.dicesToRoll.splice(this.currentTurn.dicesToRoll.findIndex(dice => dice.color === color), 1);
        if (this.currentTurn.dicesToRoll.length === 0) {
          this.currentTurn = new Turn(this.game.dices);
          this.game.turns.push(this.currentTurn);
          this.game.bonusTiles = [];
        }
        this.simulateTurnAndCalculateEV(this.game); 
      }
    });
  }

}
