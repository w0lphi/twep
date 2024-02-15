import { Component, OnInit} from '@angular/core';
import { CommonModule} from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';

import { TicketService } from '../service/tickets.service'; 
import { AuthService } from '../service/auth.service';

import { TicketCardComponent } from '../ticket-card/ticket-card.component';
import { LoadingOverlayComponent } from '../common/loading-overlay/loading-overlay.component';
import { Ticket, TicketStatus } from '../model/ticket';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [ 
    MatCardModule,
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatDividerModule,
    MatSelectModule,
    TicketCardComponent,
    LoadingOverlayComponent
  ],
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
})

export class TicketsComponent {
  runningAction: boolean = false;
  activeUserTickets: Ticket[] = [];
  previousUserTickets: Ticket[] = [];

  constructor(
    private authService: AuthService,
    private ticketService: TicketService,
  
  ) {
    this.getUserTickets();
  }

  getUserTickets(): void { 
    const userId: string | null = this.authService.getLoggedInUserId();
    if(userId === null) return;
    this.runningAction = true;
    this.ticketService.getUserTickets(userId)
      .subscribe({
        next: (tickets: Ticket[]) => {
          this.activeUserTickets = tickets;
          this.runningAction = false;
        },
        error: error => {
          this.runningAction = false;
        }
      });
  }
  
  getTicketStatusWeight(ticket: Ticket): number{
    switch(ticket.status){
      case TicketStatus.RENTED:
        return 2;
      case TicketStatus.UNUSED:
        return 1;
      case TicketStatus.RETURNED:
        return 0;
    }
  }
}


