import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, Event, EventType } from '@angular/router';

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
import { TicketService } from '../service/tickets.service';
import { Ticket, TicketStatus } from '../model/ticket';
import { isBefore } from 'date-fns';
import { DialogService } from '../service/dialog.service';

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
    new NavigationLink("Bike Search", "pedal_bike", "/user/bikes"),
    new NavigationLink("Tickets", "confirmation_number", "/user/tickets"),
  ];

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private ticketService: TicketService,
    private dialogService: DialogService,
  ) {
    this.breakpointObserver.observe(Breakpoints.XSmall).subscribe(result => {
      this.isMobile = result.matches;
      if(!this.isMobile) this.drawer?.close();
    })

    this.router.events.subscribe((event: Event) => {
      if(event.type === EventType.NavigationEnd){
        const index: number = this.navigationLinks.findIndex(tab => this.router.url.startsWith(tab.route));
        if (index > -1) {
          this.activeLinkIndex = index;
        }
      }
    })
  }
  
  ngOnInit(): void {
    this.activeLinkIndex = this.navigationLinks.findIndex(tab => this.router.url.startsWith(tab.route));
    this.getOverdueTickets();
  }

  navigate(index: number): void {
    if(index === this.activeLinkIndex) return;
    const link: NavigationLink = this.navigationLinks[index];
    this.router.navigateByUrl(link.route);
    if(this.isMobile) this.drawer?.close();
  }

  getOverdueTickets(): void {
    const userId: string | null = this.authService.getLoggedInUserId();
    if(userId === null) return;
    this.ticketService.getUserTickets(userId).subscribe({
      next: (tickets: Ticket[]) => {
        const hasOverdueTickets: boolean = tickets.some(({untilDate, status }) => {
          return status === TicketStatus.RENTED && isBefore(new Date(untilDate), Date.now());
        })

        if(hasOverdueTickets) this.displayOverdueTicketWarning();
      }
    })
  }

  displayOverdueTicketWarning(){
    this.dialogService.openOverdueTicketWarningDialog();
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
