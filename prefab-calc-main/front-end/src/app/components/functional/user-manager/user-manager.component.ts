import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { catchError } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { NgIf } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';

@Component({
  selector: 'app-user-manager',
  standalone: true,
  imports: [
    ConfirmDialogModule,
    ToastModule,
    CardModule,
    DividerModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    RippleModule,
    TableModule,
    ToggleButtonModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './user-manager.component.html',
  styleUrl: './user-manager.component.scss',
})
export class UserManagerComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  userList: any[] = [];
  adminList: any[] = [];
  cols: any[] = [
    { field: 'id', header: 'ID' },
    { field: 'username', header: 'Nume' },
    { field: 'email', header: 'Email' },
  ];

  ngOnInit(): void {
    this.initUserList();
  }

  initUserList(): void {
    this.authService
      .fetchUsers()
      .pipe(
        catchError((error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.detail,
          });
          return [];
        }),
      )
      .subscribe((users: any) => {
        const currentUser = this.authService.getCurrentUserId();
        this.userList = users.filter((user: any) => user.id !== currentUser);
      });
  }

  setUserAsAdmin(user: any, $event: any) {
    this.confirmationService.confirm({
      target: $event.target as EventTarget,
      message: 'Vrei să faci acest utilizator admin?',
      header: 'Confirmare setare admin',
      icon: 'pi pi-shield',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: 'Da',
      rejectLabel: 'Nu',

      accept: () => {
        this.authService
          .addAdmin(user.username, user.id)
          .pipe(
            catchError((error: any) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.error.detail,
              });
              return [];
            }),
          )
          .subscribe(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Utilizatorul ${user.username} este acum admin`,
            });
          })
          .add(() => {
            this.initUserList();
          });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'Nicio modificare nu a fost făcută',
        });
      },
    });
  }

  removeUserAsAdmin(user: any, $event: any) {
    this.confirmationService.confirm({
      target: $event.target as EventTarget,
      message: 'Vrei ca acest utilizator să nu mai fie admin?',
      header: 'Confirmare ștergere admin',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: 'Da',
      rejectLabel: 'Nu',

      accept: () => {
        this.authService
          .removeAdmin(user.username, user.id)
          .pipe(
            catchError((error: any) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.error.detail,
              });
              return [];
            }),
          )
          .subscribe(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Utilizatorul ${user.username} nu mai este admin`,
            });
          })
          .add(() => {
            this.initUserList();
          });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'Nicio modificare nu a fost făcută',
        });
      },
    });
  }
}
