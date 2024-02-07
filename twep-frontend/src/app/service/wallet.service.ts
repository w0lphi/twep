import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environment/environment";

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private apiUrl: string = environment.BASE_URL;

  constructor(private http: HttpClient) { }

  public addMoneyToWallet(userId: string, amountToAdd: number): Observable<any> {
    const requestBody = { amount: amountToAdd };
    return this.http.post(`${this.apiUrl}/users/${userId}/account/add-money`, requestBody);
  }

  public removeMoneyFromWallet(userId: string, amountToRemove: number): Observable<any> {
    const requestBody = { amount: amountToRemove };
    return this.http.post(`${this.apiUrl}/users/${userId}/account`, requestBody);
  }


  public getWalletStatus(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${userId}/account`);
  }
}
