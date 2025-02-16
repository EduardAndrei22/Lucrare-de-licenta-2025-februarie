import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { StateService } from '../../services/state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [ButtonModule, CardModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent implements OnInit {
  constructor(
    private state: StateService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.state.isLoggedIn
      ? this.router.navigate(['/home'])
      : this.router.navigate(['/login']);
  }
}
