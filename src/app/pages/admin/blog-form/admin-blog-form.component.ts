import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminBlogService } from '../services/admin-blog.service';
import { BlogModel } from '../../blog/models/blog.model';

@Component({
  selector: 'app-admin-blog-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
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
          <h1 *ngIf="isEditMode">Modifier l'article</h1>
          <h1 *ngIf="!isEditMode">Créer un nouvel article</h1>
          <a routerLink="/admin/blogs" class="btn btn-secondary">
            <i class='bx bx-arrow-back'></i>
            Retour à la liste
          </a>
        </div>

        <div class="admin-content">
          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-header">
                  <h5 *ngIf="isEditMode">Modification de l'article</h5>
                  <h5 *ngIf="!isEditMode">Informations de l'article</h5>
                </div>
                <div class="card-body">
                  <form [formGroup]="blogForm" (ngSubmit)="onSubmit()">
                    <div class="row">
                      <div class="col-md-8">
                        <div class="form-group mb-3">
                          <label for="title">Titre *</label>
                          <input 
                            type="text" 
                            id="title" 
                            formControlName="title"
                            class="form-control"
                            [class.is-invalid]="isFieldInvalid('title')"
                            placeholder="Titre de l'article"
                          >
                          <div *ngIf="isFieldInvalid('title')" class="invalid-feedback">
                            Le titre est requis
                          </div>
                        </div>

                        <div class="form-group mb-3">
                          <label for="title_url">URL du titre *</label>
                          <input 
                            type="text" 
                            id="title_url" 
                            formControlName="title_url"
                            class="form-control"
                            [class.is-invalid]="isFieldInvalid('title_url')"
                            placeholder="url-de-l-article"
                          >
                          <div *ngIf="isFieldInvalid('title_url')" class="invalid-feedback">
                            L'URL du titre est requise
                          </div>
                          <small class="form-text text-muted">
                            Format: url-de-l-article (sans espaces, caractères spéciaux)
                          </small>
                        </div>

                        <div class="form-group mb-3">
                          <label for="resume">Résumé *</label>
                          <textarea 
                            id="resume" 
                            formControlName="resume"
                            class="form-control"
                            [class.is-invalid]="isFieldInvalid('resume')"
                            rows="3"
                            placeholder="Résumé de l'article"
                          ></textarea>
                          <div *ngIf="isFieldInvalid('resume')" class="invalid-feedback">
                            Le résumé est requis
                          </div>
                        </div>

                        <div class="form-group mb-3">
                          <label for="content">Contenu *</label>
                          <textarea 
                            id="content" 
                            formControlName="content"
                            class="form-control"
                            [class.is-invalid]="isFieldInvalid('content')"
                            rows="15"
                            placeholder="Contenu complet de l'article (HTML supporté)"
                          ></textarea>
                          <div *ngIf="isFieldInvalid('content')" class="invalid-feedback">
                            Le contenu est requis
                          </div>
                          <small class="form-text text-muted">
                            Vous pouvez utiliser du HTML pour formater le contenu
                          </small>
                        </div>
                      </div>

                      <div class="col-md-4">
                        <div class="form-group mb-3">
                          <label for="signature">Signature</label>
                          <input 
                            type="text" 
                            id="signature" 
                            formControlName="signature"
                            class="form-control"
                            placeholder="Nom de l'auteur"
                          >
                        </div>

                        <div class="form-group mb-3">
                          <label for="keyword">Mots-clés</label>
                          <input 
                            type="text" 
                            id="keyword" 
                            formControlName="keywordInput"
                            class="form-control"
                            placeholder="Tapez et appuyez sur Entrée"
                            (keydown.enter)="addKeyword($event)"
                          >
                          <small class="form-text text-muted">
                            Appuyez sur Entrée pour ajouter un mot-clé
                          </small>
                          
                          <div class="keywords-list mt-2">
                            <span 
                              *ngFor="let keyword of keywords; let i = index" 
                              class="badge badge-secondary me-1 mb-1"
                            >
                              {{ keyword }}
                              <button 
                                type="button" 
                                class="btn-close btn-close-white btn-sm ms-1"
                                (click)="removeKeyword(i)"
                              ></button>
                            </span>
                          </div>
                        </div>

                        <div class="form-group mb-3">
                          <label for="files">Images</label>
                          <input 
                            type="file" 
                            id="files" 
                            (change)="onFileSelect($event)"
                            class="form-control"
                            multiple
                            accept="image/*"
                          >
                          <small class="form-text text-muted">
                            Sélectionnez une ou plusieurs images
                          </small>
                          
                          <div class="selected-files mt-2" *ngIf="selectedFiles.length > 0">
                            <div *ngFor="let file of selectedFiles; let i = index" class="file-item">
                              <span>{{ file.name }}</span>
                              <button 
                                type="button" 
                                class="btn btn-sm btn-danger ms-2"
                                (click)="removeFile(i)"
                              >×</button>
                            </div>
                          </div>
                        </div>

                        <div class="form-actions">
                          <button 
                            type="submit" 
                            class="btn btn-primary me-2"
                            [disabled]="blogForm.invalid || loading"
                          >
                            <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                            <span *ngIf="isEditMode">Mettre à jour</span>
                            <span *ngIf="!isEditMode">Créer l'article</span>
                          </button>
                          
                          <a routerLink="/admin/blogs" class="btn btn-secondary">
                            Annuler
                          </a>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styleUrls: ['../admin-styles.scss']
})
export class AdminBlogFormComponent implements OnInit {
  blogForm: FormGroup;
  isEditMode = false;
  loading = false;
  error: string | null = null;
  blogId: number | null = null;
  keywords: string[] = [];
  selectedFiles: File[] = [];

