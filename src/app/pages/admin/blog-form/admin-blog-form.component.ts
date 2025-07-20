import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';  
import { BlogsService } from '../../blog/blogs.service';
import { BlogModel } from '../../blog/models/blog.model';

@Component({
  selector: 'app-admin-blog-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-blog-form.component.html',
  styleUrls: ['./admin-blog-form.component.scss']
})
export class AdminBlogFormComponent implements OnInit {
  blogForm: FormGroup;
  isEditMode = false;
  loading = false;
  error: string | null = null;
  blogId: number | null = null;
  keywords: string[] = [];
  selectedFiles: File[] = [];
  existingFiles: string[] = [];
  currentBlog: BlogModel | null = null;

  constructor(
    private fb: FormBuilder,
     private blogService: BlogsService,
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
      } else {
        // Initialize form for creation mode
        this.initializeForCreation();
      }
    });
  }

  private initializeForCreation(): void {
    this.blogForm.patchValue({
      signature: 'Admin'
    });
    this.keywords = [];
    this.selectedFiles = [];
    this.existingFiles = [];
    this.loading = false;
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
    this.error = null;

    this.blogService.get(this.blogId).subscribe({
      next: (blog: BlogModel) => {
        this.currentBlog = blog;
        this.blogForm.patchValue({
          title: blog.title,
          title_url: blog.title_url,
          resume: blog.resume,
          content: blog.content,
          signature: blog.signature || 'Admin'
        });
        this.keywords = Array.isArray(blog.keyword) ? blog.keyword : [];
        this.existingFiles = Array.isArray(blog.files) ? blog.files : [];
        this.loading = false;
      },
      error: (error: any) => {
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

  removeExistingFile(index: number): void {
    this.existingFiles.splice(index, 1);
  }

  onTitleChange(): void {
    const title = this.blogForm.get('title')?.value;
    if (title && !this.isEditMode) {
      // Auto-generate URL from title
      const url = this.generateUrlFromTitle(title);
      this.blogForm.get('title_url')?.setValue(url);
    }
  }

  private generateUrlFromTitle(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      .trim();
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

    // Prepare form data
    const formValue = this.blogForm.value;
    const blogData: Partial<BlogModel> = {
      title: formValue.title,
      title_url: formValue.title_url,
      resume: formValue.resume,
      content: formValue.content,
      signature: formValue.signature || 'Admin',
      keyword: this.keywords
    };

    // Handle file uploads if any
    if (this.selectedFiles.length > 0) {
      // For now, just add file names to the data
      // In a real implementation, you would upload files first
      const fileNames = this.selectedFiles.map(file => file.name);
      blogData.files = [...(this.existingFiles || []), ...fileNames];
      console.log('Files to upload:', this.selectedFiles);
    } else if (this.existingFiles.length > 0) {
      blogData.files = this.existingFiles;
    }

    console.log('Submitting blog data:', blogData);

    const request = this.isEditMode && this.blogId
      ? this.blogService.update(this.blogId, blogData)
      : this.blogService.create(blogData);

    request.subscribe({
      next: (response: any) => {
        this.loading = false;
        console.log('Blog saved successfully:', response);
        
        // Show success message or navigate back
        alert(this.isEditMode ? 'Article mis à jour avec succès!' : 'Article créé avec succès!');
        this.router.navigate(['/admin/blogs']);
      },
      error: (error: any) => {
        console.error('Error saving blog:', error);
        this.error = this.isEditMode 
          ? 'Erreur lors de la mise à jour de l\'article'
          : 'Erreur lors de la création de l\'article';
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

  resetForm(): void {
    this.blogForm.reset();
    this.keywords = [];
    this.selectedFiles = [];
    this.existingFiles = [];
    this.error = null;
    this.initializeForCreation();
  }

  canDeactivate(): boolean {
    if (this.blogForm.dirty && !this.loading) {
      return confirm('Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter?');
    }
    return true;
  }
}
