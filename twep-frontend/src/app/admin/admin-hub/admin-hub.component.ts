import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterOutlet } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

import { NavigationLink } from '../../model/navigationLink';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-admin-hub',
  standalone: true,
  imports: [MatToolbarModule, MatSidenavModule, MatListModule, MatIconModule, CommonModule, MatDividerModule, MatButtonModule, RouterOutlet],
  templateUrl: './admin-hub.component.html',
  styleUrl: './admin-hub.component.scss'
})
  
export class AdminHubComponent {
  activeLink?: NavigationLink | null;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {
    
  }

  ngOnInit() {
    const url: string = this.router.url;
    const route: string = url.replace("/admin/", "");
    this.activeLink = this.navigationLinks.find(navlink => navlink?.route === route) ?? null;

    if (this.activeLink === null) {
      const link: NavigationLink = new NavigationLink("Dashboard", "dashboard", "dashboard");
      this.openLink(link);
    }
  }

  openLink(link: NavigationLink) {
    this.router.navigate([`admin/${link.route}`]);
    this.activeLink = link;
  }

  adminLogout() {
    this.authService.logout();
    this.router.navigate(["/"])
  }

  get navigationLinks(): (NavigationLink | null)[]{
    return [
      new NavigationLink("Dashboard", "dashboard", "dashboard"),
      null,
      new NavigationLink("Stations", "place", "stations"),
      new NavigationLink("Categories", "category", "categories"),
      new NavigationLink("Bikes", "pedal_bike", "bikes"),
    ]
  }

  get breadcrumb(): string {
    return `Administration > ${this.activeLink?.title}`;
  }

}
