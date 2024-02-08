import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environment/environment";

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl: string = environment.BASE_URL;

  constructor(private http: HttpClient) { }

  public getUserTickets(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${userId}/account/tickets`);
  }

  public createUserTicket(userId: string, ticketDetails: any): Observable<any> {
    const url = `${this.apiUrl}/users/${userId}/account/tickets`;
    return this.http.post(url, ticketDetails);
  }




}
