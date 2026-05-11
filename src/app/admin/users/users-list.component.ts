import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent implements OnInit {
  private userService = inject(UserService);
  items = signal<User[]>([]);
  ngOnInit(): void { this.load(); }
  load(): void { this.userService.getAll().subscribe({ next: r => this.items.set(r.data || []) }); }
  delete(id: string): void { if (!confirm('Supprimer ?')) return; this.userService.delete(id).subscribe(() => this.load()); }
}
