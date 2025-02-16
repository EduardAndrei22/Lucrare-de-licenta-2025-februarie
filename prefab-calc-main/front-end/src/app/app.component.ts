import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ToolbarComponent } from './components/functional/toolbar/toolbar.component';
import { StateService } from './services/state.service';
import { jwtDecode } from 'jwt-decode';
import { ThemeService } from './services/theme.service';
import { PrefabitemService } from './services/prefabitem.service';
import { StyleClassModule } from 'primeng/styleclass';
import { ClientService } from './services/client.service';
import { Client } from './models/Client';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ButtonModule,
    ToolbarModule,
    ToolbarComponent,
    StyleClassModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'front-end';

  get isLoggedIn(): boolean {
    return this.state.isLoggedIn;
  }

  constructor(
    private primengConfig: PrimeNGConfig,
    private state: StateService,
    private themeService: ThemeService,
    private prefabService: PrefabitemService,
    private clientService: ClientService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;

    const theme = localStorage.getItem('theme');
    if (theme) {
      this.themeService.changeTheme(theme);
    }

    this.primengConfig.setTranslation({
      accept: 'Da',
      addRule: 'Adăugă o regulă',
      am: 'înainte de amiază',
      apply: 'Aplică',
      cancel: 'Anulează',
      choose: 'Alege',
      chooseDate: 'Alege data',
      chooseMonth: 'Alege luna',
      chooseYear: 'Alege anul',
      clear: 'Curăță',
      contains: 'Conține',
      dateAfter: 'Data este după',
      dateBefore: 'Data este înainte',
      dateFormat: 'dd.mm.yy',
      dateIs: 'Data este',
      dateIsNot: 'Data nu este',
      dayNames: [
        'Duminică',
        'Luni',
        'Marți',
        'Miercuri',
        'Joi',
        'Vineri',
        'Sâmbătă',
      ],
      dayNamesMin: ['Du', 'Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ'],
      dayNamesShort: ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm'],
      emptyFilterMessage: 'Nu s-au găsite rezultate',
      emptyMessage: 'Nu există opțiuni disponibile',
      emptySearchMessage: 'Nu s-au găsite rezultate',
      emptySelectionMessage: 'Niciun element selectat',
      endsWith: 'Se termină cu',
      equals: 'Este egal',
      fileSizeTypes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      firstDayOfWeek: 1,
      gt: 'Mai mare decât',
      gte: 'Mai mare sau egal cu',
      lt: 'Mai mic decât',
      lte: 'Mai mic sau egal cu',
      matchAll: 'Potrivește cu toate',
      matchAny: 'Potrivește cu orice',
      medium: 'Medie',
      monthNames: [
        'Ianuarie',
        'Februarie',
        'Martie',
        'Aprilie',
        'Mai',
        'Iunie',
        'Iulie',
        'August',
        'Septembrie',
        'Octombrie',
        'Noiembrie',
        'Decembrie',
      ],
      monthNamesShort: [
        'Ian',
        'Feb',
        'Mar',
        'Apr',
        'Mai',
        'Iun',
        'Iul',
        'Aug',
        'Sep',
        'Oct',
        'Noi',
        'Dec',
      ],
      nextDecade: 'Deceniul următor',
      nextHour: 'Ora următoare',
      nextMinute: 'Minutul următor',
      nextMonth: 'Luna următoare',
      nextSecond: 'Secunda anterioară',
      nextYear: 'Anul următor',
      noFilter: 'Fără filtru',
      notContains: 'Nu conține',
      notEquals: 'Nu este egal',
      passwordPrompt: 'Introduceți parola',
      pending: 'În așteptare',
      pm: 'după amiază',
      prevDecade: 'Deceniul precedent',
      prevHour: 'Ora precedentă',
      prevMinute: 'Minutul precedent',
      prevMonth: 'Luna precedentă',
      prevSecond: 'Secunda precedentă',
      prevYear: 'Anul precedent',
      reject: 'Nu',
      removeRule: 'Elimină regula',
      searchMessage: '{0} rezultate sunt disponibile',
      selectionMessage: '{0} elemente selectate',
      startsWith: 'Începe cu',
      strong: 'Puternică',
      today: 'Astăzi',
      upload: 'Încarcă',
      weak: 'Slabă',
      weekHeader: 'Săpt',
      aria: {
        cancelEdit: 'Anulați editarea',
        close: 'Închide',
        collapseRow: 'Rând restrâns',
        editRow: 'Editați rândul',
        expandRow: 'Rând extins',
        falseLabel: 'Fals',
        filterConstraint: 'Constrângere de filtrare',
        filterOperator: 'Operator de filtrare',
        firstPageLabel: 'Prima pagină',
        gridView: 'Vizualizare grilă',
        hideFilterMenu: 'Ascundeți meniul filtrului',
        jumpToPageDropdownLabel: 'Treceți la meniul derulant al paginii',
        jumpToPageInputLabel: 'Treceți la pagina de intrare',
        lastPageLabel: 'Ultima pagină',
        listView: 'Vizualizare listă',
        moveAllToSource: 'Mutați totul la sursă',
        moveAllToTarget: 'Mutați totul la țintă',
        moveBottom: 'Mutați la sfârșit',
        moveDown: 'Mutați în jos',
        moveTop: 'Mutați la început',
        moveToSource: 'Mutați la sursă',
        moveToTarget: 'Mutați la țintă',
        moveUp: 'Mutați în sus',
        navigation: 'Navigare',
        next: 'Următor',
        nextPageLabel: 'Pagina următoare',
        nullLabel: 'Neselectat',
        pageLabel: 'Pagina {page}',
        previous: 'Precedent',
        previousPageLabel: 'Pagina precedentă',
        removeLabel: 'Elimina',
        rotateLeft: 'Rotiți la stânga',
        rotateRight: 'Rotiți la dreapta',
        rowsPerPageLabel: 'Rânduri pe pagină',
        saveEdit: 'Salvați editarea',
        scrollTop: 'Derulați la început',
        selectAll: 'Toate elementele selectate',
        selectRow: 'Rând selectat',
        showFilterMenu: 'Afișați meniul filtrului',
        slide: 'Slide',
        slideNumber: '{slideNumber}',
        star: '1 stea',
        stars: '{star} stele',
        trueLabel: 'Adevărat',
        unselectAll: 'Toate elementele neselectate',
        unselectRow: 'Rând neselectat',
        zoomImage: 'Măriți imaginea',
        zoomIn: 'Măriți',
        zoomOut: 'Micșorați',
      },
    });

    const token = localStorage.getItem('access_token');
    if (token) {
      const tokenPayload: any = jwtDecode(token);
      const expirationDate = new Date(tokenPayload.exp * 1000);
      const now = new Date();
      if (expirationDate > now) {
        this.state.isLoggedIn = true;
        this.state.username = tokenPayload.username;
        this.authService.fetchAdmins().subscribe((admins: any) => {
          for (const admin of admins) {
            if (admin.username === this.state.username) {
              this.state.isAdmin = true;
            }
          }
        });
      }
    }

    this.prefabService.ensureCategories().subscribe((response) => {
      return response;
    });

    const order = localStorage.getItem('currentOrder');
    if (order) {
      this.state.currentOrder = JSON.parse(order);
      this.clientService.fetchClients().subscribe((result) => {
        this.state.currentOrderClient = result.find(
          (client: Client) => client.id === this.state.currentOrder.client_id,
        );
      });
    }
  }
}
