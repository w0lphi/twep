import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

import { LoginUser } from '../model/loginUser';
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    RouterModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginUser: LoginUser;
  errorMessage?: string;
  showPassword: boolean = false;
  inputFormControl: FormControl = new FormControl('', [Validators.required])

  constructor(private loginService: LoginService) {
    this.loginUser = new LoginUser()
  }

  login(): void{
    console.log("Username", this.loginUser.username);
    console.log("Password", this.loginUser.password);
    //TODO: Error handling
    this.loginService.login(this.loginUser).subscribe({
      next: (): void => {
        return;
      },
      error: (error: any): void => {
        alert(error);
      }
    });
  }
}
