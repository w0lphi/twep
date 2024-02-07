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
import { TicketService } from '../service/tickets.service'; 
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import {AuthService} from '../service/auth.service';


@Component({
  selector: 'app-history',
  standalone: true,
  imports: [ CommonModule,
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
    MatSelectModule,],
    templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
 providers: [TicketService]
})
export class HistoryComponent implements OnInit  {
  userTickets: any[] = [];
  loggedInUserId: string | null = null;
  userId: string = '';

  constructor(
    private authService: AuthService,
    private ticketService: TicketService
  ) {}

  fetchUserTickets(): void { 
    
    this.ticketService.getUserTickets(this.userId)
      .subscribe({
        next: response => {
          this.userTickets = response.tickets;
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

  


 
}