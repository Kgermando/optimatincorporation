import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { PortfolioService } from '../../core/services/portfolio.service';
import { Portfolio, PortfolioCategory } from '../../core/models';

@Component({
  selector: 'app-realisations',
  standalone: true,
  imports: [RouterLink, MatIconModule, RevealDirective],
  templateUrl: './realisations.component.html',
  styleUrl: './realisations.component.scss'
})
export class RealisationsComponent implements OnInit {
  private portfolioService = inject(PortfolioService);
  loading = signal(true);
  all = signal<Portfolio[]>([]);
  filtered = signal<Portfolio[]>([]);
  activeFilter = signal<string>('all');

  filters: { label: string; value: string }[] = [
    { label: 'Tout', value: 'all' },
    { label: 'Films & Séries', value: 'film' },
    { label: 'Spots Publicitaires', value: 'spot_publicitaire' },
    { label: 'Motion Graphics', value: 'motion_graphics' },
    { label: 'Court-Métrage', value: 'court_metrage' },
    { label: 'Documentaires', value: 'documentaire' },
    { label: 'Simulations 3D', value: 'simulation_3d' },
  ];

  ngOnInit(): void {
    this.portfolioService.getAll({ per_page: 50 }).subscribe({
      next: res => {
        this.all.set(res.data || []);
        this.filtered.set(res.data || []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  setFilter(cat: string): void {
    this.activeFilter.set(cat);
    if (cat === 'all') {
      this.filtered.set(this.all());
    } else {
      this.filtered.set(this.all().filter(i => i.category === cat));
    }
  }

  getCategoryLabel(cat: string): string {
    return this.filters.find(f => f.value === cat)?.label ?? cat;
  }
}
