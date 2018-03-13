import { BonusTile, BonusType } from '../types';
import { HelpersService } from '../helpers.service';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
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

  constructor(public dialogRef: MatDialogRef<ModalTileComponent>, public helper: HelpersService) { }

  ngOnInit() { 
    this.bonusType = this.helper.getTileTypes();
    this.positions = _.range(1,15);
  }

  closeDialog(type, position) {
    this.dialogRef.close(new BonusTile(type, position));
  }

}
