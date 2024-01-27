import { Component, Input, Output, EventEmitter } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoadingOverlayComponent } from '../../common/loading-overlay/loading-overlay.component';

@Component({
  selector: 'app-admin-table',
  standalone: true,
  imports: [
    LoadingOverlayComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './admin-table.component.html',
  styleUrl: './admin-table.component.scss'
})
export class AdminTableComponent {
  @Input("loading") runningAction: boolean = false;
  @Output() reload: EventEmitter<boolean> = new EventEmitter();

}
