import { Component } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';

import { WalletService } from '../service/wallet.service';
import { OnInit } from '@angular/core';

import {AuthService} from '../service/auth.service';

import { AccountService } from '../service/account.service';
import { UserAccount } from '../model/user-account';

import { ViewChild, ElementRef } from '@angular/core';
import { TicketStatus } from '../model/ticket';
import { isBefore } from 'date-fns';
import { formatCurrency } from '../util/currency-util';

@Component({
  selector: 'app-account',
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
  
  ],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  providers: [AccountService]
})
export class AccountComponent implements OnInit {
  addMoneyFormControl = new FormControl('', [Validators.required]);

  userAccount!: UserAccount;
  loggedInUserId: string | null = null;
  userId: string | null = null;
  saveSuccessMessage: string | null = null;



  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private walletService: WalletService,
    
    ) { 
      this.getUserId()
    }

    getUserId(): void {
      this.userId = this.authService.getLoggedInUserId(); 
    }

  ngOnInit(): void {
    this.loggedInUserId = this.authService.getLoggedInUserId();
    this.userId = this.loggedInUserId || '';
    this.loadUserAccount();
  }

  loadUserAccount() {
    if (this.loggedInUserId) {
        this.accountService.getUserAccount(this.loggedInUserId).subscribe({
          next: (data: UserAccount) => {
            this.userAccount = data;
          }
        }
      );
    }
  }

  saveAdding(): void {
    const amountToAdd: number = Number(this.addMoneyFormControl.value);
    if (!Number.isNaN(amountToAdd)) {
      this.walletService.addMoneyToWallet(this.userId!, amountToAdd)
          .subscribe({
              next: response => {
                  console.log('Money got added to wallet: ', response);
                  this.addMoneyFormControl.reset();
                  this.loadUserAccount();
                  this.saveSuccessMessage = "Money successfully added to wallet.";
                  setTimeout(() => {
                      this.saveSuccessMessage = null; 
                  }, 2000); 
              },
              error: error => {
                  console.error('Error while adding money', error);
              }
          });
    }
  }

  get name(): string{
    return this.userAccount.email.split('@')[0];
  }

  get walletAmount(): string{
    return formatCurrency(this.userAccount.wallet);
  }

  get overdueTicketsCount(): number {
    return this.userAccount.tickets.filter(({untilDate, status }) => {
      return status === TicketStatus.RENTED && isBefore(new Date(untilDate), Date.now());
    }).length;
  }

}

  
