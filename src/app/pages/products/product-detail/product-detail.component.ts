import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../common/navbar/navbar.component';
import { FooterComponent } from '../../../common/footer/footer.component';

@Component({
  selector: 'app-product-detail',
  imports: [
    RouterModule,
    NavbarComponent,
    FooterComponent,
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {

}
