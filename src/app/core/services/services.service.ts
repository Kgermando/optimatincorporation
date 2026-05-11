import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Service } from '../models';

@Injectable({ providedIn: 'root' })
export class ServicesService {
  private api = inject(ApiService);

  getAll() { return this.api.get<Service[]>('services'); }
  getBySlug(slug: string) { return this.api.getOne<Service>('services', slug); }
  create(data: Partial<Service>) { return this.api.post<Service>('services', data); }
  update(id: string, data: Partial<Service>) { return this.api.put<Service>('services', id, data); }
  delete(id: string) { return this.api.delete<void>('services', id); }
}
