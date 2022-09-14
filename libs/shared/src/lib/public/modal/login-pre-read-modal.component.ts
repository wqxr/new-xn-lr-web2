import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalComponent, ModalSize } from '../../common/modal/components/modal';
import { XnService } from '../../services/xn.service';
import { XnModalUtils } from '../../common/xn-modal-utils';
import { ViewPdfModalComponent } from './view-pdf.modal.component';
import { FileViewModalComponent } from './file-view-modal.component';

@Component({
  selector: 'login-pre-read',
  template: `
    <nz-modal [(nzVisible)]="isVisible" [nzWidth]="460"  [nzMaskClosable]='false'  [nzOkDisabled]="isAllread()"  nzClosable=false  [(nzOkText)]='okButton' [(nzCancelText)]='cancelButton' (nzOnCancel)="handleCancel()" (nzOnOk)="handleOk()">
    <div class="form-group" class='textstyle'>
    <p class='infostyle'>欢迎您登录链融平台，请阅读以下内容</p>
    <div>
      <label class='labelCss'>
        <input type="checkbox" [checked]="checkboxs[0]" (click)="onCheckBox(1, $event)">
        已同意并阅读 <a class="xn-click-a" href="javaScript:void(0)" (click)="onRead(1)">《链融平台参与方服务协议》</a></label>
    </div>
    <div>
      <label class='labelCss'>
        <input type="checkbox" [checked]="checkboxs[1]" (click)="onCheckBox(2, $event)">
        已同意并阅读 <a class="xn-click-a" href="javaScript:void(0)" (click)="onRead(2)">
          《链融平台隐私权政策协议》</a>
      </label>
    </div>
  </div>
    </nz-modal>
`,
  styles: [
    `
      ::ng-deep .ant-modal-footer{
        padding: 10px 16px;
        text-align: center;
        background: 0 0;
        border-top: 0px solid #f0f0f0;
        border-radius: 0 0 2px 2px;
        padding-bottom: 30px;
      }
      ::ng-deep .ant-modal-body{
        padding-top: 70px;
        font-size: 14px;
        line-height: 1.5715;
        word-wrap: break-word;
      }
      .infostyle{
        font-size: 18px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #1F2B38;
        line-height: 25px;
        margin-bottom:20px;
      }
      .textstyle{
        width: 320px;
        margin-top: 70px;
        margin: auto auto;
    }
      }
      ::ng-deep .ant-btn{
        width: 100px;
        height: 34px;
      }
      ::ng-deep .ant-btn-primary{
        color: #fff;
        background-color: #1890ff;
        border-color: #1890ff;
        text-shadow: 0 -1px 0 rgba(0,0,0,.12);
        box-shadow: 0 2px 0 rgba(0,0,0,.045);
      }
      ::ng-deep .ant-modal-footer{
        padding: 0px 16px;
        text-align: center;
        background: 0 0;
        border-top: 0px solid #f0f0f0;
        border-radius: 0 0 2px 2px;
        padding-bottom: 30px;
      }
      ::ng-deep .ant-modal-content{
        position: relative;
        background-color: #fff;
        background-clip: padding-box;
        border: 0;
        border-radius: 2px;
        pointer-events: auto;
        height: 269px;
      }

  `]
})
export class CfcaLoginPreReadComponent {
  isVisible = false;
  private observer: any;
  okButton: '';
  cancelButton: null;
  checkboxs: boolean[] = [false, false];
  isRead: boolean[] = [false, false];
  isallRead = true;
  constructor(private xn: XnService, private vcr: ViewContainerRef,) { }

  showModal(): void {
    this.isVisible = true;
  }
  open(params: any): Observable<any> {
    this.isVisible = true;
    this.okButton = params.okButton;
    this.cancelButton = null;
    return Observable.create(observer => {
      this.observer = observer;
    });
  }

  handleOk(): void {
    this.isVisible = false;
    this.xn.api.post('/user/read_protocol', {}).subscribe(x => {
      if (x.ret === 0) {
        this.close({ action: 'ok' });
      }
    });
  }
  isAllread() {
    return this.isRead.indexOf(false) > -1 ? true : false;
  }
  onCheckBox(index, event) {
    this.onRead(index, event);
  }
  onRead(index, event?) {
    let urls, titles;
    switch (index) {
      case 1:
        titles = '链融平台参与方服务协议';
        // urls = '/assets/lr/doc/cfca-mode/链融平台参与方服务协议.pdf';
        break;
      case 2:
        titles = '链融平台隐私权政策协议';
        // urls = `/assets/lr/doc/cfca-mode/链融平台隐私权政策协议.pdf`;
        break;
    }
    this.xn.api.post('/user/get_protocol_file', { type: textTypeEnum[titles] }).subscribe(res => {
      if (res.ret === 0) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, ViewPdfModalComponent,
          { titles: titles, data: res.data }).subscribe(x => {
            if (x && x.action === 'ok') {
              this.isRead[index - 1] = true;
              this.checkboxs[index - 1] = true;
              if (event) {
                event.target.checked = true;
              }
            } else {
              this.isRead[index - 1] = false;
              this.checkboxs[index - 1] = false;
              if (event) {
                event.target.checked = false;
              }
            }
          });
      }
    })
  }

  private close(value) {
    this.isVisible = false;
    this.observer.next(value);
    this.observer.complete();
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
enum textTypeEnum {
  '链融平台参与方服务协议' = 'service',
  '链融平台隐私权政策协议' = 'privacy'
}
