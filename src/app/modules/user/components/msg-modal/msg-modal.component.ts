import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-msg-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './msg-modal.component.html',
  styleUrl: './msg-modal.component.scss'
})
export class MsgModalComponent {
  constructor(public dialogRef: MatDialogRef<MsgModalComponent>,@Inject(MAT_DIALOG_DATA) public _errors: string[]){

  }
  close(){
    this.dialogRef.close();
  }
}
