import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AdminTableComponent } from '../admin-table/admin-table.component';
import { BikeModel } from '../../model/bikeModel';
import { BikeModelService } from '../../service/bikeModel.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-model-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    AdminTableComponent
  ],
  templateUrl: './model-list.component.html',
  styleUrl: './model-list.component.scss'
})
export class ModelListComponent {
  runningAction: boolean = false;
  bikeModels: BikeModel[] = [];

  constructor(
    private bikeModelService: BikeModelService,
    private router: Router,
  ){
    this.getModels();
  }


  createModel(): void{
    this.router.navigateByUrl("/admin/models/new")
  }

  getModels(): void{
    this.runningAction = true;
    this.bikeModelService.getBikeModels().subscribe({
      next: (bikeModels: BikeModel[]): void => {
        this.bikeModels = bikeModels;
        this.runningAction = false;
      },
      error: (): void => {
        this.runningAction = false;
      }
    });
  }

  openModelDetail(bikeModel: BikeModel): void {
    this.router.navigateByUrl(`/admin/models/${bikeModel.id}`);
  }

  get columns(): string[]{
    return [
      "name",
      "description",
    ]
  }
}
