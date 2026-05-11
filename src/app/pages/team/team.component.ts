import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { TeamService } from '../../core/services/team.service';
import { TeamMember } from '../../core/models';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [RouterLink, RevealDirective],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss'
})
export class TeamComponent implements OnInit {
  private teamService = inject(TeamService);
  loading = signal(true);
  members = signal<TeamMember[]>([]);

  ngOnInit(): void {
    this.teamService.getAll().subscribe({
      next: res => { this.members.set(res.data || []); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
