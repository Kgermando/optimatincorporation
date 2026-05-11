import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../core/services/blog.service';
import { Blog } from '../../core/models';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss'
})
export class BlogListComponent implements OnInit {
  private blogService = inject(BlogService);
  items = signal<Blog[]>([]);
  ngOnInit(): void { this.load(); }
  load(): void { this.blogService.getAll().subscribe({ next: r => this.items.set(r.data || []) }); }
  delete(id: string): void { if (!confirm('Supprimer ?')) return; this.blogService.delete(id).subscribe(() => this.load()); }
  fmt(d: string): string { return new Date(d).toLocaleDateString('fr-FR'); }
}
