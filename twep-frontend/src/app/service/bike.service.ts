import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environment/environment";
import { Bike } from "../model/bike";
import { BikeStation } from "../model/bikeStation";

@Injectable({ providedIn: 'root' })
export class BikeService{
    private apiUrl: string = environment.BASE_URL;

    constructor(private http: HttpClient) { }

    public getBikes(): Observable<Bike[]>{
        return this.http.get<Bike[]>(`${this.apiUrl}/management/bikes`);
    }

    public getBike(id: string): Observable<Bike>{
        return this.http.get<Bike>(`${this.apiUrl}/management/bikes/${id}`);
    }

    public createBike(bike: Bike): Observable<any>{
        return this.http.post(`${this.apiUrl}/management/bikes`, bike);
    }

    public updateBike(bike: Bike): Observable<any>{
        return this.http.put(`${this.apiUrl}/management/bikes/${bike.id}`, bike);
    }

    public deleteBike(id: string): Observable<any>{
        return this.http.delete(`${this.apiUrl}/management/bikes/${id}`);
    }

    public assignBikesToStation(bikes: Bike[], bikeStation: BikeStation): Observable<any>{
        const body: object = {
            stationId: bikeStation.id,
            bikeIds: bikes.map(({ id }) => id)
        }
        return this.http.post(`${this.apiUrl}/management/reassign-bikes`, body);
    }

    public getBikesForStation(stationId: string): Observable<Bike[]>{
        return this.http.get<Bike[]>(`${this.apiUrl}/users/stations/${stationId}/bikes`);
    }

}