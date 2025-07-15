import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService, PaginationResponse } from '../../../services/api.service';
import { BlogModel } from '../../blog/models/blog.model';

export interface CreateBlogRequest {
  title: string;
  title_url: string;
  resume: string;
  content: string;
  keyword: string[];
  signature: string;
  files: File[];
}

export interface UpdateBlogRequest {
  title?: string;
  title_url?: string;
  resume?: string;
  content?: string;
  keyword?: string[];
  signature?: string;
  files?: File[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminBlogService extends ApiService {
  private endpoint = '/admin/blogs';

  constructor(http: HttpClient) {
    super(http);
  }

  getBlogs(page: number = 1, limit: number = 10, search?: string): Observable<PaginationResponse<BlogModel>> {
    const params = search ? { search } : {};
    return this.getWithPagination<BlogModel>(this.endpoint, page, limit, params);
  }

  getBlogById(id: number): Observable<BlogModel> {
    return this.get<BlogModel>(`${this.endpoint}/${id}`);
  }

  createBlog(blog: CreateBlogRequest): Observable<BlogModel> {
    const formData = new FormData();
    formData.append('title', blog.title);
    formData.append('title_url', blog.title_url);
    formData.append('resume', blog.resume);
    formData.append('content', blog.content);
    formData.append('signature', blog.signature);
    formData.append('keyword', JSON.stringify(blog.keyword));
    
    blog.files.forEach((file, index) => {
      formData.append('files', file);
    });

    return this.http.post<BlogModel>(`${this.baseUrl}${this.endpoint}`, formData, {
      headers: this.getHeaders().delete('Content-Type') // Let browser set content-type for FormData
    });
  }

  updateBlog(id: number, blog: UpdateBlogRequest): Observable<BlogModel> {
    const formData = new FormData();
    
    if (blog.title) formData.append('title', blog.title);
    if (blog.title_url) formData.append('title_url', blog.title_url);
    if (blog.resume) formData.append('resume', blog.resume);
    if (blog.content) formData.append('content', blog.content);
    if (blog.signature) formData.append('signature', blog.signature);
    if (blog.keyword) formData.append('keyword', JSON.stringify(blog.keyword));
    
    if (blog.files && blog.files.length > 0) {
      blog.files.forEach((file, index) => {
        formData.append('files', file);
      });
    }

    return this.http.put<BlogModel>(`${this.baseUrl}${this.endpoint}/${id}`, formData, {
      headers: this.getHeaders().delete('Content-Type')
    });
  }

  deleteBlog(id: number): Observable<any> {
    return this.delete(`${this.endpoint}/${id}`);
  }

  publishBlog(id: number): Observable<BlogModel> {
    return this.post<BlogModel>(`${this.endpoint}/${id}/publish`, {});
  }

  unpublishBlog(id: number): Observable<BlogModel> {
    return this.post<BlogModel>(`${this.endpoint}/${id}/unpublish`, {});
  }
}
