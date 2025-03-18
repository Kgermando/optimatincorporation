import { Component } from '@angular/core';
import { FooterComponent } from '../../common/footer/footer.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { RouterModule } from '@angular/router'; 
import { FormsModule } from '@angular/forms'; // Import FormsModule


@Component({
  selector: 'app-contact',
  imports: [
    RouterModule,
    NavbarComponent,
    FooterComponent, 
    FormsModule, // Add FormsModule to imports
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  emailForm = {
    text: '',
    from: '',  
    subject: ''
  };

  // async sendEmail() {
  //   const { text, from, subject } = this.emailForm; // Use form data
  //   const client = new SMTPClient({
  //     user: 'contact@optimatincorporation.com',
  //     password: 'optimat@2025',
  //     host: 'mail.gandi.net',
  //     ssl: true,
  //   });

  //   try {
  //     const message = await client.sendAsync({
  //       text: text,
  //       from: from,
  //       to: 'contact@optimatincorporation.com',
  //       cc: 'contact@optimatincorporation.com',
  //       subject: subject,
  //     });
  //     console.log(message);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }
}
