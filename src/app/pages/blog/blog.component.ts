import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { BlogService } from '../../core/services/blog.service';
import { Blog } from '../../core/models';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [RouterLink, MatIconModule, RevealDirective],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit {
  private blogService = inject(BlogService);
  loading = signal(true);
  posts = signal<Blog[]>([]);

  ngOnInit(): void {
    this.blogService.getAll({ per_page: 12 }).subscribe({
      next: res => { this.posts.set(res.data || []); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }
}
