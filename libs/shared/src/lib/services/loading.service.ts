import { Injectable, ViewChild, ElementRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { isNullOrUndefined } from 'util';

declare let $: any;

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private dom: any;
  private shown = false;
  private closeCallback: any;
  constructor() {
    // 构造model
    this.dom = {} as any;
    this.dom.content = $(
      `<div class="loadingbox">
          <div class="overlay" style="position:fixed;top:0;right:0;bottom:0;left:0;
          z-index:1100;width:100%;height:100%;_padding:0 20px 0 0;background: rgba(0, 0, 0, 0.5);"></div>
          <div class="loading" style="filter:alpha(opacity=0); position: fixed;
          z-index: 1100; top: 50%; left: 50%; transform: translateX(-50%);
            color: #37a; background: #fff; border: 1px solid #8CBEDA; padding: 3px; border-radius: 7px;">
              <div class="word" style="border:2px solid #D6E7F2; padding: 10px; border-radius: 5px;">
                  <img src="assets/lr/img/loading.gif"> 加载中，请稍候...
              </div>
          </div>
      </div>`
    );
  }

  open(): void {
    if (this.shown) {
      // console.log(`modal already shown, so return`);
      return;
    }
    this.shown = true;
    const content = $(this.dom.content);
    content.appendTo('body');
    content.find('div.overlay').stop(true).animate('opacity: 0', 200);
    content
      .find('div.loading')
      .stop(true)
      .animate({ 'margin-top': '-30px', opacity: '0.7' }, 200);
    content.find('div.overlay').show();
    content.find('div.loading').show();
  }

  close(): void {
    if (!this.shown) {
      return;
    }

    $(this.dom.content)
      .find('div.overlay')
      .stop(true)
      .animate('opacity: 1', 200);
    $(this.dom.content)
      .find('div.loading')
      .stop(true)
      .animate({ 'margin-top': '-60px', opacity: '0' }, 400);
    $(this.dom.content).find('div.overlay').hide();
    $(this.dom.content).find('div.loading').hide();

    this.shown = false;
    if (!isNullOrUndefined(this.closeCallback)) {
      this.closeCallback();
    }
  }

  checkLoading(): Observable<boolean> {
    if (this.shown === true) {
      return of(true);
    } else {
      return of(false);
    }
  }

  getModal(): any {
    return this.dom.content;
  }
}
