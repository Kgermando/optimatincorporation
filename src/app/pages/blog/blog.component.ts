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
  blogs: BlogModel[] = []
  currentPage = 1;
  totalPages = 0;
  itemsPerPage = 10;

  loading = false;
  error: string | null = null;

  constructor(private blogService: BlogsService) { }


  ngOnInit(): void {
    this.blogService.refreshDataList$.subscribe(() => {
      this.fetchData();
    });
    this.fetchData();
  }

  fetchData() {
    this.loading = true;
    this.error = null;
    
    this.blogService.getPaginated(this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response) => {
          this.blogs = response.data;
          this.totalPages = response.pagination.total_pages;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Erreur lors du chargement des articles';
          this.loading = false;
          console.error('Error fetching blogs:', error);
        }
      });
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchData();
    }
  }

  generatePages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  getImageUrl(files: string[]): string {
    if (files && files.length > 0) {
      return this.getLink(files[0]);
    }
    return 'assets/img/blog/blog1.jpg';
  }

  formatDate(dateString: string | Date): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }


  getPageNumbers() {
    const pageNumbers = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  }

  public getLink(url: string) {
    const link = `${environment.urlFile}`; //"http://localhost:8000/" 
    return link + url;
  }
}
