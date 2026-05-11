import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Portfolio, PaginationQuery } from '../models';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private api = inject(ApiService);

  getAll(query?: PaginationQuery) {
    return this.api.get<Portfolio[]>('portfolio', query);
  }

  getBySlug(slug: string) {
    return this.api.getOne<Portfolio>('portfolio', slug);
  }

  create(data: Partial<Portfolio>) {
    return this.api.post<Portfolio>('portfolio', data);
  }

  update(id: string, data: Partial<Portfolio>) {
    return this.api.put<Portfolio>('portfolio', id, data);
  }

  delete(id: string) {
    return this.api.delete<void>('portfolio', id);
  }
}
