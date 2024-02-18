import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BikeStationRating } from '../service/bikeStation.service';

import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import DOMPurify from 'dompurify';
import { format } from 'date-fns';

@Component({
  selector: 'app-rating-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './rating-card.component.html',
  styleUrl: './rating-card.component.scss'
})
export class RatingCardComponent {
  @Input() rating!: BikeStationRating;
  @ViewChild("commentContainer") commentContainer!: ElementRef;
  showMore: boolean = false;
  hasMoreComment: boolean = false;

  constructor(
    private changeDetector: ChangeDetectorRef,
  ){}

  ngAfterViewInit() {
    const nativeElement: HTMLDivElement = this.commentContainer.nativeElement;
    if (nativeElement !== undefined) {
      const checkCommentContainer = () => {
        const clientHeight: number = nativeElement.clientHeight;
        const scrollHeight: number = nativeElement.scrollHeight;
        this.hasMoreComment = clientHeight < scrollHeight;
        this.changeDetector.detectChanges();
      }

      const observer: MutationObserver = new MutationObserver(checkCommentContainer);
      observer.observe(nativeElement, {
        attributes: true,
        characterData: true,
      });

      checkCommentContainer();
    }
  }

  toggleComment(): void {
    this.showMore = !this.showMore;
    this.changeDetector.detectChanges();
  }

  get sanitizedComment(): string{
    return DOMPurify.sanitize(this.rating.comment, { ALLOWED_TAGS: ['#text'] });
  }

  get createdAt(): string {
    return format(new Date(this.rating.createdAt), "dd.MM.yyyy HH:mm");
  }

  get hasMoreBtnText(): string {
    return ` Show ${this.showMore ? 'less' : 'more' }`
  }
}
