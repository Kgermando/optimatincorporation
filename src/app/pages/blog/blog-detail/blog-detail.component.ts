import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BlogService } from '../../../core/services/blog.service';
import { Blog } from '../../../core/models';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, MatIconModule],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.scss'
})
export class BlogDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private blogService = inject(BlogService);
  loading = signal(true);
  post = signal<Blog | null>(null);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.blogService.getBySlug(slug).subscribe({
      next: res => { this.post.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
