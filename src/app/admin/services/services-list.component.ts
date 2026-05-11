import { Component, OnInit, inject, signal } from '@angular/core';
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
  ngOnInit(): void { this.load(); }
  load(): void { this.srv.getAll().subscribe({ next: r => this.items.set(r.data || []) }); }
  delete(id: string): void { if (!confirm('Supprimer ?')) return; this.srv.delete(id).subscribe(() => this.load()); }
}
