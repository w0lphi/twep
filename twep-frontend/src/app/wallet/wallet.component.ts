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
  styleUrl: './wallet.component.scss'
})
export class WalletComponent {
  addMoneyFormControl = new FormControl('', [Validators.required]);
  removeMoneyFormControl = new FormControl('', [Validators.required]);



  constructor(private walletService: WalletService) {}


  saveAdding(amount: number): void {
    const userId: number = 123; 
    const amountToRemove: number = 50; 

    this.walletService.addMoneyToWallet(userId, amount)
      .subscribe({
        next: response => {
          console.log('Money got added to wallet: ', response);
  
        },
        error: error => {
          console.error('Error while adding money', error);
        }
      });


      // ToDo: userid is just for testing, amount is fixed.
  }
  


  saveRemoving(): void {
    const userId: number = 123; 
    const amountToRemove: number = 50; 
  
    this.walletService.removeMoneyFromWallet(userId, amountToRemove)
      .subscribe({
        next: response => {
          console.log('Money removed from wallet: ', response);
      
        },
        error: error => {
          console.error('Error while removing money', error);
         
        }
      });

       // ToDo: userid is just for testing, amount is fixed.
  }
  

  







}
