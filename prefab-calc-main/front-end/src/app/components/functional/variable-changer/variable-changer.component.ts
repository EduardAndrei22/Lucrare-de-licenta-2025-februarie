import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { StateService } from '../../../services/state.service';
import { catchError } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-variable-changer',
  standalone: true,
  imports: [
    CardModule,
    FloatLabelModule,
    ReactiveFormsModule,
    PasswordModule,
    ButtonModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './variable-changer.component.html',
  styleUrl: './variable-changer.component.scss',
})
export class VariableChangerComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private state: StateService,
    private messageService: MessageService,
  ) {}

  masterPassword: FormGroup = new FormGroup({
    currentPassword: new FormControl(''),
    newPassword: new FormControl(''),
  });

  ngOnInit(): void {
    this.masterPassword = this.formBuilder.group({
      currentPassword: [''],
      newPassword: [''],
    });
  }

  changeMasterPassword(): void {
    this.http
      .post(`${this.state.BACKEND_API}api/auth/master/change/`, {
        access_token: localStorage.getItem('access_token'),
        currentPassword: this.masterPassword.value.currentPassword,
        newPassword: this.masterPassword.value.newPassword,
      })
      .pipe(
        catchError((error: any): any => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.error,
          });
          console.log(error);
        }),
      )
      .subscribe((response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Password changed successfully!',
        });
      });
  }
}
