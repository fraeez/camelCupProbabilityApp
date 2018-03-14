import { BonusTile, BonusType, Game } from '../types';
import { HelpersService } from '../helpers.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as _ from 'lodash';

@Component({
  selector: 'app-modal-tile',
  templateUrl: './modal-tile.component.html',
  styleUrls: ['./modal-tile.component.css']
})
export class ModalTileComponent implements OnInit {
  bonusType: BonusType[];
  selectedType: BonusType;
  positions: number[];
  selectedPosition: number;

  constructor(public dialogRef: MatDialogRef<ModalTileComponent>, public helper: HelpersService, @Inject(MAT_DIALOG_DATA) public game: Game) { }

  ngOnInit() { 
    this.bonusType = this.helper.getTileTypes();
    this.positions = this.helper.getAuthorizedPositionForTile(this.game.camels, this.game.bonusTiles);
  }

  closeDialog(type, position) {
    this.dialogRef.close(new BonusTile(type, position));
  }

  cancel() {
    this.dialogRef.close();
  }

}
