import { Component, Input, NgZone } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';

import { Bike } from '../../model/bike';
import { BikeModel } from '../../model/bikeModel';
import { BikeStation } from '../../model/bikeStation';
import { BikeService } from '../../service/bike.service';
import { BikeModelService } from '../../service/bikeModel.service';
import { BikeStationService } from '../../service/bikeStation.service';
import { LoadingOverlayComponent } from '../../common/loading-overlay/loading-overlay.component';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletUtil } from '../../util/leaflet-util'
import * as Leaflet from 'leaflet';
import { DialogService } from '../../service/dialog.service';

@Component({
  selector: 'app-bike-detail',
  standalone: true,
  imports: [
    LoadingOverlayComponent,
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSelectModule,
    LeafletModule
  ],
  templateUrl: './bike-detail.component.html',
  styleUrl: './bike-detail.component.scss'
})
export class BikeDetailComponent {
  runningAction: boolean = false;
  loadAssignBikes: boolean = false;
  bikeId?: string;
  bike?: Bike;
  bikeName: string = "";
  bikeForm: FormGroup;
  bikeStations: BikeStation[] = [];
  bikeModels: BikeModel[] = [];
  options: Leaflet.MapOptions = {};
  layers: Leaflet.Layer[] = [];
  map?: Leaflet.Map;

  @Input()
  set id(bikeId: string) {
    this.bikeId = encodeURIComponent(bikeId);
    this.loadBike();
  }

  constructor(
    private bikeService: BikeService,
    private bikeModelService: BikeModelService,
    private bikeStationService: BikeStationService,
    private router: Router,
    private dialogService: DialogService,
    private zone: NgZone,
  ) {
    this.bikeForm = new FormGroup({
      id: new FormControl({value: null, disabled: true}),
      model: new FormControl("", Validators.required),
    });
  }

  ngOnInit(): void {
    this.options = LeafletUtil.mapOptions;
    this.loadModels();
    this.loadStations();
  }

  onMapReady(map: Leaflet.Map): void {
    this.map = map;
    this.updateBikeLocation();
    this.updateStationMarkers();
  }

  loadBike(): void{
    if (this.bikeId === null || this.bikeId === undefined) {
      return;
    }

    if (this.isNew) {
      this.bikeName = "New bike"
      this.bike = new Bike("", "");
    } else {
      this.runningAction = true;

      this.bikeService.getBike(this.bikeId).subscribe({
        next: (bike: Bike): void => {
          this.bike = bike;
          this.bikeName = `Bike ${bike.id}`;
          this.updateForm(bike);
          this.runningAction = false;
        },
        error: (): void => {
          this.runningAction = false;
        }
      })
    }
  }

  upsertBike(): void{
    const bikeModelId: string = this.model?.value;
    if (this.bike === undefined || bikeModelId === undefined) return;
    this.runningAction = true;
    const bike: Bike = new Bike(this.bike.id, bikeModelId);
    if (this.isNew) {
      this.bikeService.createBike(bike).subscribe({
         next: (response: any): void => {
          const id: string = response?.individualBike?.id;
          if(id !== undefined && id !== null && id !== ""){
            this.router.navigateByUrl(`/admin/bikes/${id}`);
          }else{
            this.router.navigateByUrl("/admin/bikes");
          }
        },
        error: (): void => {
          this.runningAction = false;
        }
      })
    } else {
      
    }
  }

  async deleteBike() {
     if (this.bike?.id === undefined) return;

    const confirmed: boolean = await this.dialogService.openConfirmDialog(
      "Delete bike?",
      "Do you really want to delete the bike? This cannot be undone!"
    )

    if(!confirmed) return;

    this.runningAction = true;
    this.bikeService.deleteBike(this.bike?.id).subscribe({
      next: (): void => {
        this.runningAction = false;
        this.router.navigateByUrl("/admin/bikes");
        return;
      },
      error: (): void => {
        this.runningAction = false;
      }
    });
  }

  async assignToStation(bikeStation: BikeStation): Promise<void> {
    this.zone.run(async () => {
      if (this.bike?.id === undefined) return;

      const confirmed: boolean = await this.dialogService.openConfirmDialog(
        `Assign bike to station ${bikeStation.name}?`,
        "The bike will be removed from the previous station"
      )

      if (!confirmed) return;

      this.loadAssignBikes = true;
      this.bikeService.assignBikesToStation(this.bike.id, bikeStation.id).subscribe({
        next: (): void => {
          this.loadAssignBikes = false;
          this.loadBike();
        },
        error: (): void => {
          this.loadAssignBikes = false;
        }
      })
    })
  }

  loadModels(): void {
    this.bikeModelService.getBikeModels().subscribe({
      next: (bikeModels: BikeModel[]): void => {
        this.bikeModels = bikeModels;
      },
    })
  }

  loadStations(): void {
    this.bikeStationService.getBikeStations().subscribe({
      next: (stations: BikeStation[]): void => {
        this.bikeStations = stations;
        this.updateStationMarkers();
      }
    })
  }

  updateStationMarkers(): void{
    this.zone.run(() => {
      this.layers = this.bikeStations.map((station) => {
        const latitude: number = station.location.latitude;
        const longitude: number = station.location.longitude;
        const isCurrentStation: boolean = station.id === this.bike?.station?.id;
        const marker: Leaflet.Marker<any> = LeafletUtil.getStationMarker(latitude, longitude, {disabled: isCurrentStation});
        if(isCurrentStation){
          marker.bindPopup("Bike is currently assigned to this station");
        }else{
          marker.addEventListener('click', () => this.assignToStation(station));
        }
        return marker;
      })
    })
  }

  updateForm(bike: Bike): void {
    this.bikeForm.patchValue({
      id: bike.id,
      model: bike.modelId,
    });
  }

  updateBikeLocation(): void{
    const latitude: number | undefined = this.bike?.station?.location.latitude;
    const longitude: number | undefined = this.bike?.station?.location.longitude;
    if(this.map !== undefined && latitude !== undefined && longitude !== undefined){
      this.map.setView(new Leaflet.LatLng(latitude, longitude), 14);
    }
  }

  goBackToOverview(): void {
    this.router.navigateByUrl("/admin/bikes");
  }

  get isNew(): boolean{
    return this.bikeId === "new"
  }

  get model(): AbstractControl<any, any> | null{
    return this.bikeForm.get("model");
  }

  get assignedBikeStation(){
    return this.bike?.station?.name ?? 'Not assigned to any station yet'
  }
}
