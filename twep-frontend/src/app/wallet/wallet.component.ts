import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';


import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { BikeStationService } from '../service/bikeStation.service';
import { BikeStation } from '../model/bikeStation';
import { Location } from '../model/location';


import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';

import { WalletService } from '../service/wallet.service';
import {AuthService} from '../service/auth.service';





@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [    
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    LeafletModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatToolbarModule,
    LeafletModule,
    MatCheckboxModule,
    MatDividerModule,
    MatSelectModule,
    
  
  
  ],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.scss',
  providers: [AuthService]
})
export class WalletComponent {
  addMoneyFormControl = new FormControl('', [Validators.required]);
  removeMoneyFormControl = new FormControl('', [Validators.required]);

  userId: string | null = null;

  constructor(
    private walletService: WalletService,
    private authService: AuthService,
    
    ) {this.getUserId();}

    getUserId(): void {
      this.userId = this.authService.getLoggedInUserId(); 
    }

    saveAdding(): void {
      const amountToAdd: number = parseFloat(this.addMoneyFormControl.value!);

      
      if (!isNaN(amountToAdd)) {
        this.walletService.addMoneyToWallet(this.userId!, amountToAdd)
          .subscribe({
          next: response => {
            console.log('Money got added to wallet: ', response);
          },
          error: error => {
            console.error('Error while adding money', error);
          }
        });
  
       
  }
}





  saveRemoving(): void {
    
    const amountToRemove: number = parseFloat(this.removeMoneyFormControl.value!);
    
    
  
    if (!isNaN(amountToRemove)) {
      this.walletService.removeMoneyFromWallet(this.userId!, amountToRemove)
        .subscribe({
        next: response => {
          console.log('Money removed from wallet: ', response);
      
        },
        error: error => {
          console.error('Error while removing money', error);
         
        }
      });

        
  }
  
  }
}



