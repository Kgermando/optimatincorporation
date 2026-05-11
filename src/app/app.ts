import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SplashScreenComponent } from './shared/splash-screen/splash-screen.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SplashScreenComponent],
  template: `
    <app-splash-screen
      *ngIf="showSplash"
      (splashDone)="showSplash = false"
    ></app-splash-screen>
    <router-outlet *ngIf="!showSplash" />
  `,
})
export class App {
  showSplash = true;
}
