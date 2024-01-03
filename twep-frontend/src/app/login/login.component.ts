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

  constructor(private loginService: LoginService) {
    //Create form group for input validation
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    })
  }

  login(): void{
    const username: string = this.username?.value;
    const password: string = this.password?.value;
    const loginUser: LoginUser = new LoginUser(username, password);
    this.runningAction = true;
    this.loginService.login(loginUser).subscribe({
      next: (): void => {
        //TODO: Redirect to next page
        this.runningAction = false;
      },
      error: (error: any): void => {
        console.error(error);
        //Set the username in error state and tell the user 
        //that login was not possible
        this.username?.setErrors({ invalidCredentials: true })
        this.runningAction = false;
      },
    });
  }

  get username(): AbstractControl<any, any> | null {
    return this.loginForm.get('username');
  }

  get password(): AbstractControl<any, any> | null {
    return this.loginForm.get('password');
  }
}
