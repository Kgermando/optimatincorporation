import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BlogsService } from './blogs.service';
import { BlogModel } from './models/blog.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-blog',
  imports: [
    RouterModule,
    NavbarComponent,
    FooterComponent,
    CommonModule
  ],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit {
  blogs: BlogModel[] = [];
  currentPage = 1;
  totalPages = 1;
  limit = 6;
  loading = false;
  error: string | null = null;
  baseImageUrl = environment.urlFile;

  constructor(private blogsService: BlogsService) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(page: number = 1): void {
    this.loading = true;
    this.error = null;
    
    this.blogsService.getBlogs(page, this.limit).subscribe({
      next: (response) => {
        this.blogs = response.data;
        this.currentPage = response.page;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading blogs:', error);
        this.error = 'Erreur lors du chargement des articles';
        this.loading = false;
      }
    });
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.loadBlogs(page);
    }
  }

  getImageUrl(files: string[]): string {
    if (files && files.length > 0) {
      return `${this.baseImageUrl}${files[0]}`;
    }
    return 'assets/img/blog/blog1.jpg'; // Image par défaut
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR');
  }

  generatePages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    
    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 3) {
        for (let i = 1; i <= Math.min(maxVisible, this.totalPages); i++) {
          pages.push(i);
        }
      } else if (this.currentPage >= this.totalPages - 2) {
        for (let i = this.totalPages - maxVisible + 1; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = this.currentPage - 2; i <= this.currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  }
}
