import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';

import { NavigationLink } from '../model/navigationLink';



@Component({
  selector: 'app-userhome',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatTabsModule
  ],
  templateUrl: './userhome.component.html',
  styleUrl: './userhome.component.scss'
})
export class UserhomeComponent {
  activeLink?: NavigationLink;
  navigationLinks: NavigationLink[] = [
    new NavigationLink("Map", "", "/user/home"),
    new NavigationLink("Wallet", "", "/user/wallet"),
    new NavigationLink("Tickets", "", "/user/tickets"),
    new NavigationLink("History", "", "/user/history")
  ];

  constructor(
    private router: Router
  ) { 
  
  }
  
  ngOnInit(): void {
    console.log(this.router.url);
    this.activeLink = this.navigationLinks.find(tab => tab.route === this.router.url);
  }

  navigate(link: NavigationLink): void {
    this.activeLink = link;
    this.router.navigateByUrl(link.route);
  }
}
