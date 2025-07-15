import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PaginationResponse } from '../../services/api.service';
import { BlogModel } from './models/blog.model';

@Injectable({
  providedIn: 'root'
})
export class BlogsService extends ApiService {
  private endpoint = '/blogs';

  getBlogs(page: number = 1, limit: number = 6): Observable<PaginationResponse<BlogModel>> {
    return this.getWithPagination<BlogModel>(this.endpoint, page, limit);
  }

  getBlogById(id: number): Observable<BlogModel> {
    return this.get<BlogModel>(`${this.endpoint}/${id}`);
  }

  getBlogByUrl(url: string): Observable<BlogModel> {
    return this.get<BlogModel>(`${this.endpoint}/url/${url}`);
  }

  incrementViews(id: number): Observable<any> {
    return this.post(`${this.endpoint}/${id}/views`, {});
  }
}