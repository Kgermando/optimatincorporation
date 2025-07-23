import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';    
import { ApiResponse } from '../models/api-response.model';

// const cacheBuster$ = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export abstract class ApiService {
  abstract get endpoint(): string; 

  constructor(protected http: HttpClient) { }

  private _refreshDataList$ = new Subject<void>();

  private _refreshData$ = new Subject<void>();

  get refreshDataList$() {
    return this._refreshDataList$;
  }

  get refreshData$() {
    return this._refreshData$;
  }
  
  // @Cacheable({ cacheBusterObserver: cacheBuster$ })
  getPaginated(page: number, pageSize: number): Observable<ApiResponse> { 
    const params = {
      signature: 'optimatincorporation',
      page: page,
      page_size: pageSize
    };
    return this.http.get<ApiResponse>(`${this.endpoint}/all/paginate`, { params });
  }
 
  // @Cacheable({ cacheBusterObserver: cacheBuster$ })
  getAll(): Observable<any> {
    return this.http.get(`${this.endpoint}/all`);
  }

  getAllLimit(): Observable<any> {
    return this.http.get(`${this.endpoint}/all/limit`);
  }
  

  get(id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/get/${id}`);
  }

  getTitle(title_url: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-by-title/${title_url}`);
  }
 

  create(data: any): Observable<any> {
    return this.http.post(`${this.endpoint}/create`, data, {
      reportProgress: true,
      observe: 'events'
    }).pipe(tap(() => {
      this._refreshDataList$.next();
      this._refreshData$.next();
      // cacheBuster$.next();
    }));
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.endpoint}/update/${id}`, data).pipe(tap(() => {
      this._refreshDataList$.next();
      this._refreshData$.next();
      // cacheBuster$.next();
    }));
  }
 

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/delete/${id}`).pipe(tap(() => {
      this._refreshDataList$.next();
      this._refreshData$.next();
      // cacheBuster$.next();
    }));
  }

  // Get file
  getFile(url: string): Observable<any> {
    return this.http.get(`${this.endpoint}/${url}`);
  }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file); 
    return this.http.post(`${this.endpoint}/uploads`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
}