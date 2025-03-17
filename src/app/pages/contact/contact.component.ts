import { Component } from '@angular/core';
import { FooterComponent } from '../../common/footer/footer.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact',
  imports: [
    RouterModule,
    NavbarComponent,
    FooterComponent, 
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {

}
