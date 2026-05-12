import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TeamService } from '../../core/services/team.service';
import { TeamMember } from '../../core/models';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './team-list.component.html',
  styleUrl: './team-list.component.scss'
})
export class TeamListComponent implements OnInit {
  private teamService = inject(TeamService);
  items = signal<TeamMember[]>([]);
  readonly pageSize = 10;
  page = signal(1);
  totalPages = computed(() => Math.max(1, Math.ceil(this.items().length / this.pageSize)));
  pagedItems = computed(() => {
    const p = this.page(); const s = this.pageSize;
    return this.items().slice((p - 1) * s, p * s);
  });
  pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));
  ngOnInit(): void { this.load(); }
  load(): void { this.teamService.getAll().subscribe({ next: r => { this.items.set(r.data || []); this.page.set(1); } }); }
  delete(id: string): void { if (!confirm('Supprimer ?')) return; this.teamService.delete(id).subscribe(() => this.load()); }
  goTo(p: number): void { if (p >= 1 && p <= this.totalPages()) this.page.set(p); }
}
