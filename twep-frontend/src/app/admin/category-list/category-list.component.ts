import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

import { AdminTableComponent } from '../admin-table/admin-table.component';
import { BikeCategory } from '../../model/bikeCategory';
import { BikeCategoryService } from '../../service/bikeCategory.service';
import { DialogService } from '../../service/dialog.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    AdminTableComponent
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent {
  runningAction: boolean = false
  bikeCategories: BikeCategory[] = [];


  constructor(
    private bikeCategoryService: BikeCategoryService,
    private dialogService: DialogService,
  ) {
    this.getCategories();
  }


  getCategories(): void{
    this.runningAction = true;
    this.bikeCategoryService.getBikeCategories().subscribe({
      next: (bikeCategories: BikeCategory[]) => {
        this.bikeCategories = bikeCategories;
        this.runningAction = false;
      },
      error: (): void => {
        this.runningAction = false;
      }
    });

  }

  async createCategory(): Promise<void> {
    const categoryName: string | null = await this.dialogService.openPromptDialog(
      "Create category",
      "Please give a new category name",
      "Category"
    );

    if (categoryName === null) return;
    const bikeCategory: BikeCategory = new BikeCategory('', categoryName);
    this.bikeCategoryService.createBikeCategory(bikeCategory).subscribe({
      next: (): void => {
        this.runningAction = false;
        this.getCategories();
      },
      error: (): void => {
        this.runningAction = false;
        this.createCategory();
      }
    })
  }

  async editCategory(bikeCategory: BikeCategory): Promise<void>{
    if (bikeCategory.id === undefined) return;
    const categoryName: string | null = await this.dialogService.openPromptDialog(
      `Update category "${bikeCategory.name}"`,
      "Please enter new name",
      "Category",
      bikeCategory?.name
    );

    if (categoryName === null) return;
    this.bikeCategoryService.updateBikeCategory(new BikeCategory(bikeCategory.id, categoryName)).subscribe({
      next: (): void => {
        this.runningAction = false;
        this.getCategories();
      },
      error: (): void => {
        this.runningAction = false;
        this.createCategory();
      }
    })
  }

  async deleteCategory(bikeCategory: BikeCategory): Promise<void> {
    if (bikeCategory?.id === undefined) return; 
      const confirmed: boolean = await this.dialogService.openConfirmDialog(
        `Delete category?`,
        `Do you really want to delete category "${bikeCategory.name}"? This cannot be undone!`
      )
    if (!confirmed) return;
    
    this.runningAction = true;
    this.bikeCategoryService.deleteBikeCategory(bikeCategory.id).subscribe({
      next: (): void => {
        this.runningAction = false;
        this.getCategories();
      },

      error: (): void => {
        this.runningAction = false;
      }
    })
  }
  
  get columns(): string[] {
    return [
      "name",
      "actions"
    ]
  }
}
