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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { BikeCardComponent } from '../bike-card/bike-card.component';
import { DateTimePickerComponent } from '../common/date-time-picker/date-time-picker.component';
import { LoadingOverlayComponent } from '../common/loading-overlay/loading-overlay.component';
import { TicketCardComponent } from '../ticket-card/ticket-card.component';
import { Bike } from '../model/bike';
import { Router } from '@angular/router';
import { CreateUserTicketResponse, TicketPriceRequest, TicketPriceResponse, TicketService, UserTicketRequest } from '../service/tickets.service';
import { AuthService } from '../service/auth.service';
import { formatISO } from 'date-fns';
import { formatCurrency } from '../util/currency-util';
import { Ticket } from '../model/ticket';

export type BikeRentDialogData = {
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
    MatProgressSpinnerModule,
    TicketCardComponent,
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
  calculatingPrice: boolean = false;
  immediateRenting: boolean = false;
  createdTicketId?: string;

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

  ngOnInit(){
    this.calculatePrice();
  }

  purchaseTicket(): void {
    this.runningAction = true;
    const userId: string | null = this.authService.getLoggedInUserId()
    if (userId !== null && this.bookingStart !== null && this.bookingEnd !== null) {
      const ticket: UserTicketRequest = {
        bikeId: this.bike.id,
        fromDate: formatISO(this.bookingStart),
        untilDate: formatISO(this.bookingEnd),
        immediateRenting: this.immediateRenting,
      }

      this.ticketService.createUserTicket(userId, ticket).subscribe({
        next: (response: CreateUserTicketResponse): void => {
          this.bookingSuccessful = true;
          this.createdTicketId = response.ticket.id;
          this.runningAction = false;
        },
        error: (): void => {
          this.bookingStart = new Date(ticket.fromDate);
          this.bookingEnd = new Date(ticket.untilDate);
          this.immediateRenting = ticket.immediateRenting;
          this.runningAction = false;
        }
      })
    }
  }

  navigateToTicket(): void {
    this.router.navigateByUrl("/user/tickets");
    this.dialogRef.close();
  }

  setImmediateRenting(){
    if(this.immediateRenting){
      //If immediate renting, set start date to one minute in the future
      this.bookingStart = new Date(Date.now() + (1 * 60 * 1000));
    }
    this.calculatePrice();
  }

  calculatePrice(): void {
    if (this.bookingStart !== null && this.bookingEnd !== null) {
      const request: TicketPriceRequest = {
        bikeId: this.bike.id,
        fromDate: formatISO(this.bookingStart),
        untilDate: formatISO(this.bookingEnd),
      }
      this.calculatingPrice = true;
      this.ticketService.calculateTicketPrice(request).subscribe({
        next: (response: TicketPriceResponse): void => {
          this.price = response.price;
          this.calculatingPrice = false;
        },
        error: (): void => {
          this.calculatingPrice = false;
        }
      })
    }
  }

  get title(): string{
    if (this.bookingSuccessful) {
      return "Booking successful"
    }
    return `Book ticket`
  }

  get formattedPrice(): string {
    const price: number = this.price > 0 ? this.price : 0;
    return formatCurrency(price)
  }

}