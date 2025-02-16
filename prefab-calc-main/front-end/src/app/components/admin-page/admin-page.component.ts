import { Component, OnInit } from '@angular/core';
import { StateService } from '../../services/state.service';
import { Router } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { UserManagerComponent } from '../functional/user-manager/user-manager.component';
import { PrefabManagementComponent } from '../functional/prefab-management/prefab-management.component';
import { VariableChangerComponent } from '../functional/variable-changer/variable-changer.component';
import { ClientManagementComponent } from '../functional/client-management/client-management.component';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [
    MenuModule,
    CardModule,
    UserManagerComponent,
    PrefabManagementComponent,
    VariableChangerComponent,
    ClientManagementComponent,
  ],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss',
})
export class AdminPageComponent implements OnInit {
  constructor(
    private state: StateService,
    private router: Router,
  ) {}

  menuItems: MenuItem[] | undefined;
  currentItem: string = 'prefab_management';

  ngOnInit(): void {
    if (!this.state.isAdmin) {
      this.router.navigate(['/home']);
    }

    if (localStorage.getItem('currentItem')) {
      this.currentItem = localStorage.getItem('currentItem') || '';
    } else {
      localStorage.setItem('currentItem', 'prefab_management');
    }

    this.menuItems = [
      {
        label: 'Aplicație',
        items: [
          {
            label: 'Prefabricate',
            command: () => {
              this.currentItem = 'prefab_management';
              localStorage.setItem('currentItem', 'prefab_management');
            },
            icon: 'pi pi-warehouse',
          },
          {
            label: 'Clienți',
            command: () => {
              this.currentItem = 'client_management';
              localStorage.setItem('currentItem', 'client_management');
            },
            icon: 'pi pi-address-book',
          },
          {
            label: 'Utilizatori',
            command: () => {
              this.currentItem = 'user_management';
              localStorage.setItem('currentItem', 'user_management');
            },
            icon: 'pi pi-users',
          },
          {
            label: 'Variabile',
            command: () => {
              this.currentItem = 'variable_changer';
              localStorage.setItem('currentItem', 'variable_changer');
            },
            icon: 'pi pi-cog',
          },
        ],
      },
    ];
  }
}
