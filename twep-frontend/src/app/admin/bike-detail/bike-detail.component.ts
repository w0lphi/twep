import { Component, Input } from '@angular/core';
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
  ) {
    this.bikeForm = new FormGroup({
      model: new FormControl("", Validators.required),
      station: new FormControl("", Validators.required)
    });
  }

  ngOnInit(): void {
    this.options = LeafletUtil.mapOptions;
    this.loadModels();
    this.loadStations();
  }

  onMapReady(map: Leaflet.Map): void {
    this.map = map;
  }

  loadBike(): void{
    if (this.bikeId === null || this.bikeId === undefined) {
      return;
    }

    if (this.isNew) {
      this.bikeName = "New bike"
      this.bike = new Bike("");
    } else {
      this.runningAction = true;

      this.bikeService.getBike(this.bikeId).subscribe({
        next: (bike: Bike): void => {
          this.bike = bike;
          this.bikeName = bike.id;
          this.runningAction = false;
        },
        error: (): void => {
          this.runningAction = false;
        }
      })
    }
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
      next: (bikeStations: BikeStation[]): void => {
        this.bikeStations = bikeStations;
        this.layers = bikeStations.map((station) => {
          const latitude: number = station.location.latitude;
          const longitude: number = station.location.longitude;
          const marker: Leaflet.Marker<any> = LeafletUtil.getStationMarker(latitude, longitude)
          return marker;
        })
      }
    })
  }

  goBackToOverview() {
    this.router.navigateByUrl("/admin/bikes");
  }

  get isNew(): boolean{
    return this.bikeId === "new"
  }

  get model(): AbstractControl<any, any> | null{
    return this.bikeForm.get("model");
  }
}
