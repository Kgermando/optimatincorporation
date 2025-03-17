import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; 

import { NavbarComponent } from '../../common/navbar/navbar.component';
import { FooterComponent } from '../../common/footer/footer.component';


@Component({
  selector: 'app-home',
  imports: [
    RouterModule, 
    NavbarComponent,
    FooterComponent, 
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
