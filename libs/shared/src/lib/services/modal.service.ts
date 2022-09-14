import { Injectable } from '@angular/core';
import { isNullOrUndefined } from 'util';

declare let $: any;

@Injectable({ providedIn: 'root' })
export class ModalService {
  private dom: any;
  private shown = false;
  private closeCallback: any;

  constructor() {
    // 构造model
    this.dom = {} as any;
    this.dom.content = $(
      `<div class="modal">
              <div class="modal-dialog modal-lg" style="position: relative; top: 50%;">
                <div class="modal-content">
                  <div class="modal-header">
                    <span class="modal-title"></span>
                    <button class="close">&times;</button>
                  </div>
                  <div class="modal-body" style="position: relative;"></div>
                  <div class="modal-footer"></div>
                </div>
              </div>
            </div>`
    );

    $(document).on('click', 'div.modal', (e) => {
      if ($(e.target).hasClass('modal') && this.shown) {
        this.close();
      }
    });
  }

  open(title: string, body: any, closeCallback: any): void {
    if (this.shown) {
      // console.log(`modal already shown, so return`);
      return;
    }

    this.shown = true;
    this.closeCallback = closeCallback;

    const content = this.dom.content.find('div.modal-body');
    content.children().detach();
    content.append(body);

    $(this.dom.content)
      .one('shown.bs.modal', () => {
        // console.log(`one shown.bs.modal`);
      })
      .one('hidden', () => {
        // console.log(`one hidden`);
        this.shown = false;
      })
      .appendTo('body')
      .modal({
        backdrop: 'static',
        keyboard: false,
      });

    this.dom.content.find('span.modal-title').text(title);

    // 事件监听 - close按钮
    $(this.dom.content).one('click', 'button.close', (e) => {
      e.preventDefault();
      this.close();
    });
  }

  close(): void {
    if (!this.shown) {
      return;
    }

    $(this.dom.content)
      .one('hidden.bs.modal', (e) => {
        // console.log(`one hidden.bs.modal`);
        e.preventDefault();
        $(e.target).detach();
      })
      .modal('hide');

    this.shown = false;
    if (!isNullOrUndefined(this.closeCallback)) {
      this.closeCallback();
    }
  }

  getModal(): any {
    return this.dom.content;
  }
}
