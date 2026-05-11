import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../core/services/blog.service';
import { ApiService } from '../../core/services/api.service';
import { Blog } from '../../core/models';

@Component({
  selector: 'app-blog-form',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './blog-form.component.html',
  styleUrl: './blog-form.component.scss'
})
export class BlogFormComponent implements OnInit {
  private route = inject(ActivatedRoute); private router = inject(Router);
  private blogService = inject(BlogService); private apiService = inject(ApiService);
  isEdit = false; loading = signal(false); uploading = signal(false); error = signal('');
  item: Partial<Blog> = { title: '', category: '', author: '', excerpt: '', content: '', cover_url: '' };
  uploadCover(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0]; if (!file) return;
    this.uploading.set(true);
    this.apiService.upload(file, 'blog').subscribe({ next: r => { this.item.cover_url = r.data?.url; this.uploading.set(false); }, error: () => this.uploading.set(false) });
  }
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) { this.isEdit = true; this.blogService.getBySlug(id).subscribe({ next: r => this.item = r.data }); }
  }
  save(): void {
    this.loading.set(true);
    const obs = this.isEdit ? this.blogService.update(this.item.id!, this.item) : this.blogService.create(this.item);
    obs.subscribe({ next: () => this.router.navigate(['/admin/blog']), error: () => { this.error.set('Erreur.'); this.loading.set(false); } });
  }
}
