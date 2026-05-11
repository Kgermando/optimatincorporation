import { Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MatIconModule, RevealDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  activeSlide = signal(0);

  heroImages = [
    '/images/hero-1.jpg',
    '/images/hero-2.jpg',
    '/images/hero-3.jpg',
  ];

  stats = [
    { value: '8+', label: 'Années d\'expérience' },
    { value: '150+', label: 'Projets réalisés' },
    { value: '50+', label: 'Clients satisfaits' },
    { value: '3D', label: 'Leader en RDC' },
  ];

  services = [
    {
      icon: '🎬',
      title: 'Films & Séries 3D',
      desc: 'Courts et longs métrages d\'animation 3D captivants pour tous les publics.',
    },
    {
      icon: '📺',
      title: 'Spots Publicitaires',
      desc: 'Publicités percutantes qui mettent en valeur vos produits et services.',
    },
    {
      icon: '✨',
      title: 'Motion Graphics',
      desc: 'Animations dynamiques et visuels en mouvement pour vos contenus.',
    },
    {
      icon: '🎭',
      title: 'Documentaires',
      desc: 'Simulations 3D et documentaires institutionnels de haute qualité.',
    },
    {
      icon: '🖼️',
      title: 'Communication',
      desc: 'Supports visuels institutionnels et présentations de projets.',
    },
    {
      icon: '🌍',
      title: 'Culture Congolaise',
      desc: 'Contenus ancrés dans l\'identité culturelle africaine et congolaise.',
    },
  ];

  objectives = [
    {
      num: '01',
      title: 'Leader de l\'animation 3D en RDC',
      desc: 'OPTIMAT ambitionne de s\'imposer comme le studio de référence en RDC en repoussant les limites de la créativité.',
    },
    {
      num: '02',
      title: 'Raconter des histoires congolaises',
      desc: 'Produire des contenus reflétant l\'identité culturelle congolaise et valorisant la créativité locale.',
    },
    {
      num: '03',
      title: 'Créer des expériences immersives',
      desc: 'Offrir des expériences visuelles uniques qui transportent le spectateur dans des univers imaginaires.',
    },
    {
      num: '04',
      title: 'Attirer l\'attention internationale',
      desc: 'Positionner la RDC comme un pays créatif et innovant dans le domaine de l\'animation mondiale.',
    },
  ];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setInterval(() => {
        this.activeSlide.update(v => (v + 1) % this.heroImages.length);
      }, 4000);
    }
  }
}
