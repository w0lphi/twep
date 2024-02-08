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


import { AccountService } from '../service/account.service';
import { UserAccount } from '../model/user-account';

import { ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { Pipe, PipeTransform } from '@angular/core';

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
  walletAmount: number | null = null;

  uploadedImage: SafeUrl | undefined;

  saveSuccessMessage: string | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private walletService: WalletService,
    
    ) { this.getUserId();}

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
      this.accountService.getUserAccount(this.loggedInUserId).subscribe(
        (data: UserAccount) => {
          this.userAccount = data;
        },
        (error) => {
          console.error('Error fetching user account:', error);
        }
      );
    }
  }



  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.uploadedImage = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
        console.log('Uploaded image:', this.uploadedImage); 
      };
    }
  }
  




saveAdding(): void {
    const amountToAdd: number = parseFloat(this.addMoneyFormControl.value!);

    if (!isNaN(amountToAdd)) {
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
}

  
