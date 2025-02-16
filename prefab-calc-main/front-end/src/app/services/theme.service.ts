import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private state: StateService,
  ) {}

  changeTheme(theme: string) {
    let themeLink = this.document.getElementById(
      'app-theme',
    ) as HTMLLinkElement;

    if (themeLink) {
      themeLink.href = 'assets/themes/' + theme + '.css';
      this.state.currentTheme = theme;
      localStorage.setItem('theme', theme);
    }
  }
}
