import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { ContactMessage } from '../models';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private api = inject(ApiService);

  send(data: ContactMessage) { return this.api.post<void>('contact', data); }
  getAll() { return this.api.get<ContactMessage[]>('contact'); }
  markRead(id: string) { return this.api.put<void>('contact', id, { read: true }); }
  delete(id: string) { return this.api.delete<void>('contact', id); }
}
