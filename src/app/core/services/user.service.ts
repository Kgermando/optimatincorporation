import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = inject(ApiService);

  getAll() { return this.api.get<User[]>('users'); }
  getOne(id: string) { return this.api.getOne<User>('users', id); }
  create(data: Partial<User> & { password: string }) { return this.api.post<User>('users', data); }
  update(id: string, data: Partial<User>) { return this.api.put<User>('users', id, data); }
  delete(id: string) { return this.api.delete<void>('users', id); }
}
