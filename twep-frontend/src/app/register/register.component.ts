import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RegisterService } from '../service/register.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from '../../app/app.component';


import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { LoadingOverlayComponent } from '../common/loading-overlay/loading-overlay.component';
import { LoginUser } from '../model/loginUser';
import { AuthService } from '../service/auth.service';



export class AppModule { }

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
    ReactiveFormsModule,
    LoadingOverlayComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  runningAction: boolean = false;
  showPassword: boolean = false;
  registerForm: FormGroup;

  constructor(private registerService: RegisterService) {
    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      fullName: new FormControl('', Validators.required),
      // Add more fields as needed for registration
    });
  }

  register(): void {
    const username: string = this.username?.value;
    const password: string = this.password?.value;
    const email: string = this.email?.value;
    const registrationData = { username, password };

    this.runningAction = true;
    this.registerService.register(registrationData).subscribe({
      next: (response: any): void => {
        // Handle successful registration response
        this.runningAction = false;
      },
      error: (error: any): void => {
        console.error(error);
        // Handle registration error
        this.runningAction = false;
      },
    });
  }

  get username() {
    return this.registerForm.get('username');
  }

  get password() {
    return this.registerForm.get('password');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get fullName() {
    return this.registerForm.get('fullName');
  }
}