  constructor(
    private fb: FormBuilder,
    private adminBlogService: AdminBlogService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.blogForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.blogId = +params['id'];
        this.isEditMode = true;
        this.loadBlog();
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required]],
      title_url: ['', [Validators.required]],
      resume: ['', [Validators.required]],
      content: ['', [Validators.required]],
      signature: ['Admin'],
      keywordInput: ['']
    });
  }

  private loadBlog(): void {
    if (!this.blogId) return;

    this.loading = true;
    this.adminBlogService.getBlogById(this.blogId).subscribe({
      next: (blog) => {
        this.blogForm.patchValue({
          title: blog.title,
          title_url: blog.title_url,
          resume: blog.resume,
          content: blog.content,
          signature: blog.signature || 'Admin'
        });
        this.keywords = blog.keyword || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading blog:', error);
        this.error = 'Erreur lors du chargement de l\'article';
        this.loading = false;
      }
    });
  }

  addKeyword(event: Event): void {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const keyword = input.value.trim();
    
    if (keyword && !this.keywords.includes(keyword)) {
      this.keywords.push(keyword);
      input.value = '';
      this.blogForm.get('keywordInput')?.setValue('');
    }
  }

  removeKeyword(index: number): void {
    this.keywords.splice(index, 1);
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  isFieldInvalid(field: string): boolean {
    const formField = this.blogForm.get(field);
    return !!(formField && formField.invalid && (formField.dirty || formField.touched));
  }

  onSubmit(): void {
    if (this.blogForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const formData = {
      ...this.blogForm.value,
      keyword: this.keywords,
      files: this.selectedFiles
    };

    const request = this.isEditMode && this.blogId 
      ? this.adminBlogService.updateBlog(this.blogId, formData)
      : this.adminBlogService.createBlog(formData);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/admin/blogs']);
      },
      error: (error) => {
        console.error('Error saving blog:', error);
        this.error = 'Erreur lors de la sauvegarde de l\'article';
        this.loading = false;
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.blogForm.controls).forEach(key => {
      const control = this.blogForm.get(key);
      control?.markAsTouched();
    });
  }

  logout(): void {
    // Implémentation de la déconnexion
    this.router.navigate(['/admin/login']);
  }
}
