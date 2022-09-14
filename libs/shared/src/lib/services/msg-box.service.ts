import { Injectable } from '@angular/core';
import { isArray } from 'util';

declare let $: any;

@Injectable({ providedIn: 'root' })
export class MsgBoxService {
  private dom: any;
  private shown = false;

  private isYesNo: boolean;
  private msg: string | string[];
  private yesOkCallback: () => any;
  private noCallback: () => any;
  private cancelBtn = '取消';
  private submitBtn = '确定';

  constructor() {
    // 构造model
    this.dom = {} as any;
    this.dom.content = $(
      `<div class="modal" style="z-index: 10600;">
              <div class="modal-dialog" style="position: absolute; top: 50%;">
                <div class="modal-content">
                  <div class="modal-body xn-msgbox-msg" style="position: relative;min-height: 100px;max-height:400px;overflow: auto;">
                    <span></span>
                  </div>
                  <div class="modal-footer">
                    <button class="btn btn-default xn-btn-no">${this.cancelBtn}</button>
                    <button class="btn btn-primary xn-btn-yes">${this.submitBtn}</button>
                  </div>
                </div>
              </div>
            </div>`
    );

    $(this.dom.content).on('click', 'button.xn-btn-yes', (e) => {
      e.preventDefault();
      this.close();
      this.onYes();
    });

    $(this.dom.content).on('click', 'button.xn-btn-no', (e) => {
      e.preventDefault();
      this.close();
      this.onNo();
    });
  }

  open(
    isYesNo: boolean,
    msg: string | string[],
    yesOkCallback?: () => any,
    noCallback?: () => any,
    btn?: any[]
  ): void {
    if (this.shown && !isArray(msg)) {
      // console.log(`msgbox already shown, so return`);
      return;
    }

    this.isYesNo = isYesNo;
    this.msg = msg;
    this.yesOkCallback = yesOkCallback;
    this.noCallback = noCallback;

    if (btn && btn.length) {
      this.cancelBtn = btn[0] ? btn[0] : '取消';
      this.submitBtn = btn[1] ? btn[1] : '确定';
    } else {
      this.cancelBtn = '取消';
      this.submitBtn = '确定';
    }
    this.dom.content.find('button.xn-btn-yes').text(this.submitBtn);
    this.dom.content.find('button.xn-btn-no').text(this.cancelBtn);
    if (isYesNo) {
      this.dom.content.find('button.xn-btn-no').show();
    } else {
      this.dom.content.find('button.xn-btn-no').hide();
    }

    if (isArray(msg)) {
      this.dom.content
        .find('.modal-body span')
        .html((msg as string[]).join('<br>'));
    } else {
      this.dom.content.find('.modal-body span').text(msg);
    }

    this.shown = true;
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
  }

  close(): void {
    if (!this.shown) {
      return;
    }

    $(this.dom.content)
      .one('hidden.bs.modal', (e) => {
        e.preventDefault();
        $(e.target).detach();
      })
      .modal('hide');

    this.shown = false;
  }

  showChangeText(data) {
    $('.xn-msgbox-msg span').text(data);
  }
  pushModal(cb: string[]) {
    const queqe: string[] = cb;
    for (const i of queqe) {
      this.open(false, i);
    }
  }
  protected onYes(): void {
    if (this.yesOkCallback) {
      this.yesOkCallback();
    }
  }

  protected onNo(): void {
    if (this.noCallback) {
      this.noCallback();
    }
  }
}
