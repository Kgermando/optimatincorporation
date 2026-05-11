import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  year = new Date().getFullYear();

  links = {
    company: [
      { label: 'À Propos', path: '/about' },
      { label: 'Notre Équipe', path: '/team' },
      { label: 'Blog', path: '/blog' },
      { label: 'Contact', path: '/contact' },
    ],
    services: [
      { label: 'Films & Séries', path: '/services' },
      { label: 'Spots Publicitaires', path: '/services' },
      { label: 'Motion Graphics', path: '/services' },
      { label: 'Documentaires', path: '/services' },
    ],
    social: [
      { label: 'Facebook', url: 'https://facebook.com', icon: 'fb' },
      { label: 'Instagram', url: 'https://instagram.com', icon: 'ig' },
      { label: 'YouTube', url: 'https://youtube.com', icon: 'yt' },
      { label: 'LinkedIn', url: 'https://linkedin.com', icon: 'li' },
    ]
  };
}
