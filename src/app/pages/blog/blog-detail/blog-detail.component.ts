import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../common/navbar/navbar.component';
import { FooterComponent } from '../../../common/footer/footer.component';
import { BlogsService } from '../blogs.service';
import { BlogModel } from '../models/blog.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-blog-detail',
  imports: [
    RouterModule,
    NavbarComponent,
    FooterComponent,
    CommonModule
  ],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.scss'
})
export class BlogDetailComponent implements OnInit {
  blog: BlogModel | null = null;
  loading = false;
  error: string | null = null;
  baseImageUrl = environment.urlFile;

  constructor(
    private route: ActivatedRoute,
    private blogsService: BlogsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadBlog(id);
      }
    });
  }

  loadBlog(id: number): void {
    this.loading = true;
    this.error = null;
    
    this.blogsService.getBlogById(id).subscribe({
      next: (blog) => {
        this.blog = blog;
        this.loading = false;
        // Incrémenter les vues
        this.blogsService.incrementViews(id).subscribe();
      },
      error: (error) => {
        console.error('Error loading blog:', error);
        this.error = 'Article non trouvé';
        this.loading = false;
      }
    });
  }

  getImageUrl(files: string[]): string {
    if (files && files.length > 0) {
      return `${this.baseImageUrl}${files[0]}`;
    }
    return 'assets/img/blog/blog-dtls.jpg'; // Image par défaut
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR');
  }

  getKeywords(): string {
    if (this.blog && this.blog.keyword && this.blog.keyword.length > 0) {
      return this.blog.keyword.join(', ');
    }
    return '';
  }
}
