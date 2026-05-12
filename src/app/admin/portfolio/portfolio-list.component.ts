import { Component, OnInit, inject, signal, computed } from '@angular/core';
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
  readonly pageSize = 10;
  page = signal(1);
  totalPages = computed(() => Math.max(1, Math.ceil(this.items().length / this.pageSize)));
  pagedItems = computed(() => {
    const p = this.page(); const s = this.pageSize;
    return this.items().slice((p - 1) * s, p * s);
  });
  pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  ngOnInit(): void { this.load(); }

  load(): void {
    this.portfolioService.getAll().subscribe({
      next: res => { this.items.set(res.data || []); this.loading.set(false); this.page.set(1); },
      error: () => this.loading.set(false)
    });
  }

  delete(id: string): void {
    if (!confirm('Supprimer ce projet ?')) return;
    this.portfolioService.delete(id).subscribe(() => this.load());
  }

  goTo(p: number): void { if (p >= 1 && p <= this.totalPages()) this.page.set(p); }
}
