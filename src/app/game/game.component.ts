import {
  HelpersService
} from '../helpers.service';
import {
  Component,
  OnInit
} from '@angular/core';
import { Game, Turn, Color } from '../types';
import {
  MatDialog
} from '@angular/material';
import {
  ModalDiceComponent
} from '../modal-dice/modal-dice.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  game: Game;
  result: any;
  currentTurn: Turn;

  constructor(public helpersService: HelpersService, public dialog: MatDialog) {}

  ngOnInit() {
    this.game = new Game();
    this.currentTurn = this.game.turns.slice(-1)[0];
    this.result = this.helpersService.simulateTurn(this.game);
  }

  isToRoll(color:Color): boolean {
    return this.currentTurn.dicesToRoll.find(dice => dice.color === color) ? true : false;
  }

  openModalDice(color) {
    const dialogRef = this.dialog.open(ModalDiceComponent, {
      data: this.game.dices.find(d => d.color === color)
    });

    dialogRef.afterClosed().subscribe(diceNumber => {
      if(diceNumber) {
        this.game.camels = this.helpersService.moveCamel(this.game.camels.find(c => c.color === color), diceNumber, this.game.camels);
        this.currentTurn.dicesToRoll.splice(this.currentTurn.dicesToRoll.findIndex(dice => dice.color === color),1);
        if(this.currentTurn.dicesToRoll.length === 0) {
          this.currentTurn = new Turn(this.game.dices);
          this.game.turns.push(this.currentTurn);
        }
        this.result = this.helpersService.simulateTurn(this.game);
      } 
    });
  }

}
