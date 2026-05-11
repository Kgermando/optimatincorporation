import { Component, OnInit, inject, signal } from '@angular/core';
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
  ngOnInit(): void { this.load(); }
  load(): void { this.contactService.getAll().subscribe({ next: r => this.items.set(r.data || []) }); }
  markRead(id: string): void { this.contactService.markRead(id).subscribe(() => this.load()); }
  delete(id: string): void { if (!confirm('Supprimer ?')) return; this.contactService.delete(id).subscribe(() => this.load()); }
  fmt(d: string): string { return new Date(d).toLocaleDateString('fr-FR'); }
}
