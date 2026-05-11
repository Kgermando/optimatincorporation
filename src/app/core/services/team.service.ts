import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { TeamMember } from '../models';

@Injectable({ providedIn: 'root' })
export class TeamService {
  private api = inject(ApiService);

  getAll() { return this.api.get<TeamMember[]>('team'); }
  getOne(id: string) { return this.api.getOne<TeamMember>('team', id); }
  create(data: Partial<TeamMember>) { return this.api.post<TeamMember>('team', data); }
  update(id: string, data: Partial<TeamMember>) { return this.api.put<TeamMember>('team', id, data); }
  delete(id: string) { return this.api.delete<void>('team', id); }
}
