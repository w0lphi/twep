import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

import { LoadingOverlayComponent } from '../../common/loading-overlay/loading-overlay.component';
import { BikeModel } from '../../model/bikeModel';
import { BikeModelService } from '../../service/bikeModel.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-model-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatToolbarModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    LoadingOverlayComponent
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

  get columns(): string[]{
    return [
      "name",
      "description",
    ]
  }
}
