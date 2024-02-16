import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environment/environment";
import { Ticket } from "../model/ticket";

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl: string = environment.BASE_URL;

  constructor(private http: HttpClient) { }

  public getUserTickets(userId: string): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/users/${userId}/account/tickets`);
  }

  public createUserTicket(userId: string, ticket: UserTicketRequest): Observable<CreateUserTicketResponse> {
    return this.http.post<CreateUserTicketResponse>(`${this.apiUrl}/users/${userId}/account/tickets`, ticket);
  }

  public calculateTicketPrice(request: TicketPriceRequest): Observable<TicketPriceResponse> {
    return this.http.post<TicketPriceResponse>(`${this.apiUrl}/users/tickets/price`, request);
  }

  public cancelUserTicket(ticketId: string){
    return this.http.delete<TicketPriceResponse>(`${this.apiUrl}/users/account/tickets/${ticketId}`);
  }

  public simulateRideBike(ticketId: string, userId: string): Observable<any>{
    return this.http.post(`${this.apiUrl}/users/${userId}/tickets/${ticketId}/ride`, null)
  }

  public simulateReturnBike(ticketId: string, userId: string, stationId: string): Observable<any>{
    return this.http.post(`${this.apiUrl}/users/${userId}/tickets/${ticketId}/return`, { stationId });
  }

  public getAllOverdueTickets(){
    return this.http.get<OverdueTicket[]>(`${this.apiUrl}/management/overdue-tickets`);
  }
}

export type UserTicketRequest = {
  bikeId: string,
  fromDate: string,
  untilDate: string,
  immediateRenting: boolean,
}

export type CreateUserTicketResponse = {
  ticket: Ticket;
}

export type TicketPriceRequest = {
  bikeId: string,
  fromDate: string,
  untilDate: string,
}

export type TicketPriceResponse = {
  price: number
}

export type OverdueTicket = {
  ticketId: string,
  fromDate: string,
  untilDate: string,
  bike: OverdueBike,
  user: OverdueUser,
}

export type OverdueBike = {
  id: string,
  model: string
}

export type OverdueUser = {
  id: string,
  email: string,
}
