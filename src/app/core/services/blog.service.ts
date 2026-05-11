import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Blog, PaginationQuery } from '../models';

@Injectable({ providedIn: 'root' })
export class BlogService {
  private api = inject(ApiService);

  getAll(query?: PaginationQuery) { return this.api.get<Blog[]>('blog', query); }
  getBySlug(slug: string) { return this.api.getOne<Blog>('blog', slug); }
  create(data: Partial<Blog>) { return this.api.post<Blog>('blog', data); }
  update(id: string, data: Partial<Blog>) { return this.api.put<Blog>('blog', id, data); }
  delete(id: string) { return this.api.delete<void>('blog', id); }
}
