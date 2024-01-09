import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PageFlip } from 'page-flip';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('bookElement') bookElement!: ElementRef<HTMLDivElement>;

  currentPage: number = 1;
  totalPages: number = 0;
  pageState: string = 'read';
  pageOrientation: string = 'landscape';
  private pageFlipInstance: any;
  isMobile: boolean = false;

  ngAfterViewInit() {
    this.isMobile = window.innerWidth < 768;
    setTimeout(() => {
      this.initializePageFlip();
    }, 100);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkIfMobile();
  }

  checkIfMobile() {
    this.isMobile = window.innerWidth < 768;
    if (this.pageFlipInstance) {
      this.pageFlipInstance.usePortrait = this.isMobile;
    }
  }

  private initializePageFlip() {
    this.pageFlipInstance = new PageFlip(this.bookElement.nativeElement, {
      maxShadowOpacity: 0.5,
      width: 300,
      height: 500,
      showCover: true,
      autoSize: false,
      flippingTime: 1500,
      usePortrait: this.isMobile,
      mobileScrollSupport: true,
    });

    this.pageFlipInstance.loadFromHTML(
      this.bookElement.nativeElement.querySelectorAll('.page')
    );

    this.totalPages = this.pageFlipInstance.getPageCount();
    this.pageOrientation = this.pageFlipInstance.getOrientation();

    this.pageFlipInstance.on('flip', (e: any) => {
      this.currentPage = e.data + 1;
    });

    this.pageFlipInstance.on('changeState', (e: any) => {
      this.pageState = e.data;
    });

    this.pageFlipInstance.on('changeOrientation', (e: any) => {
      this.pageOrientation = e.data;
    });
  }

  flipPrev() {
    if (this.currentPage > 1) {
      this.pageFlipInstance.flipPrev();
    }
  }

  flipNext() {
    if (this.currentPage < this.totalPages) {
      this.pageFlipInstance.flipNext();
    }
  }
}
