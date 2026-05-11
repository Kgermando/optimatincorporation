import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found">
      <div class="not-found__content">
        <span class="gradient-text" style="font-size:8rem;font-weight:700;font-family:var(--font-heading);line-height:1">404</span>
        <h2>Page non trouvée</h2>
        <p>La page que vous recherchez n'existe pas ou a été déplacée.</p>
        <a routerLink="/" class="btn btn-primary btn-lg">← Retour à l'accueil</a>
      </div>
    </div>
  `,
  styles: [`
    .not-found {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      background: var(--color-bg);
      &__content { display: flex; flex-direction: column; align-items: center; gap: 16px; }
      h2 { margin: 0; }
      p { color: var(--color-text-muted); margin-bottom: 16px; }
    }
  `]
})
export class NotFoundComponent {}
