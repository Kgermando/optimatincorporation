import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PortfolioService } from '../../core/services/portfolio.service';
import { ServicesService } from '../../core/services/services.service';
import { TeamService } from '../../core/services/team.service';
import { ContactService } from '../../core/services/contact.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private portfolioService = inject(PortfolioService);
  private servicesService = inject(ServicesService);
  private teamService = inject(TeamService);
  private contactService = inject(ContactService);

  stats = signal({ portfolio: 0, services: 0, team: 0, messages: 0 });
  recentContacts = signal<any[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    Promise.all([
      this.portfolioService.getAll().toPromise(),
      this.servicesService.getAll().toPromise(),
      this.teamService.getAll().toPromise(),
      this.contactService.getAll().toPromise()
    ]).then(([portfolio, services, team, contacts]) => {
      this.stats.set({
        portfolio: portfolio?.data?.length ?? 0,
        services: services?.data?.length ?? 0,
        team: team?.data?.length ?? 0,
        messages: contacts?.data?.length ?? 0
      });
      this.recentContacts.set(contacts?.data ?? []);
      this.loading.set(false);
    }).catch(() => this.loading.set(false));
  }

  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}
