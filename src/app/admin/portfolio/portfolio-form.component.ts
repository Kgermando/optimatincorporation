import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PortfolioService } from '../../core/services/portfolio.service';
import { ApiService } from '../../core/services/api.service';
import { Portfolio } from '../../core/models';

@Component({
  selector: 'app-portfolio-form',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './portfolio-form.component.html',
  styleUrl: './portfolio-form.component.scss'})
export class PortfolioFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private portfolioService = inject(PortfolioService);
  private apiService = inject(ApiService);

  isEdit = false;
  loading = signal(false);
  uploadingCover = signal(false);
  error = signal('');

  item: Partial<Portfolio> = {
    title: '', description: '', category: 'film', year: new Date().getFullYear(),
    client: '', cover_url: '', tags: []
  };

  categories = ['film', 'spot_publicitaire', 'court_metrage', 'motion_graphics', 'documentaire', 'simulation_3d'];
  tagsInput = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.portfolioService.getBySlug(id).subscribe({
        next: res => {
          this.item = res.data;
          this.tagsInput = (res.data.tags || []).join(', ');
        }
      });
    }
  }

  uploadCover(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.uploadingCover.set(true);
    this.apiService.upload(file, 'portfolio').subscribe({
      next: res => { this.item.cover_url = res.data?.url; this.uploadingCover.set(false); },
      error: () => this.uploadingCover.set(false)
    });
  }

  save(): void {
    this.item.tags = this.tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    this.loading.set(true);
    const obs = this.isEdit
      ? this.portfolioService.update(this.item.id!, this.item)
      : this.portfolioService.create(this.item);

    obs.subscribe({
      next: () => this.router.navigate(['/admin/portfolio']),
      error: () => { this.error.set('Une erreur est survenue.'); this.loading.set(false); }
    });
  }
}
