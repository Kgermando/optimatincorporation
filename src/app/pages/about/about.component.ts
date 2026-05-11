import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, RevealDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  values = [
    { icon: '🗺️', title: 'Expertise locale', desc: 'Nous sommes ancrés dans le tissu culturel congolais et produisons des contenus qui résonnent auprès du public local.' },
    { icon: '⭐', title: 'Qualité irréprochable', desc: 'Nous mettons un point d\'honneur à livrer des productions de haute qualité, conformes aux standards internationaux.' },
    { icon: '🧠', title: 'Innovation', desc: 'Nous sommes constamment à la recherche de nouvelles techniques pour offrir une expérience visuelle unique.' },
    { icon: '❤️', title: 'Engagement', desc: 'Nous nous engageons à soutenir le développement de l\'industrie de l\'animation 3D en RDC.' },
  ];

  milestones = [
    { year: '2016', title: 'Fondation', desc: 'OPTIMAT Incorporation est fondé à Kinshasa par une équipe de jeunes talents passionnés d\'animation 3D.' },
    { year: '2018', title: 'Premiers films', desc: 'Lancement des premières productions de courts métrages d\'animation 3D diffusées localement.' },
    { year: '2020', title: 'Expansion', desc: 'Extension des services aux spots publicitaires et aux supports de communication institutionnelle.' },
    { year: '2022', title: 'Koffi Raymet', desc: 'Lancement de la série animée Koffi Raymet, première série 3D congolaise.' },
    { year: '2024', title: 'Leader du marché', desc: 'OPTIMAT s\'impose comme le studio de référence en animation 3D en RDC.' },
  ];
}
