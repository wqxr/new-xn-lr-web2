import { Injectable } from '@angular/core';
import { isNullOrUndefined } from 'util';

declare let $: any;

/**
 *  百分比loading
 */
@Injectable({ providedIn: 'root' })
export class LoadingPercentService {
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
        <div class="loading" style=" position: fixed; z-index: 1100; top: 50%; left: 50%; transform: translateX(-50%);">
            <div class="progress" style="width: 300px;border-radius: 8px;border: none;padding: 0">
              <div class="progress-bar active progress-bar-striped" role="progressbar"
                aria-valuemin="0" aria-valuemax="100" style="border-radius: 8px;text-align: center;color: #272727">
              </div>
            </div>
        </div>
      </div>`
    );
  }

  open(total: number, index: number): void {
    const num = total ? (((index + 1) / total) * 100).toFixed(0) : 0;
    if (this.shown) {
      $(this.dom.content)
        .find('div.progress-bar')
        .html(`<b>${total ? index + 1 : 0}/${total ? total : 0}</b>`)
        .css('width', `${total ? num : 5}%`);
      return;
    }

    this.shown = true;

    const content = this.dom.content;
    $(this.dom.content).appendTo('body');
    $(this.dom.content)
      .find('div.progress-bar')
      .html(`<b>${total ? index + 1 : 0}/${total ? total : 0}</b>`)
      .css('width', `${total ? num : 5}%`);
    $(this.dom.content)
      .find('div.overlay')
      .stop(true)
      .animate('opacity: 0', 200);
    $(this.dom.content).find('div.overlay').show();
    $(this.dom.content).find('div.loading').show();
  }

  close(): void {
    if (!this.shown) {
      return;
    }

    $(this.dom.content)
      .find('div.overlay')
      .stop(true)
      .animate('opacity: 1', 200);
    $(this.dom.content).find('div.overlay').hide();
    $(this.dom.content).find('div.loading').hide();

    this.shown = false;
    if (!isNullOrUndefined(this.closeCallback)) {
      this.closeCallback();
    }
  }
}
