
/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\account-system\src\lib\shared\directives\scroll-event.directive.ts
* @summary：监听滚动条触底自定义指令
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                HuCongying           init           2021-11-27
***************************************************************************/
import { Directive, HostListener, Output, EventEmitter, Input } from '@angular/core';

export type ScrollEvent = {
  isReachingBottom: boolean,
  isReachingTop: boolean,
  originalEvent: Event,
  isWindowEvent: boolean
};

declare const window: Window;

@Directive({
  selector: '[xn-scroll]'
})
export class XnScrollEventDirective {
  @Output() public onscroll = new EventEmitter<ScrollEvent>();
  @Input() public bottomOffset = 10;
  @Input() public topOffset = 10;

  constructor() { }

  // handle host scroll
  @HostListener('scroll', ['$event']) public scrolled($event: Event): void {
    this.elementScrollEvent($event);
  }

  // handle window scroll
  @HostListener('window:scroll', ['$event']) public windowScrolled($event: Event): void {
    this.windowScrollEvent($event);
  }

  protected windowScrollEvent($event: Event): void {
    const target = $event.target as Document;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const isReachingTop = scrollTop < this.topOffset;
    const isReachingBottom = ( target.body.offsetHeight - (window.innerHeight + scrollTop) ) < this.bottomOffset;
    const emitValue: ScrollEvent = {isReachingBottom, isReachingTop, originalEvent: $event, isWindowEvent: true};
    this.onscroll.emit(emitValue);
  }

  protected elementScrollEvent($event: Event): void {
    const target = $event.target as HTMLElement;
    const scrollPosition = target.scrollHeight - target.scrollTop;
    const offsetHeight = target.offsetHeight;
    const isReachingTop = target.scrollTop < this.topOffset;
    const isReachingBottom = (scrollPosition - offsetHeight) < this.bottomOffset;
    const emitValue: ScrollEvent = {isReachingBottom, isReachingTop, originalEvent: $event, isWindowEvent: false};
    this.onscroll.emit(emitValue);
  }

}
