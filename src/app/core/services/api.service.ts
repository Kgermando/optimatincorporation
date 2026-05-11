import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginationQuery } from '../models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  protected base = environment.apiUrl;

  get<T>(path: string, query?: PaginationQuery): Observable<ApiResponse<T>> {
    let params = new HttpParams();
    if (query) {
      Object.entries(query).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          params = params.set(key, String(val));
        }
      });
    }
    return this.http.get<ApiResponse<T>>(`${this.base}/${path}`, { params });
  }

  getOne<T>(path: string, id: string): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.base}/${path}/${id}`);
  }

  post<T>(path: string, body: unknown): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.base}/${path}`, body);
  }

  put<T>(path: string, id: string, body: unknown): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.base}/${path}/${id}`, body);
  }

  delete<T>(path: string, id: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(`${this.base}/${path}/${id}`);
  }

  upload(file: File, folder: string): Observable<ApiResponse<{ url: string; file_id: string }>> {
    const form = new FormData();
    form.append('file', file);
    form.append('folder', folder);
    return this.http.post<ApiResponse<{ url: string; file_id: string }>>(`${this.base}/upload`, form);
  }
}
