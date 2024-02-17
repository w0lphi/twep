import { Component } from '@angular/core';

import { MatTableModule } from '@angular/material/table';
import { AdminTableComponent } from '../admin-table/admin-table.component';
import { OverdueTicket, TicketService } from '../../service/tickets.service';
import { Duration, format, intervalToDuration, intlFormatDistance } from 'date-fns';

@Component({
  selector: 'app-overdue-rentals-list',
  standalone: true,
  imports: [
    AdminTableComponent,
    MatTableModule
  ],
  templateUrl: './overdue-rentals-list.component.html',
  styleUrl: './overdue-rentals-list.component.scss'
})
export class OverdueRentalsListComponent {
  runningAction: boolean = false;
  overdueTickets: OverdueTicket[] = [];

  constructor(
    private ticketService: TicketService
  ){
    this.getOverdueTickets();
  }


  getOverdueTickets(){
    this.runningAction = true;
    this.ticketService.getAllOverdueTickets().subscribe({
      next: (tickets: OverdueTicket[]) => {
        this.overdueTickets = tickets;
        this.runningAction = false;
      },
      error: () => {
        this.runningAction = false;
      }
    })
  }

  getFormattedDate(ticket: OverdueTicket){
    const untilDate: Date = new Date(ticket.untilDate);
    const distance: string = intlFormatDistance(untilDate, new Date(Date.now()), { locale: "en-GB", numeric: 'always'});
    return `${format(untilDate, 'dd.MM.yyyy HH:mm')} (${distance})`
  }


  get columns(): string[]{
    return [
      "ticket",
      "user",
      "bike",
      "returnDate"
    ]
  }
}
