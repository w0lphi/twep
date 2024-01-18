import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { RegisterUser } from '../model/registerUser';

@Injectable({ providedIn: 'root' })
export class RegisterService {
  private apiUrl: string = environment.BASE_URL;

  constructor(private http: HttpClient) {}

  register(registerUser: RegisterUser): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/register`, registerUser);
  }
}
