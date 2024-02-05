import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Router, RouterOutlet, RouterLink } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule, MatDrawer } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

import { NavigationLink } from '../../model/navigationLink';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-admin-hub',
  standalone: true,
  imports: [MatToolbarModule, MatSidenavModule, MatListModule, MatIconModule, CommonModule, MatDividerModule, MatButtonModule, RouterOutlet, RouterLink],
  templateUrl: './admin-hub.component.html',
  styleUrl: './admin-hub.component.scss'
})
  
export class AdminHubComponent {
  @ViewChild('drawer') drawer?: MatDrawer;
  activeLink?: NavigationLink | null;
  isSmallScreen: boolean = true;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private breakpointObserver: BreakpointObserver
  ) {
    router.events.subscribe(() => {
      const url: string = this.router.url;
      const route: string = url.replace("/admin/", "");
      this.activeLink = this.navigationLinks.find(navlink => navlink?.route && route.includes(navlink?.route)) ?? null;
    })

    this.breakpointObserver.observe(Breakpoints.WebLandscape).subscribe(result => {
      this.isSmallScreen = !result.matches;
    })
  }

  openLink(link: NavigationLink) {
    this.router.navigate([`admin/${link.route}`]);
    this.activeLink = link;
    if(this.isSmallScreen) this.drawer?.close();
  }

  adminLogout() {
    this.authService.logout();
    this.router.navigateByUrl("/")
  }

  get navigationLinks(): NavigationLink[]{
    return [
      new NavigationLink("Stations", "place", "stations"),
      new NavigationLink("Categories", "category", "categories"),
      new NavigationLink("Models", "bike_scooter", "models"),
      new NavigationLink("Bikes", "pedal_bike", "bikes"),
    ]
  }

}
