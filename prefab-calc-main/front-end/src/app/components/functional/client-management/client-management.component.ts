import { Component, OnInit } from '@angular/core';
import { StateService } from '../../../services/state.service';
import { ClientService } from '../../../services/client.service';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Client } from '../../../models/Client';
import { catchError } from 'rxjs';
import { AddClientFormComponent } from '../add-client-form/add-client-form.component';
import { DividerModule } from 'primeng/divider';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { ImageModule } from 'primeng/image';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { NgIf } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { RippleModule } from 'primeng/ripple';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import {
  ToggleButtonChangeEvent,
  ToggleButtonModule,
} from 'primeng/togglebutton';
import { PrefabItem } from '../../../models/PrefabItem';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-client-management',
  standalone: true,
  imports: [
    ToastModule,
    CardModule,
    AddClientFormComponent,
    DividerModule,
    AccordionModule,
    ButtonModule,
    DialogModule,
    DropdownModule,
    IconFieldModule,
    ImageModule,
    InputIconModule,
    InputNumberModule,
    InputTextModule,
    MultiSelectModule,
    NgIf,
    PaginatorModule,
    RippleModule,
    TableModule,
    TagModule,
    ToggleButtonModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './client-management.component.html',
  styleUrl: './client-management.component.scss',
})
export class ClientManagementComponent implements OnInit {
  constructor(
    private state: StateService,
    private clientService: ClientService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  editModeEnabled: boolean | undefined = false;
  clientList: Client[] = [];
  clonedClients: { [s: string]: Client } = {};
  displayAddClientDialog: boolean = false;
  cols: any[] = [
    { field: 'name', header: 'Nume' },
    { field: 'cui', header: 'CUI' },
    { field: 'phone', header: 'Telefon' },
    { field: 'email', header: 'Email' },
    { field: 'address', header: 'Adresă' },
  ];

  get newClient(): Client {
    return this.state.newClient;
  }

  set newClient(value: Client) {
    this.state.newClient = value;
  }

  get addClientForm() {
    return this.state.addClientForm;
  }

  ngOnInit() {
    this.initializeClients();
  }

  filterTable($event: Event, dt: Table) {
    dt.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  }

  initializeClients(): void {
    this.clientService
      .fetchClients()
      .pipe(
        catchError((error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error fetching clients',
          });
          return [];
        }),
      )
      .subscribe((clients: any[]) => {
        this.clientList = clients;
      });
  }

  openAddClientDialog(): void {
    this.displayAddClientDialog = true;
  }

  closeAddClientDialog(): void {
    this.displayAddClientDialog = false;
    this.state.newClient = {};
  }

  resetForm() {
    this.addClientForm!.reset();
  }

  addClient() {
    if (this.addClientForm!.valid) {
      this.newClient = this.addClientForm!.value;
      this.clientService
        .addClient(this.newClient)
        .pipe(
          catchError((error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error.detail,
            });
            this.initializeClients();
            return [];
          }),
        )
        .subscribe((response: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Client adăugat',
            detail: `Clientul ${this.newClient.name} a fost adăugat cu succes!`,
          });
          this.initializeClients();
          this.closeAddClientDialog();
        });
    }
  }

  toggleEditMode($event: ToggleButtonChangeEvent) {
    this.editModeEnabled = $event.checked;
  }

  onRowEdit(client: Client) {
    this.clonedClients[client.id!] = { ...client };
  }

  onRowDelete(client: Client, $event: any) {
    this.confirmationService.confirm({
      target: $event.target as EventTarget,
      message: 'Vrei să ștergi acest client?',
      header: 'Confirmare ștergere client',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: 'Da',
      rejectLabel: 'Nu',

      accept: () => {
        this.clientService
          .deleteClient(client.id!)
          .pipe(
            catchError((error: any): any => {
              this.messageService.add({
                severity: 'error',
                summary: 'Eroare',
                detail: 'Eroare la ștergerea clientului',
              });
              return error;
            }),
          )
          .subscribe(() => {
            this.initializeClients();
            this.messageService.add({
              severity: 'success',
              summary: 'Șters',
              detail: 'Client șters cu succes',
            });
          });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Anulat',
          detail: 'Nu a fost făcută nicio schimbare',
        });
      },
    });
  }

  onRowEditSave(client: Client) {
    this.clientService
      .editClient(client)
      .pipe(
        catchError((error: any): any => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Eroare la editarea datelor clientului',
          });
          return error;
        }),
      )
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Editare reușită',
          detail: 'Datele clientului au fost editate cu succes',
        });
        this.initializeClients();
      });
    delete this.clonedClients[client.id!];
  }

  onRowEditCancel(client: Client, index: number) {
    this.clientList[index] = this.clonedClients[client.id!];
    delete this.clonedClients[client.id!];
  }
}
