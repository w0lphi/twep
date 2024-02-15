import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { BikeCategoryService } from '../service/bikeCategory.service';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { BikeCategory } from '../model/bikeCategory';
import { LoadingOverlayComponent } from '../common/loading-overlay/loading-overlay.component';

@Component({
  selector: 'app-create-category-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    LoadingOverlayComponent
  ],
  templateUrl: './create-category-dialog.component.html',
  styleUrl: './create-category-dialog.component.scss'
})
export class CreateCategoryDialogComponent {
  categoryForm: FormGroup;
  runningAction: boolean = false;

  constructor(
     private dialog: MatDialogRef<CreateCategoryDialogComponent, boolean>,
     private bikeCategoryService: BikeCategoryService,
  ){
    this.categoryForm = new FormGroup({
      name: new FormControl("", Validators.required),
      hourPrice: new FormControl(0, [Validators.required, Validators.min(0)]),
    })
  }

  createCategory(): void{
    if(this.categoryForm.invalid) return;
    const categoryName = this.name?.value;
    const hourPrice = this.hourPrice?.value;
    const bikeCategory: BikeCategory = new BikeCategory('', categoryName, hourPrice);
    this.runningAction = true;
    this.bikeCategoryService.createBikeCategory(bikeCategory).subscribe({
      next: (): void => {
        this.runningAction = false;
        this.dialog.close(true);
      },
      error: (): void => {
        this.runningAction = false;
      }
    })
  }

  get name(): AbstractControl<any, any> | null {
    return this.categoryForm.get("name");
  }

  get hourPrice(): AbstractControl<any, any> | null {
    return this.categoryForm.get("hourPrice")
  }
}

