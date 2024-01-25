import { Component, Input } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingOverlayComponent } from '../../common/loading-overlay/loading-overlay.component';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';

import { BikeModel } from '../../model/bikeModel';
import { BikeModelService } from '../../service/bikeModel.service';
import { BikeCategory } from '../../model/bikeCategory';
import { BikeCategoryService } from '../../service/bikeCategory.service';
import { DialogService } from '../../service/dialog.service';

class BikeFeature {
  value: string = "";
}

@Component({
  selector: 'app-model-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSelectModule,
    LoadingOverlayComponent
  ],
  templateUrl: './model-detail.component.html',
  styleUrl: './model-detail.component.scss'
})
export class ModelDetailComponent {
  runningAction: boolean = false;
  bikeModelForm: FormGroup;
  modelId?: string;
  bikeModelName: string = "";
  bikeModel?: BikeModel;
  bikeCategories: BikeCategory[] = [];
  extraFeatures: BikeFeature[] = [];
  
  @Input()
  set id(modelId: string) {
    this.modelId = encodeURIComponent(modelId);
    this.loadModel();
  }

  constructor(
    private router: Router,
    private bikeModelService: BikeModelService,
    private bikeCategoryService: BikeCategoryService,
    private dialogService: DialogService,
  ) {
    this.bikeModelForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      wheelSize: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  goBackToOverview(): void{
    this.router.navigateByUrl("/admin/models");
  }

  loadModel(): void {
    if (this.modelId === null || this.modelId === undefined) {
      return; 
    }

    if (this.isNew) {
      this.bikeModelName = "New bike model"
      this.bikeModel = new BikeModel("", "", "", 0, "");
    } else {
      this.runningAction = true;
      this.bikeModelService.getBikeModel(this.modelId).subscribe({
        next: (bikeModel: BikeModel): void => {
          this.bikeModel = bikeModel;
          this.bikeModelName = this.bikeModel.name;
          this.updateForm(bikeModel);
          this.runningAction = false;
        },
        error: (): void => {
          this.runningAction = false;
        }
      })
    }
  }

  updateModel(): void {
    if (this.bikeModelForm.invalid || this.bikeModel === undefined) return;
    this.runningAction = true;
    const bikeModel: BikeModel = this.bikeModel;
    bikeModel.name = this.name?.value;
    bikeModel.bikeCategory = this.category?.value;
    bikeModel.wheelSize = this.wheelSize?.value;
    bikeModel.description = this.description?.value;
    bikeModel.extraFeatures = this.extraFeatures.filter(({ value }) => {
      return value !== "" && value !== null && value !== undefined
    }).map(({ value }) => value ?? "");

    if (this.isNew) {
      this.bikeModelService.createBikeModel(bikeModel).subscribe({
        next: (response: any): void => {
          const id: string = response?.id;
          if(id !== undefined && id !== null && id !== ""){
            this.router.navigateByUrl(`/admin/models/${id}`);
          }else{
            this.router.navigateByUrl("/admin/models");
          }
        },
        error: (): void => {
          this.runningAction = false;
        }
      })
    } else {
      this.bikeModelService.updateBikeModel(bikeModel).subscribe({
        next: (): void => {
          this.runningAction = false;
        },
        error: (): void => {
          this.runningAction = false;
        }
      })
    }
  }
  
  async deleteModel(): Promise<void> {
    if (this.bikeModel?.id === undefined) return;

    const confirmed: boolean = await this.dialogService.openConfirmDialog(
      "Delete model?",
      "Do you really want to delete the model? This cannot be undone!"
    )

    if (!confirmed) return;

    this.runningAction = true;
    this.bikeModelService.deleteBikeModel(this.bikeModel.id).subscribe({
      next: (): void => {
        this.runningAction = false;
        this.router.navigateByUrl("/admin/models");
        return;
      },
      error: (): void => {
        this.runningAction = false;
      }
    });
  }

  updateForm(bikeModel: BikeModel): void {
    this.bikeModelForm.patchValue({
      id: bikeModel.id,
      name: bikeModel.name,
      description: bikeModel.description,
      wheelSize: bikeModel.wheelSize
    })
    this.extraFeatures = bikeModel.extraFeatures.map(feature => {
      return { value: feature }
    });
  }

  loadCategories(): void{
    this.bikeCategoryService.getBikeCategories().subscribe({
      next: (bikeCategories: BikeCategory[]): void => {
        this.bikeCategories = bikeCategories;
      }
    })
  }

  addFeature(): void {
    this.extraFeatures.push(new BikeFeature());
  }

  updateFeature(feature: BikeFeature, event: Event): void {
    const value: string = (event.target as HTMLInputElement).value ?? "";
    feature.value = value;
  }

  removeFeature(index: number): void {
    this.extraFeatures.splice(index, 1);
  }

  get isNew(): boolean {
    return this.modelId === "new";
  }

  get name(): AbstractControl<any, any> | null {
    return this.bikeModelForm.get("name");
  }

  get wheelSize(): AbstractControl<any, any> | null {
    return this.bikeModelForm.get("wheelSize");
  }

  get description(): AbstractControl<any, any> | null {
    return this.bikeModelForm.get("description");
  }

  get category(): AbstractControl<any, any> | null {
    return this.bikeModelForm.get("category");
  }

}
