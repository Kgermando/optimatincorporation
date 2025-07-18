import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="auth-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
  `]
})
export class AuthComponent {}
