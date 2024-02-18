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

import { TicketStatus } from '../model/ticket';
import { isBefore } from 'date-fns';
import { formatCurrency } from '../util/currency-util';
import { LoadingOverlayComponent } from '../common/loading-overlay/loading-overlay.component';

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
    LoadingOverlayComponent
  
  ],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  providers: [AccountService]
})
export class AccountComponent {
  addMoneyFormControl = new FormControl('', [Validators.required]);
  userAccount!: UserAccount;
  userId: string | null = null;
  saveSuccessMessage: string | null = null;
  runningAction: boolean = false;

  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private walletService: WalletService,
    
    ) { 
      this.loadUserAccount() 
    }


  loadUserAccount() {
    this.userId = this.authService.getLoggedInUserId(); 
    if (this.userId !== null) {
      this.runningAction = true;
        this.accountService.getUserAccount(this.userId).subscribe({
          next: (data: UserAccount) => {
            this.userAccount = data;
            this.runningAction = false;
          },
          error: () => {
            this.runningAction = false;
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

  
