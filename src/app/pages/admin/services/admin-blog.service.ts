import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BlogModel } from '../../blog/models/blog.model';
import { BlogsService } from '../../blog/blogs.service';

export interface BlogListResponse {
  data: BlogModel[];
  page: number;
  totalPages: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminBlogService {

  constructor(private blogService: BlogsService) {}

  /**
   * Create a new blog
   */
  createBlog(blogData: Partial<BlogModel>): Observable<BlogModel> {
    return this.blogService.create(blogData);
  }

  /**
   * Update an existing blog
   */
  updateBlog(id: number, blogData: Partial<BlogModel>): Observable<BlogModel> {
    return this.blogService.update(id, blogData);
  }

  /**
   * Delete a blog
   */
  deleteBlog(id: number): Observable<void> {
    return this.blogService.delete(id);
  }

  /**
   * Get a single blog by ID
   */
  getBlog(id: number): Observable<BlogModel> {
    return this.blogService.get(id);
  }

  /**
   * Upload files for a blog
   */
  uploadFiles(files: File[]): Observable<string[]> {
    // TODO: Implement file upload logic
    return of([]);
  }

  /**
   * Delete a file
   */
  deleteFile(filename: string): Observable<void> {
    // TODO: Implement file deletion logic
    return of();
  }
}
