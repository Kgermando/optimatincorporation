import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminBlogService } from '../services/admin-blog.service';
import { BlogModel } from '../../blog/models/blog.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="admin-layout">
      <!-- Sidebar -->
      <nav class="admin-sidebar">
        <div class="sidebar-header">
          <h3>Admin Panel</h3>
        </div>
        <ul class="sidebar-menu">
          <li>
            <a routerLink="/admin/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              <i class='bx bx-tachometer'></i>
              Tableau de bord
            </a>
          </li>
          <li>
            <a routerLink="/admin/blogs" routerLinkActive="active">
              <i class='bx bx-news'></i>
              Articles de blog
            </a>
          </li>
          <li>
            <a (click)="logout()" class="logout-btn">
              <i class='bx bx-log-out'></i>
              Déconnexion
            </a>
          </li>
        </ul>
      </nav>

      <!-- Main Content -->
      <main class="admin-main">
        <div class="admin-header">
          <h1>Gestion des articles de blog</h1>
          <a routerLink="/admin/blogs/create" class="btn btn-success">
            <i class='bx bx-plus'></i>
            Nouvel article
          </a>
        </div>

        <div class="admin-content">
          <!-- Search and filters -->
          <div class="search-section">
            <div class="search-box">
              <input 
                type="text" 
                [(ngModel)]="searchTerm" 
                (input)="onSearch()"
                placeholder="Rechercher un article..."
                class="form-control"
              >
              <button (click)="onSearch()" class="btn btn-primary">
                <i class='bx bx-search'></i>
              </button>
            </div>
          </div>

          <!-- Loading state -->
          <div *ngIf="loading" class="text-center py-4">
            <div class="spinner-border"></div>
            <p>Chargement...</p>
          </div>

          <!-- Error state -->
          <div *ngIf="error && !loading" class="alert alert-danger">
            {{ error }}
          </div>

          <!-- Blog list -->
          <div *ngIf="!loading && !error" class="blog-table">
            <table class="table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Titre</th>
                  <th>Auteur</th>
                  <th>Date</th>
                  <th>Vues</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let blog of blogs">
                  <td>
                    <img 
                      [src]="getImageUrl(blog.files)" 
                      [alt]="blog.title"
                      class="blog-thumbnail"
                      onerror="this.src='assets/img/blog/blog1.jpg'"
                    >
                  </td>
                  <td>
                    <strong>{{ blog.title }}</strong>
                    <br>
                    <small class="text-muted">{{ blog.resume | slice:0:50 }}...</small>
                  </td>
                  <td>{{ blog.signature || 'Admin' }}</td>
                  <td>{{ formatDate(blog.created || blog.CreatedAt || blog.created_at) }}</td>
                  <td>{{ blog.views || 0 }}</td>
                  <td>
                    <div class="action-buttons">
                      <a [routerLink]="['/admin/blogs/edit', blog.id]" class="btn btn-sm btn-warning">
                        <i class='bx bx-edit'></i>
                      </a>
                      <button (click)="deleteBlog(blog)" class="btn btn-sm btn-danger">
                        <i class='bx bx-trash'></i>
                      </button>
                      <a [routerLink]="['/blog-details', blog.id]" target="_blank" class="btn btn-sm btn-info">
                        <i class='bx bx-show'></i>
                      </a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- No results -->
            <div *ngIf="blogs.length === 0" class="text-center py-4">
              <p>Aucun article trouvé.</p>
            </div>

            <!-- Pagination -->
            <div *ngIf="totalPages > 1" class="pagination-container">
              <nav>
                <ul class="pagination">
                  <li [class.disabled]="currentPage === 1">
                    <button (click)="changePage(currentPage - 1)" [disabled]="currentPage === 1">
                      <i class='bx bx-chevron-left'></i>
                    </button>
                  </li>
                  
                  <li *ngFor="let page of generatePages()" [class.active]="page === currentPage">
                    <button (click)="changePage(page)">{{ page }}</button>
                  </li>
                  
                  <li [class.disabled]="currentPage === totalPages">
                    <button (click)="changePage(currentPage + 1)" [disabled]="currentPage === totalPages">
                      <i class='bx bx-chevron-right'></i>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Delete Confirmation Modal -->
    <div *ngIf="blogToDelete" class="modal-overlay" (click)="cancelDelete()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <h3>Confirmer la suppression</h3>
        <p>Êtes-vous sûr de vouloir supprimer l'article "{{ blogToDelete.title }}" ?</p>
        <div class="modal-actions">
          <button (click)="cancelDelete()" class="btn btn-secondary">Annuler</button>
          <button (click)="confirmDelete()" class="btn btn-danger">Supprimer</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Admin layout styles (same as dashboard) */
    .admin-layout {
      display: flex;
      min-height: 100vh;
    }

    .admin-sidebar {
      width: 250px;
      background: #2c3e50;
      color: white;
      position: fixed;
      height: 100vh;
      overflow-y: auto;
    }

    .sidebar-header {
      padding: 20px;
      border-bottom: 1px solid #34495e;
    }

    .sidebar-header h3 {
      margin: 0;
      color: white;
    }

    .sidebar-menu {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .sidebar-menu li {
      border-bottom: 1px solid #34495e;
    }

    .sidebar-menu a {
      display: flex;
      align-items: center;
      padding: 15px 20px;
      color: #bdc3c7;
      text-decoration: none;
      transition: all 0.3s;
    }

    .sidebar-menu a:hover,
    .sidebar-menu a.active {
      background: #34495e;
      color: white;
    }

    .sidebar-menu i {
      margin-right: 10px;
      font-size: 18px;
    }

    .logout-btn {
      cursor: pointer;
    }

    .admin-main {
      flex: 1;
      margin-left: 250px;
      background: #f8f9fa;
    }

    .admin-header {
      background: white;
      padding: 20px 30px;
      border-bottom: 1px solid #e9ecef;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .admin-header h1 {
      margin: 0;
      color: #2c3e50;
    }

    .admin-content {
      padding: 30px;
    }

    /* Search section */
    .search-section {
      margin-bottom: 20px;
    }

    .search-box {
      display: flex;
      gap: 10px;
      max-width: 400px;
    }

    .form-control {
      flex: 1;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    /* Table styles */
    .blog-table {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .table {
      width: 100%;
      margin: 0;
      border-collapse: collapse;
    }

    .table th,
    .table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e9ecef;
    }

    .table th {
      background: #f8f9fa;
      font-weight: 600;
      color: #2c3e50;
    }

    .blog-thumbnail {
      width: 60px;
      height: 40px;
      object-fit: cover;
      border-radius: 4px;
    }

    .action-buttons {
      display: flex;
      gap: 5px;
    }

    .btn {
      padding: 8px 12px;
      border: none;
      border-radius: 4px;
      text-decoration: none;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }

    .btn-sm {
      padding: 4px 8px;
      font-size: 12px;
    }

    .btn-success {
      background: #27ae60;
      color: white;
    }

    .btn-warning {
      background: #f39c12;
      color: white;
    }

    .btn-danger {
      background: #e74c3c;
      color: white;
    }

    .btn-info {
      background: #3498db;
      color: white;
    }

    .btn-primary {
      background: #3498db;
      color: white;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn:hover {
      opacity: 0.8;
    }

    /* Pagination */
    .pagination-container {
      padding: 20px;
      display: flex;
      justify-content: center;
    }

    .pagination {
      display: flex;
      list-style: none;
      padding: 0;
      gap: 5px;
    }

    .pagination li button {
      padding: 8px 12px;
      border: 1px solid #ddd;
      background: white;
      cursor: pointer;
      border-radius: 4px;
    }

    .pagination li.active button {
      background: #3498db;
      color: white;
      border-color: #3498db;
    }

    .pagination li.disabled button {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      padding: 30px;
      border-radius: 8px;
      max-width: 400px;
      width: 90%;
    }

    .modal-content h3 {
      margin-top: 0;
      color: #2c3e50;
    }

    .modal-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 20px;
    }

    .alert {
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
    }

    .alert-danger {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .spinner-border {
      width: 2rem;
      height: 2rem;
      border: 0.25em solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: spin 0.75s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .text-center {
      text-align: center;
    }

    .text-muted {
      color: #6c757d;
    }
  `]
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

  constructor(
    private adminBlogService: AdminBlogService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.loading = true;
    this.error = null;

    this.adminBlogService.getBlogs(this.currentPage, this.limit, this.searchTerm).subscribe({
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
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR');
  }

  deleteBlog(blog: BlogModel): void {
    this.blogToDelete = blog;
  }

  confirmDelete(): void {
    if (this.blogToDelete) {
      this.adminBlogService.deleteBlog(this.blogToDelete.id).subscribe({
        next: () => {
          this.blogToDelete = null;
          this.loadBlogs();
        },
        error: (error) => {
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
