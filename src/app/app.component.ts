import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { 
    Router,
    RouterOutlet, 
  } from '@angular/router' 
import { TitleService } from './services/title.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'optimatincorporation';

  private titleService = inject(TitleService)
 
  constructor() { }

  ngOnInit(): void {
    this.titleService.init()
  }
}
