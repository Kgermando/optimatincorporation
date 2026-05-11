import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { Portfolio } from '../../../core/models';

@Component({
  selector: 'app-realisation-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './realisation-detail.component.html',
  styleUrl: './realisation-detail.component.scss'
})
export class RealisationDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private portfolioService = inject(PortfolioService);
  loading = signal(true);
  item = signal<Portfolio | null>(null);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.portfolioService.getBySlug(slug).subscribe({
      next: res => { this.item.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
