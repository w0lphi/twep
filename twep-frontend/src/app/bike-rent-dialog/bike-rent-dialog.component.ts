import { Component, Inject } from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { BikeCardComponent } from '../bike-card/bike-card.component';
import { DateTimePickerComponent } from '../common/date-time-picker/date-time-picker.component';
import { LoadingOverlayComponent } from '../common/loading-overlay/loading-overlay.component';
import { Bike } from '../model/bike';
import { Router } from '@angular/router';
import { TicketService } from '../service/tickets.service';
import { AuthService } from '../service/auth.service';

export interface BikeRentDialogData{
  bike: Bike;
}

@Component({
  selector: 'app-bike-rent-dialog',
  standalone: true,
  imports: [
    BikeCardComponent,
    FormsModule,
    MatIconModule,
    MatDialogModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatDividerModule,
    MatCheckboxModule,
    DateTimePickerComponent,
    LoadingOverlayComponent,
  ],
  templateUrl: './bike-rent-dialog.component.html',
  styleUrl: './bike-rent-dialog.component.scss'
})
export class BikeRentDialogComponent {

  bike: Bike;
  bookingStart: Date | null;
  bookingEnd: Date | null;
  runningAction: boolean = false;
  bookingSuccessful: boolean = false;
  price: number = 0;
  immediateRenting: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: BikeRentDialogData,
    private dialogRef: MatDialogRef<BikeRentDialogComponent>,
    private router: Router,
    private ticketService: TicketService,
    private authService: AuthService,
  ) {
    this.bike = this.data.bike;
    this.bookingStart = new Date(Date.now());
    this.bookingEnd = new Date(Date.now());
  }

  purchaseTicket(): void {
    this.runningAction = true;
    const userId: string | null = this.authService.getLoggedInUserId();
    if (userId !== null) {
      this.ticketService.createUserTicket(userId, {}).subscribe({
      next: () => {
        this.runningAction = false;
        this.bookingSuccessful = true;
      },
      error: () => {
        this.runningAction = false;
      }
    })
    }
  }

  navigateToTicket(): void {
    this.router.navigateByUrl("/user/tickets");
    this.dialogRef.close();
  }

  calculatePrice() {
    
  }

  get title(): string{
    if (this.bookingSuccessful) {
      return "Booking successful"
    }
    return `Book ticket`
  }

  get formattedPrice(): string {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
      this.price,
    )
  }

}