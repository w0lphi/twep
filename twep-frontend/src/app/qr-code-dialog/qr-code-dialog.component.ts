import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Ticket, TicketStatus } from '../model/ticket';
import { TicketService } from '../service/tickets.service';
import { AuthService } from '../service/auth.service';
import { LoadingOverlayComponent } from '../common/loading-overlay/loading-overlay.component';
import { BikeStationService } from '../service/bikeStation.service';
import { BikeStation } from '../model/bikeStation';

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
    LoadingOverlayComponent,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
  ],
  templateUrl: './qr-code-dialog.component.html',
  styleUrl: './qr-code-dialog.component.scss'
})
export class QrCodeDialogComponent {
  ticket: Ticket;
  step: number = 1;
  runningAction: boolean = false;
  userId: string | null;
  bikeStations: BikeStation[] = [];
  bikeStationId: string | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: QrCodeDialogData,
    private dialog: MatDialogRef<QrCodeDialogComponent, boolean>,
    private ticketService: TicketService,
    private authService: AuthService,
    private bikeStationService: BikeStationService
  ){
    this.userId = this.authService.getLoggedInUserId();
    this.ticket = data.ticket;
  }

  simulateRent(): void{
    if(!this.userId) return;
    this.runningAction = true;
    this.ticketService.simulateRideBike(this.ticket.ticketId, this.userId).subscribe({
      next: (): void => {
        this.closeDialog(true);
      },
      error: (): void => {
        this.runningAction = false;
      }
    });
  }

  progressToReturn(): void{
    this.step = 2;
    this.runningAction = true;
    this.bikeStationService.getBikeStationsForUser().subscribe({
      next: (bikeStations: BikeStation[]): void => {
        this.bikeStations = bikeStations;
        this.runningAction = false;
      },
      error: (): void => {
        this.runningAction = false;
      }
    })
  }

  returnBike(){
    if(this.bikeStationId === null || this.userId === null) return;
    this.runningAction = true;
    this.ticketService.simulateReturnBike(this.ticket.ticketId, this.userId, this.bikeStationId).subscribe({
      next: (): void => {
        this.closeDialog(true);
      },
      error: (): void => {
        this.runningAction = false;
      }
    });
  }

  closeDialog(reload: boolean = false){
    this.dialog.close(reload);
  }

  get qrCodeBase64(): string {
    return `data:image/png;base64, ${this.ticket.qrCodeBase64}`;
  }

  get isRented(): boolean{
    return this.ticket.status === TicketStatus.RENTED;
  }
}
