import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { BikeCardComponent } from '../bike-card/bike-card.component';

import { Ticket, TicketStatus } from '../model/ticket';
import { differenceInHours, format } from "date-fns"; 
import { Bike } from '../model/bike';
import { DialogService } from '../service/dialog.service';
import { TicketService } from '../service/tickets.service';
import { Observable } from 'rxjs';

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
  @Output("cancelTicket") cancelEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output("reload") reloadEvent: EventEmitter<void> = new EventEmitter<void>();
  displayCancelBtn: boolean = true;

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
    this.ticketService.cancelUserTicket(this.ticket.ticketId).subscribe({
      next: (): void => {
        this.cancelEvent.emit();
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

  get isRented(): boolean {
    return this.ticket.status === TicketStatus.RENTED;
  }

  get isUnused(): boolean {
    return this.ticket.status === TicketStatus.UNUSED;
  }

  get isReturned(): boolean {
    return this.ticket.status === TicketStatus.RETURNED;
  }

  get statusText(): string {
    switch(this.ticket.status){
      case TicketStatus.RENTED:
        return 'Bike was taken from the station. Please return before the end date and have a nice ride!';
      case TicketStatus.UNUSED:
        let text: string = `Bike is booked for the given interval.`;
        if(!this.ticket.immediateRenting){
          text = `${text} Ticket is cancellable until 1 hour before the start date`
        }
        return text;
      case TicketStatus.RETURNED:
        return 'Bike was returned to a station';
      case TicketStatus.CANCELLED:
        return 'Ticket was cancelled'
    }
  }

  get statusIcon(): string{
    switch(this.ticket.status){
      case TicketStatus.RENTED:
        return 'timer';
      case TicketStatus.UNUSED:
        return 'info'
      case TicketStatus.RETURNED:
        return 'check_circle'
      case TicketStatus.CANCELLED:
        return 'cancel'
    }
  }
}
