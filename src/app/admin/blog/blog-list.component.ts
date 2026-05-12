import { Component, OnInit, inject, signal, computed } from '@angular/core';
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
  readonly pageSize = 10;
  page = signal(1);
  totalPages = computed(() => Math.max(1, Math.ceil(this.items().length / this.pageSize)));
  pagedItems = computed(() => {
    const p = this.page(); const s = this.pageSize;
    return this.items().slice((p - 1) * s, p * s);
  });
  pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));
  ngOnInit(): void { this.load(); }
  load(): void { this.blogService.getAll().subscribe({ next: r => { this.items.set(r.data || []); this.page.set(1); } }); }
  delete(id: string): void { if (!confirm('Supprimer ?')) return; this.blogService.delete(id).subscribe(() => this.load()); }
  fmt(d: string): string { return new Date(d).toLocaleDateString('fr-FR'); }
  goTo(p: number): void { if (p >= 1 && p <= this.totalPages()) this.page.set(p); }
}
