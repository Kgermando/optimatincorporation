import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {
  private route = inject(ActivatedRoute); private router = inject(Router);
  private userService = inject(UserService);
  isEdit = false; loading = signal(false); error = signal('');
  item: Partial<User & { password?: string }> = { name: '', email: '', role: 'editor' };
  password = '';
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) { this.isEdit = true; this.userService.getOne(id).subscribe({ next: r => this.item = r.data }); }
  }
  save(): void {
    if (!this.isEdit) this.item.password = this.password;
    this.loading.set(true);
    const obs = this.isEdit ? this.userService.update(this.item.id!, this.item) : this.userService.create({ ...this.item, password: this.password });
    obs.subscribe({ next: () => this.router.navigate(['/admin/users']), error: () => { this.error.set('Erreur.'); this.loading.set(false); } });
  }
}
