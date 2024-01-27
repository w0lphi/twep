import { Component, Input } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';

import { LoadingOverlayComponent } from '../../common/loading-overlay/loading-overlay.component';


@Component({
  selector: 'app-admin-table',
  standalone: true,
  imports: [
    LoadingOverlayComponent,
    MatToolbarModule
  ],
  templateUrl: './admin-table.component.html',
  styleUrl: './admin-table.component.scss'
})
export class AdminTableComponent {

  @Input("loading") runningAction: boolean = false;

}
