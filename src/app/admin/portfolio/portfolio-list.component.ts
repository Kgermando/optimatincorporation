import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PortfolioService } from '../../core/services/portfolio.service';
import { Portfolio } from '../../core/models';

@Component({
  selector: 'app-portfolio-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './portfolio-list.component.html',
  styleUrl: './portfolio-list.component.scss'
})
export class PortfolioListComponent implements OnInit {
  private portfolioService = inject(PortfolioService);
  items = signal<Portfolio[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.portfolioService.getAll().subscribe({
      next: res => { this.items.set(res.data || []); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  delete(id: string): void {
    if (!confirm('Supprimer ce projet ?')) return;
    this.portfolioService.delete(id).subscribe(() => this.load());
  }
}
