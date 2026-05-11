import { Component, OnInit, inject, signal } from '@angular/core';
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
  ngOnInit(): void { this.load(); }
  load(): void { this.teamService.getAll().subscribe({ next: r => this.items.set(r.data || []) }); }
  delete(id: string): void { if (!confirm('Supprimer ?')) return; this.teamService.delete(id).subscribe(() => this.load()); }
}
