import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { StateService } from '../../services/state.service';
import { ButtonModule } from 'primeng/button';
import { HttpClient } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { catchError } from 'rxjs';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ButtonModule,
    ToastModule,
    CardModule,
    FormsModule,
    InputTextModule,
    FloatLabelModule,
    PasswordModule,
    ReactiveFormsModule,
    DividerModule,
    MessageModule,
  ],
  providers: [MessageService],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({
    registerUsername: new FormControl(''),
    registerEmail: new FormControl(''),
    registerPassword: new FormControl(''),
    registerPasswordConfirm: new FormControl(''),
    masterPassword: new FormControl(''),
  });

  loginForm: FormGroup = new FormGroup({
    loginUsername: new FormControl(''),
    loginPassword: new FormControl(''),
  });

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private state: StateService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }

    this.registerForm = this.formBuilder.group({
      registerUsername: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ],
      ],
      registerEmail: ['', [Validators.required, Validators.email]],
      registerPassword: ['', [Validators.required, Validators.minLength(8)]],
      registerPasswordConfirm: ['', [Validators.required]],
      masterPassword: ['', [Validators.required]],
    });

    this.loginForm = this.formBuilder.group({
      loginUsername: ['', [Validators.required]],
      loginPassword: ['', [Validators.required]],
    });
  }

  registerUser() {
    if (this.registerForm.invalid) {
      return;
    }

    if (
      this.registerForm.value.registerPassword !==
      this.registerForm.value.registerPasswordConfirm
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Service Message',
        detail: 'Passwords do not match',
      });
      this.registerForm.reset({
        registerUsername: this.registerForm.value.registerUsername,
        registerEmail: this.registerForm.value.registerEmail,
        registerPassword: this.registerForm.value.registerPassword,
        registerPasswordConfirm: '',
        masterPassword: '',
      });
      return;
    }

    const username = this.registerForm.value.registerUsername;
    const email = this.registerForm.value.registerEmail;
    const password = this.registerForm.value.registerPassword;
    const masterPassword = this.registerForm.value.masterPassword;

    this.authService
      .register(username, email, password, masterPassword)
      .pipe(
        catchError((error: any): any => {
          this.messageService.add({
            severity: 'error',
            summary: 'Service Message',
            detail: error.error.detail,
          });
          throw error;
        }),
      )
      .subscribe((data: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Service Message',
          detail: data.body.detail,
        });
      });
  }

  loginUser() {
    const username = this.loginForm.value.loginUsername;
    const password = this.loginForm.value.loginPassword;

    this.authService
      .login(username, password)
      .pipe(
        catchError((error: any): any => {
          this.messageService.add({
            severity: 'error',
            summary: 'Service Message',
            detail: error.error.detail,
          });
        }),
      )
      .subscribe((data: any) => {
        if (data.status === 200) {
          this.state.isLoggedIn = true;
          localStorage.setItem('access_token', data.body['access']);
          localStorage.setItem('refresh_token', data.body['refresh']);
          localStorage.setItem('username', username);
          this.state.username = username;
          this.state.isAdmin = data.body['is_admin'];
          this.messageService.add({
            severity: 'success',
            summary: 'Logged in!',
            detail: "You'll be redirected shortly",
          });
          this.loginForm.reset();
          if (this.state.isAdmin) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/home']);
          }
        }
      });
  }
}
