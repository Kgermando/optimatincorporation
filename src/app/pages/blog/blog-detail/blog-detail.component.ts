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
  
  // Propriétés pour la sidebar
  popularBlogs: BlogModel[] = [];
  archives: any[] = [];
  categories: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private blogsService: BlogsService
  ) {}

  ngOnInit(): void {
    // Charger les données de la sidebar
    this.loadSidebarData();
    
    this.route.params.subscribe(params => {
      const title_url = params['title_url'];
      if (title_url) {
        this.loadBlog(title_url);
      }
    });
  }

  loadBlog(title_url: string): void {
    this.loading = true;
    this.error = null;
    
    this.blogsService.getTitle(title_url).subscribe({
      next: (blog) => {
        this.blog = blog;
        this.loading = false;

        // Incrémenter les vues
        // this.blogsService.incrementViews(id).subscribe();
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

  loadSidebarData(): void {
    // Charger les articles populaires
    this.blogsService.getAll().subscribe({
      next: (blogs) => {
        // Prendre les 5 premiers articles comme populaires
        this.popularBlogs = blogs.slice(0, 5);
        
        // Générer des archives fictives (vous pouvez adapter selon vos besoins)
        this.generateArchives(blogs);
        
        // Générer des catégories fictives
        this.generateCategories();
      },
      error: (error) => {
        console.error('Error loading sidebar data:', error);
      }
    });
  }

  generateArchives(blogs: BlogModel[]): void {
    const monthNames = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    
    this.archives = [
      { month: 12, year: 2024, monthName: 'Décembre 2024' },
      { month: 11, year: 2024, monthName: 'Novembre 2024' },
      { month: 10, year: 2024, monthName: 'Octobre 2024' },
      { month: 9, year: 2024, monthName: 'Septembre 2024' },
      { month: 8, year: 2024, monthName: 'Août 2024' }
    ];
  }

  generateCategories(): void {
    this.categories = [
      { name: 'Technologie', count: 15 },
      { name: 'Business', count: 12 },
      { name: 'Design', count: 8 },
      { name: 'Marketing', count: 10 },
      { name: 'Développement', count: 18 }
    ];
  }
}
