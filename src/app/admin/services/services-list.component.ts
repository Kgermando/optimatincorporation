import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServicesService } from '../../core/services/services.service';
import { Service } from '../../core/models';

@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './services-list.component.html',
  styleUrl: './services-list.component.scss'
})
export class ServicesListComponent implements OnInit {
  private srv = inject(ServicesService);
  items = signal<Service[]>([]);
  readonly pageSize = 10;
  page = signal(1);
  totalPages = computed(() => Math.max(1, Math.ceil(this.items().length / this.pageSize)));
  pagedItems = computed(() => {
    const p = this.page(); const s = this.pageSize;
    return this.items().slice((p - 1) * s, p * s);
  });
  pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));
  ngOnInit(): void { this.load(); }
  load(): void { this.srv.getAll().subscribe({ next: r => { this.items.set(r.data || []); this.page.set(1); } }); }
  delete(id: string): void { if (!confirm('Supprimer ?')) return; this.srv.delete(id).subscribe(() => this.load()); }
  goTo(p: number): void { if (p >= 1 && p <= this.totalPages()) this.page.set(p); }
}
