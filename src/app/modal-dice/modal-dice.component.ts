import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material';
import { Dice } from '../types';

@Component({
  selector: 'app-modal-dice',
  templateUrl: './modal-dice.component.html',
  styleUrls: ['./modal-dice.component.css']
})
export class ModalDiceComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ModalDiceComponent>, @Inject(MAT_DIALOG_DATA) public dice: Dice) { }

  ngOnInit() {
  }

  closeDialog(diceNumber) {
    this.dialogRef.close(diceNumber);
  }

}
