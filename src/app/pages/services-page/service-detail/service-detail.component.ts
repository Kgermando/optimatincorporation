import { Component } from '@angular/core';
import { FooterComponent } from '../../../common/footer/footer.component';
import { NavbarComponent } from '../../../common/navbar/navbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-service-detail',
  imports: [
    RouterModule,
    NavbarComponent,
    FooterComponent,
  ],
  templateUrl: './service-detail.component.html',
  styleUrl: './service-detail.component.scss'
})
export class ServiceDetailComponent {

}
