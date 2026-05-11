import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ServicesService } from '../../core/services/services.service';
import { Service } from '../../core/models';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './service-form.component.html',
  styleUrl: './service-form.component.scss'
})
export class ServiceFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private srv = inject(ServicesService);
  isEdit = false; loading = signal(false); error = signal('');
  item: Partial<Service> = { title: '', subtitle: '', description: '', icon: '', features: [] };
  featuresText = signal('');
  setFeatures(v: string): void { this.item.features = v.split('\n').map(s => s.trim()).filter(Boolean); }
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) { this.isEdit = true; this.srv.getOne(id).subscribe({ next: r => { this.item = r.data; this.featuresText.set((r.data.features || []).join('\n')); } }); }
  }
  save(): void {
    this.loading.set(true);
    const obs = this.isEdit ? this.srv.update(this.item.id!, this.item) : this.srv.create(this.item);
    obs.subscribe({ next: () => this.router.navigate(['/admin/services']), error: () => { this.error.set('Erreur.'); this.loading.set(false); } });
  }
}
