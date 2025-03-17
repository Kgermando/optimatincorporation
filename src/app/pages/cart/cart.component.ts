import { Component } from '@angular/core';
import { FooterComponent } from '../../common/footer/footer.component';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../common/navbar/navbar.component';

@Component({
  selector: 'app-cart',
  imports: [
    RouterModule,
    NavbarComponent,
    FooterComponent,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {

}
