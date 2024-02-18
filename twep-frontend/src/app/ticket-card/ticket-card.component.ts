import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { BikeCardComponent } from '../bike-card/bike-card.component';

import { Ticket, TicketStatus } from '../model/ticket';
import { differenceInHours, format, isBefore } from "date-fns"; 
import { Bike } from '../model/bike';
import { DialogService } from '../service/dialog.service';
import { TicketService } from '../service/tickets.service';
import { formatCurrency } from '../util/currency-util';

@Component({
  selector: 'app-ticket-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    BikeCardComponent,
    RouterLink
  ],
  templateUrl: './ticket-card.component.html',
  styleUrl: './ticket-card.component.scss'
})
export class TicketCardComponent {
  @Input("ticket") ticket!: Ticket;
  @Input("readonly") readonly: boolean = false;
  @Output("cancelTicket") cancelEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output("reload") reloadEvent: EventEmitter<void> = new EventEmitter<void>();
  displayCancelBtn: boolean = true;
  runningAction: boolean = false;

  constructor(
    private dialogService: DialogService,
    private ticketService: TicketService,
  ){}

  ngOnInit(){
    const hourDifference = differenceInHours(this.ticket.fromDate, Date.now());
    this.displayCancelBtn = this.isUnused && hourDifference >= 1;
  }

  async cancelTicket(): Promise<void>{
    const confirmed: boolean = await this.dialogService.openConfirmDialog(
      `Cancel Ticket?`,
      `Do you really want to cancel ticket ${this.ticket.ticketId}?`
    )
    if (!confirmed) return;
    this.runningAction = true;
    this.ticketService.cancelUserTicket(this.ticket.userId, this.ticket.ticketId).subscribe({
      next: (): void => {
        this.cancelEvent.emit();
        this.runningAction = false;
      },
      error: (): void => {
        this.runningAction = false;
      }
    })
  }

  showQRCode(): void{
    this.dialogService.openQrCodeDialog(this.ticket).subscribe({
      next: (reload: boolean | undefined) => {
        if(reload) this.reloadEvent.emit()
      }
    })
  }

  get bike(): Bike{
    return this.ticket.bike;
  }

  get title(): string {
    return `Ticket ${this.bike.model}`
  }

  get subtitle(): string {
    return `ID: ${this.ticket.ticketId}`
  }

  get status(): TicketStatus {
    const isOverdue: boolean = this.ticket.status === TicketStatus.RENTED && isBefore(new Date(this.ticket.untilDate), Date.now())
    if(isOverdue) return TicketStatus.OVERDUE;
    return this.ticket.status;
  }

  get fromDateFormatted(): string {
    return format(new Date(this.ticket.fromDate), "dd.MM.yyyy HH:mm");
  }

  get untilDateFormatted(): string {
    return format(new Date(this.ticket.untilDate), "dd.MM.yyyy HH:mm");
  }

  get timeInterval(): string {
    return `${this.fromDateFormatted} - ${this.untilDateFormatted}`
  }

  get stationName(): string {
    return `${this.bike.station?.name}`
  }

  get price(): string {
    return formatCurrency(this.ticket.price);
  }

  get isRented(): boolean {
    return this.status === TicketStatus.RENTED;
  }

  get isUnused(): boolean {
    return this.status === TicketStatus.UNUSED;
  }

  get isReturned(): boolean {
    return this.status === TicketStatus.RETURNED;
  }

  get isOverdue(): boolean {
    return this.status === TicketStatus.OVERDUE;
  }

  get displayActions(): boolean{
    return !this.readonly && (this.isRented || this.isUnused || this.isOverdue || this.displayCancelBtn)
  }

  get statusText(): string {
    switch(this.status){
      case TicketStatus.RENTED:
        return 'Bike was taken from the station. Please return before the end date and have a nice ride!';
      case TicketStatus.UNUSED:
        let text: string = `Bike is booked for the given interval.`;
        if(!this.ticket.immediateRenting && differenceInHours(this.ticket.fromDate, new Date(Date.now())) > 1){
          text = `${text} Ticket is cancellable until 1 hour before the start date.`
        }
        text = `${text} If the bike is not taken a fee of 10% of the ticket price will be deducted from your wallet`
        return text;
      case TicketStatus.RETURNED:
        return 'Bike was returned to a station';
      case TicketStatus.CANCELLED:
        return 'Ticket was cancelled'
      case TicketStatus.OVERDUE:
        const lateFee: number = Number(this.bike.hourPrice) * 2;
        return `This ticket is overdue! Please return the bike to the next station. 
        A late fee of ${formatCurrency(lateFee)} per overdue hour will be deducted from your account!`
        case TicketStatus.EXPIRED:
          const ticketPrice: number = Number(this.ticket.price ?? 0) * 0.1
          return `This ticket expired without taking the bike. A fee of ${formatCurrency(ticketPrice)} was deducted from your wallet`;
    }
  }

  get statusIcon(): string{
    switch(this.status){
      case TicketStatus.RENTED:
        return 'timer';
      case TicketStatus.UNUSED:
        return 'info'
      case TicketStatus.RETURNED:
        return 'check_circle'
      case TicketStatus.CANCELLED:
        return 'cancel';
      case TicketStatus.OVERDUE:
        return 'warning';
      case TicketStatus.EXPIRED:
        return 'timer_off';
    }
  }
}
