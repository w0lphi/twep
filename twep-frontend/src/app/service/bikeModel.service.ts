import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environment/environment";
import { BikeModel } from "../model/bikeModel";

@Injectable({ providedIn: 'root' })
export class BikeModelService{
    private apiUrl: string = environment.BASE_URL;

    constructor(private http: HttpClient) { }

    public getBikeModels(): Observable<BikeModel[]>{
        return this.http.get<BikeModel[]>(`${this.apiUrl}/management/bike-models`);
    }

    public getBikeModel(id: string): Observable<BikeModel>{
        return this.http.get<BikeModel>(`${this.apiUrl}/management/bike-models/${id}`)
    }

    public createBikeModel(bikeModel: BikeModel): Observable<any>{
        return this.http.post(`${this.apiUrl}/management/bike-models`, bikeModel)
    }

    public updateBikeModel(bikeModel: BikeModel): Observable<any>{
        return this.http.put(`${this.apiUrl}/management/bike-models/${bikeModel.id}`, bikeModel)
    }

    public deleteBikeModel(id: string): Observable<any>{
        return this.http.delete(`${this.apiUrl}/management/bike-models/${id}`)
    }
}