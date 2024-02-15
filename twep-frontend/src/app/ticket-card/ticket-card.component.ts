import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { BikeCardComponent } from '../bike-card/bike-card.component';

import { Ticket } from '../model/ticket';
import { format } from "date-fns"; 
import { Bike } from '../model/bike';
import { DialogService } from '../service/dialog.service';
import { TicketService } from '../service/tickets.service';

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
  inactive: boolean = false;

  constructor(
    private dialogService: DialogService,
    private ticketService: TicketService,
  ){
  }

  ngOnInit(): void{
   // this.inactive = new Date(this.ticket.untilDate).getTime() <= Date.now();
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
    this.dialogService.openQrCodeDialog(this.ticket);
  }

  get bike(): Bike{
    return this.ticket.bike;
  }

  get title(): string {
    return `Ticket ${this.bike.model}`
  }

  get subtitle(): string {
    return `Ticket-ID: ${this.ticket.ticketId}`
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

}
