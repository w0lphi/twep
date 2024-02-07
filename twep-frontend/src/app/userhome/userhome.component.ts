import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule, MatDrawer } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

import { NavigationLink } from '../model/navigationLink';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from '../service/auth.service';



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
    MatTabsModule,
    MatSidenavModule,
    MatListModule
  ],
  templateUrl: './userhome.component.html',
  styleUrl: './userhome.component.scss'
})
export class UserhomeComponent {
  @ViewChild('drawer') drawer?: MatDrawer;
  activeLinkIndex?: number;
  isMobile: boolean = true;
  navigationLinks: NavigationLink[] = [
    new NavigationLink("Map", "map", "/user/home"),
    new NavigationLink("Wallet", "account_balance_wallet", "/user/wallet"),
    new NavigationLink("Tickets", "confirmation_number", "/user/tickets"),
    new NavigationLink("History", "history", "/user/history")
  ];

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
  ) {
    this.breakpointObserver.observe(Breakpoints.XSmall).subscribe(result => {
      this.isMobile = result.matches;
      if(!this.isMobile) this.drawer?.close();
    })
  }
  
  ngOnInit(): void {
    this.activeLinkIndex = this.navigationLinks.findIndex(tab => tab.route === this.router.url);
  }

  navigate(index: number): void {
    const link: NavigationLink = this.navigationLinks[index];
    this.activeLinkIndex = index;
    this.router.navigateByUrl(link.route);
    if(this.isMobile) this.drawer?.close();
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl("/login");
  }

  openAccount() {
    this.router.navigateByUrl("/user/account");
    if(this.isMobile) this.drawer?.close();
  }
}
