import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

import { AdminTableComponent } from '../admin-table/admin-table.component';
import { BikeService } from '../../service/bike.service';
import { Bike } from '../../model/bike';
@Component({
  selector: 'app-bikes-list',
  standalone: true,
  imports: [
    AdminTableComponent,
    MatButtonModule,
    MatTableModule
  ],
  templateUrl: './bikes-list.component.html',
  styleUrl: './bikes-list.component.scss'
})
export class BikesListComponent {
  runningAction: boolean = false;
  bikes: Bike[] = [];

  constructor(
    private bikeService: BikeService,
    private router: Router,
  ) {
    this.getBikes();
   }
  
  getBikes(): void {
    this.runningAction = true;

    this.bikeService.getBikes().subscribe({
      next: (bikes: Bike[]): void => {
        this.bikes = bikes;
        this.runningAction = false;
      },
      error: (): void => {
        this.runningAction = false;
      }
    })
  }

  createBike(): void {
    this.router.navigateByUrl(`/admin/bikes/new`)
  }

  openBikeDetail(bike: Bike): void {
    this.router.navigateByUrl(`/admin/bikes/${bike.id}`)
  }

  get columns(): string[] {
    return [
      "id",
      "model",
      "station"
    ]
  }
}
