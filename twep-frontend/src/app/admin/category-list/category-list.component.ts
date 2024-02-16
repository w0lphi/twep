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
import { PromptDialogData } from '../../common/prompt-dialog/prompt-dialog.component';
import { formatCurrency } from '../../util/currency-util';

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
    this.dialogService.openBikeCategoryCreateDialog().subscribe({
      next: (reload: boolean | undefined) => {
        if(reload) this.getCategories();
      }
    });
  }

  async updateCategoryPrice(bikeCategory: BikeCategory): Promise<void>{
    if (bikeCategory.id === undefined) return;
    const data: PromptDialogData = {
      title: `Update price of category "${bikeCategory.name}"`,
      text: "Please enter new hourly rate. Must be a positive number",
      label: "Houry rate (in euros)",
      initialValue: bikeCategory.hourPrice,
      inputType: "number",
      appendIcon: "euro",
    };
    const value: string | null = await this.dialogService.openPromptDialog(data);
    if(value === null) return;
    const hourPrice: number = Number(value);
    if (Number.isNaN(hourPrice)) return;
    this.bikeCategoryService.updateBikeCategoryPrice(bikeCategory.id, hourPrice).subscribe({
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

  getHourlyRate(hourPrice: number){
    return formatCurrency(hourPrice);
  }
  
  get columns(): string[] {
    return [
      "name",
      "price",
      "actions"
    ]
  }
}
