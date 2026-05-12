import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ContactService } from '../../core/services/contact.service';
import { ContactMessage } from '../../core/models';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent implements OnInit {
  private contactService = inject(ContactService);
  items = signal<ContactMessage[]>([]);
  readonly pageSize = 10;
  page = signal(1);
  totalPages = computed(() => Math.max(1, Math.ceil(this.items().length / this.pageSize)));
  pagedItems = computed(() => {
    const p = this.page(); const s = this.pageSize;
    return this.items().slice((p - 1) * s, p * s);
  });
  pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));
  ngOnInit(): void { this.load(); }
  load(): void { this.contactService.getAll().subscribe({ next: r => { this.items.set(r.data || []); this.page.set(1); } }); }
  markRead(id: string): void { this.contactService.markRead(id).subscribe(() => this.load()); }
  delete(id: string): void { if (!confirm('Supprimer ?')) return; this.contactService.delete(id).subscribe(() => this.load()); }
  fmt(d: string): string { return new Date(d).toLocaleDateString('fr-FR'); }
  goTo(p: number): void { if (p >= 1 && p <= this.totalPages()) this.page.set(p); }
}
