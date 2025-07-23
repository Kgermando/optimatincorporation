import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { BlogModel } from '../../blog/models/blog.model';
import { environment } from '../../../../environments/environment';
import { BlogsService } from '../../blog/blogs.service';

@Component({
  selector: 'app-admin-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-blog-list.component.html',
  styleUrls: ['./admin-blog-list.component.scss']
})
export class AdminBlogListComponent implements OnInit {
  blogs: BlogModel[] = [];
  currentPage = 1;
  totalPages = 1;
  limit = 10;
  loading = false;
  error: string | null = null;
  searchTerm = '';
  blogToDelete: BlogModel | null = null;
  baseImageUrl = environment.urlFile;
  sortField: string = 'created';
  sortDirection: 'asc' | 'desc' = 'desc';

  constructor(
    private router: Router, 
    private blogService: BlogsService
  ) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.loading = true;
    this.error = null; 

    this.blogService.getPaginated(this.currentPage, this.limit).subscribe({
      next: (response: any) => {
        this.blogs = response.data || [];
        this.totalPages = response.pagination?.total_pages || 1;
        this.sortBlogs(); // Apply current sort after loading
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading blogs:', error);
        this.error = 'Erreur lors du chargement des articles';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadBlogs();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadBlogs();
    }
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

  getImageUrl(files: string[]): string {
    if (files && files.length > 0) {
      return `${this.baseImageUrl}${files[0]}`;
    }
    return 'assets/img/blog/blog1.jpg';
  }

  formatDate(date: Date | string): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  }

  formatDateWithTime(date: Date | string): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getKeywordsPreview(keywords: string[]): string[] {
    if (!keywords || keywords.length === 0) return [];
    return keywords.slice(0, 3); // Show only first 3 keywords
  }

  getBlogId(blog: BlogModel): string {
    return blog.title_url || '';
  }

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.sortBlogs();
  }

  private sortBlogs(): void {
    this.blogs.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (this.sortField) {
        case 'id':
          aValue = this.getBlogId(a);
          bValue = this.getBlogId(b);
          break;
        case 'title':
          aValue = a.title?.toLowerCase() || '';
          bValue = b.title?.toLowerCase() || '';
          break;
        case 'signature':
          aValue = a.signature?.toLowerCase() || '';
          bValue = b.signature?.toLowerCase() || '';
          break;
        case 'created':
          aValue = new Date(a.created || a.CreatedAt || a.created_at || 0);
          bValue = new Date(b.created || b.CreatedAt || b.created_at || 0);
          break;
        case 'updated':
          aValue = new Date(a.UpdatedAt || a.updated_at || 0);
          bValue = new Date(b.UpdatedAt || b.updated_at || 0);
          break;
        case 'views':
          aValue = a.views || 0;
          bValue = b.views || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  getSortIcon(field: string): string {
    if (this.sortField !== field) return 'bx-sort';
    return this.sortDirection === 'asc' ? 'bx-sort-up' : 'bx-sort-down';
  }

  deleteBlog(blog: BlogModel): void {
    this.blogToDelete = blog;
  }

  confirmDelete(): void {
    if (this.blogToDelete) {
      const blogId = this.blogToDelete.id;
      
      this.blogService.delete(blogId).subscribe({
        next: () => {
          console.log('Blog deleted successfully');
          this.blogToDelete = null;
          this.loadBlogs(); // Reload the list
        },
        error: (error: any) => {
          console.error('Error deleting blog:', error);
          this.error = 'Erreur lors de la suppression de l\'article';
          this.blogToDelete = null;
        }
      });
    }
  }

  cancelDelete(): void {
    this.blogToDelete = null;
  }

  logout(): void {
    // Implement logout logic
    this.router.navigate(['/admin/login']);
  }
}
