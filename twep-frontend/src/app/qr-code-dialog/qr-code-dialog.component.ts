import { Component, Inject, Input } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Ticket } from '../model/ticket';

export type QrCodeDialogData = {
  ticket: Ticket;
}

@Component({
  selector: 'app-qr-code-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
  ],
  templateUrl: './qr-code-dialog.component.html',
  styleUrl: './qr-code-dialog.component.scss'
})
export class QrCodeDialogComponent {
  ticket: Ticket;
  step: number = 1;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: QrCodeDialogData,
    private dialogRef: MatDialogRef<QrCodeDialogComponent>,
  ){
    this.ticket = data.ticket;
  }

  simulateRent(){
    this.step = 2;
  }

  get qrCodeBase64(): string {
    return `data:image/png;base64, ${this.ticket.qrCodeBase64}`;
  }
}
