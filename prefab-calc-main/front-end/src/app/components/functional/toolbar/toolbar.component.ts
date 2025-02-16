import { Component, OnInit } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { StateService } from '../../../services/state.service';
import { MenuModule } from 'primeng/menu';
import { catchError } from 'rxjs';
import { MenuItem, MessageService } from 'primeng/api';
import { StyleClassModule } from 'primeng/styleclass';
import { ThemeService } from '../../../services/theme.service';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    ToolbarModule,
    ButtonModule,
    MenuModule,
    StyleClassModule,
    InputSwitchModule,
    FormsModule,
    DividerModule,
    RippleModule,
  ],
  providers: [MessageService],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent implements OnInit {
  get currentTheme(): string {
    return this.state.currentTheme;
  }

  constructor(
    protected authService: AuthService,
    private router: Router,
    private state: StateService,
    private messageService: MessageService,
    private themeService: ThemeService,
  ) {
    this.menuItems = [];
  }

  menuItems: MenuItem[];

  get currentPage() {
    return this.state.activePage;
  }

  set currentPage(page: string) {
    this.state.activePage = page;
  }

  get isAdmin(): boolean {
    return this.state.isAdmin;
  }

  set isAdmin(value: boolean) {
    this.state.isAdmin = value;
  }

  ngOnInit(): void {
    this.menuItems = [
      {
        label: 'Profil',
        items: [
          {
            icon: 'pi pi-sign-out',
            label: 'Deconectare',
            command: () => {
              this.logout();
            },
          },
        ],
      },
    ];

    setTimeout(() => {
      if (this.isAdmin) {
        this.menuItems.unshift({
          label: 'Admin',
          items: [
            {
              icon: 'pi pi-cog',
              label: 'Panel Admin',
              command: () => {
                this.router.navigate(['/admin']);
              },
            },
          ],
        });
      }
    }, 1000);
  }

  get username(): string {
    return this.state.username;
  }

  logout(): void {
    this.authService
      .logout()
      .pipe(
        catchError((error: any): any => {
          this.messageService.add({
            severity: 'error',
            summary: 'Eroare la logout',
            detail: 'Contactează administratorul. Vei fi deconectat!',
          });
        }),
      )
      .subscribe((data: any) => {
        if (data.status === 200) {
          this.state.isLoggedIn = false;
          this.state.username = '';
          this.isAdmin = false;
          localStorage.clear();
          this.router.navigate(['/login']);
        }
      });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  changeTheme(theme: string): void {
    this.themeService.changeTheme(theme);
  }

  toggleDarkMode(): void {
    if (this.currentTheme.includes('dark')) {
      this.changeTheme('aura-light-purple');
    } else {
      this.changeTheme('aura-dark-purple');
    }
  }

  goTo(page: string): void {
    this.currentPage = page;
    this.router.navigate([page]);
  }

  getCurrentClass(page: string): string {
    if (this.currentPage === page) return 'active';
    return '';
  }
}
