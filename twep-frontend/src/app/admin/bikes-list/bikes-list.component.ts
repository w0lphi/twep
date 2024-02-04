import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

import { AdminTableComponent } from '../admin-table/admin-table.component';
import { BikeService } from '../../service/bike.service';
import { Bike } from '../../model/bike';
import { BikeModelService } from '../../service/bikeModel.service';
import { BikeModel } from '../../model/bikeModel';
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
  bikeModels: BikeModel[] = [];

  constructor(
    private bikeService: BikeService,
    private bikeModelService: BikeModelService,
    private router: Router,
  ) {
    this.loadBikeModels();
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

  loadBikeModels(): void {
    this.bikeModelService.getBikeModels().subscribe({
      next: (bikeModels: BikeModel[]) => {
        this.bikeModels = bikeModels;
      }
    })
  }

  getBikeModelName(bike: Bike): string {
    const model: BikeModel | undefined = this.bikeModels.find(({ id }) => bike.bikeModelId === id);
    console.log(this.bikeModels, bike);
    return model?.name ?? "-";
  }

  get columns(): string[] {
    return [
      "id",
      "model",
      "status"
    ]
  }
}
