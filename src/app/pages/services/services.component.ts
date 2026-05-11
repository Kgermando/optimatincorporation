import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { ServicesService } from '../../core/services/services.service';
import { Service } from '../../core/models';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RouterLink, MatIconModule, RevealDirective],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent implements OnInit {
  private servicesService = inject(ServicesService);
  loading = signal(true);
  services = signal<Service[]>([]);

  ngOnInit(): void {
    this.servicesService.getAll().subscribe({
      next: res => {
        this.services.set(res.data || []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
