import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environment/environment";
import { Bike } from "../model/bike";

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl: string = environment.BASE_URL;

  constructor(private http: HttpClient) { }

  public getUserTickets(userId: string): Observable<UserTicket[]> {
    return this.http.get<UserTicket[]>(`${this.apiUrl}/users/${userId}/account/tickets`);
  }

  public createUserTicket(userId: string, ticket: UserTicketRequest): Observable<any> {
    const url = `${this.apiUrl}/users/${userId}/account/tickets`;
    return this.http.post(url, ticket);
  }

  public calculateTicketPrice(ticket: UserTicketRequest): Observable<TicketPriceResponse> {
    const url = `${this.apiUrl}/users/account/tickets`;
    return this.http.post<TicketPriceResponse>(url, ticket);
  }
}

export type UserTicketRequest = {
  bikeId: string,
  fromDate: string,
  untilDate: string,
  immediateRenting: boolean,
}

export type UserTicket = {
  fromDate: string,
  untilDate: string,
  immediateRenting: boolean,
  bike: Bike,
  qrcode: string,
}

export type TicketPriceResponse = {
  price: number
}
