import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TeamService } from '../../core/services/team.service';
import { ApiService } from '../../core/services/api.service';
import { TeamMember } from '../../core/models';

@Component({
  selector: 'app-team-form',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './team-form.component.html',
  styleUrl: './team-form.component.scss'
})
export class TeamFormComponent implements OnInit {
  private route = inject(ActivatedRoute); private router = inject(Router);
  private teamService = inject(TeamService); private apiService = inject(ApiService);
  isEdit = false; loading = signal(false); uploading = signal(false); error = signal('');
  item: Partial<TeamMember> = { name: '', position: '', bio: '', photo_url: '', order: 0 };
  uploadPhoto(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0]; if (!file) return;
    this.uploading.set(true);
    this.apiService.upload(file, 'team').subscribe({ next: r => { this.item.photo_url = r.data?.url; this.uploading.set(false); }, error: () => this.uploading.set(false) });
  }
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) { this.isEdit = true; this.teamService.getOne(id).subscribe({ next: r => this.item = r.data }); }
  }
  save(): void {
    this.loading.set(true);
    const obs = this.isEdit ? this.teamService.update(this.item.id!, this.item) : this.teamService.create(this.item);
    obs.subscribe({ next: () => this.router.navigate(['/admin/team']), error: () => { this.error.set('Erreur.'); this.loading.set(false); } });
  }
}
