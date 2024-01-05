import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { LoadingOverlayComponent } from '../common/loading-overlay/loading-overlay.component';
import { LoginUser } from '../model/loginUser';
import { AuthService } from '../service/auth.service';

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
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  runningAction: boolean = false;
  showPassword: boolean = false;
  loginForm: FormGroup;

  constructor(private authService: AuthService) {
    //Create form group for input validation
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    })
  }

  login(): void{
    const email: string = this.email?.value;
    const password: string = this.password?.value;
    const loginUser: LoginUser = new LoginUser(email, password);
    this.runningAction = true;
    this.authService.login(loginUser).subscribe({
      next: (res: any): void => {
        const token: string | null = res?.token;
        if(token) this.authService.setSession(res?.token);
        this.runningAction = false;
        //TODO: Redirect to next page
      },
      error: (error: any): void => {
        console.error(error);
        //Set the email in error state and tell the user 
        //that login was not possible
        this.email?.setErrors({ invalidCredentials: true })
        this.runningAction = false;
      },
    });
  }

  get email(): AbstractControl<any, any> | null {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl<any, any> | null {
    return this.loginForm.get('password');
  }
}
