import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { ContactMessage } from '../models';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private api = inject(ApiService);

  send(data: ContactMessage) { return this.api.post<void>('contacts', data); }
  getAll() { return this.api.get<ContactMessage[]>('contacts'); }
  markRead(id: string) { return this.api.put<void>('contacts', `${id}/read`, {}); }
  delete(id: string) { return this.api.delete<void>('contacts', id); }
}
