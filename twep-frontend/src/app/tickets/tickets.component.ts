import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { BikeStationService } from '../service/bikeStation.service';
import { BikeStation } from '../model/bikeStation';
import { Location } from '../model/location';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';

import { WalletService } from '../service/wallet.service';
import { OnInit } from '@angular/core';
import { TicketService, UserTicket } from '../service/tickets.service'; 
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import {AuthService} from '../service/auth.service';





@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [ 
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatDividerModule,
    MatSelectModule,
    
    
   // TicketService,

    

  ],
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
 providers: [TicketService,]
  
})

export class TicketsComponent implements OnInit {
  userTickets: any[] = [];
  loggedInUserId: string | null = null;
  userId: string = '';

  constructor(
    private authService: AuthService,
    private ticketService: TicketService,
  
  ) {}

fetchUserTickets(): void { 
      this.ticketService.getUserTickets(this.userId)
        .subscribe({
          next: (tickets: UserTicket[]) => {
            this.userTickets = tickets;
          },
          error: error => {
            console.error('Error fetching user tickets:', error);
          }
        });
    } 
   
    
  
  
  

  ngOnInit(): void {
    this.loggedInUserId = this.authService.getLoggedInUserId();
    if (this.loggedInUserId) {
      this.userId = this.loggedInUserId; 
      this.fetchUserTickets();
    }
    
  }

  

  createTicket(): void {
    const ticket = {
        "bikeId": "b3182d20-32d8-4ee7-93c5-20477f76af14",
        "fromDate": "2024-02-14T20:37:29.882Z",
        "untilDate": "2024-02-14T20:37:29.882Z",
        "immediateRenting": false,
    }

    this.ticketService.createUserTicket(this.userId, ticket)
      .subscribe({
        next: response => {
          console.log('Ticket created successfully:', response);
          this.fetchUserTickets();
        },
        error: error => {
          console.error('Error creating ticket:', error);
        }
      });
  }


  returnTicket(ticketId: string): void {
    /*
    this.ticketService.returnUserTicket(this.userId, ticketId)
      .subscribe({
        next: response => {
          console.log('Ticket returned successfully:', response);
          // refresh tickets after returning
          this.fetchUserTickets();
        },
        error: error => {
          console.error('Error returning ticket:', error);
        }
      });
      
  }
  

  returnQRCode(ticket: any): void {
    
    const qrData = JSON.stringify(ticket); 
    const qrCodeValue = this.qrcodeService.generateQRCode(qrData);
    
    console.log('QR Code Value:', qrCodeValue);
  }


  generateQRCode(data: string): void {
    const qrCodeValue = this.qrcodeService.generateQRCode(data);
    console.log('QR Code Value:', qrCodeValue);



   */


  }


}


