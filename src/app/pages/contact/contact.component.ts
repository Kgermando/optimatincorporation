import { Component, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { ContactService } from '../../core/services/contact.service';
import { ContactMessage } from '../../core/models';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterLink, FormsModule, RevealDirective],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  private contactService = inject(ContactService);

  submitting = signal(false);
  submitted = signal(false);
  error = signal('');

  form: ContactMessage = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };

  send(): void {
    this.submitting.set(true);
    this.error.set('');

    this.contactService.send(this.form).subscribe({
      next: () => {
        this.submitted.set(true);
        this.submitting.set(false);
        this.form = { name: '', email: '', phone: '', subject: '', message: '' };
      },
      error: () => {
        this.error.set('Une erreur est survenue. Veuillez réessayer.');
        this.submitting.set(false);
      }
    });
  }
}
