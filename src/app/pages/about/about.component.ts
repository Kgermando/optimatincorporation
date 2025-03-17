import { Component } from '@angular/core';
import { FooterComponent } from '../../common/footer/footer.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [
    RouterModule,
    NavbarComponent,
    FooterComponent, 
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

}
