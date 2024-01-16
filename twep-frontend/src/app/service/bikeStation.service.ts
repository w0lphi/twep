import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environment/environment";
import { BikeStation } from "../model/bikeStation";

@Injectable({ providedIn: 'root' })
export class BikeStationService{
    private apiUrl: string = environment.BASE_URL;

    constructor(private http: HttpClient) { }

    public getBikeStations(): Observable<BikeStation[]>{
        return this.http.get<BikeStation[]>(`${this.apiUrl}/management/stations`);
    }

    public getBikeStation(id: string): Observable<BikeStation>{
        return this.http.get<BikeStation>(`${this.apiUrl}/management/stations/${id}`)
    }

    public createBikeStation(bikeStation: BikeStation): Observable<any>{
        return this.http.post(`${this.apiUrl}/management/stations`, bikeStation)
    }

    public updateBikeStation(bikeStation: BikeStation): Observable<any>{
        return this.http.put(`${this.apiUrl}/management/stations/${bikeStation.id}`, bikeStation)
    }

    public deleteBikeStation(id: string): Observable<any>{
        return this.http.delete(`${this.apiUrl}/management/stations/${id}`)
    }
}