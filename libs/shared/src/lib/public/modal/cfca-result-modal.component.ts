import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'nz-demo-modal-basic',
  template: `
  <nz-modal [(nzVisible)]="isVisible" [nzWidth]="460"  nzClosable=true [(nzTitle)]="title" [(nzOkText)]='okButton' [(nzCancelText)]='cancelButton' (nzOnCancel)="handleCancel()" (nzOnOk)="handleOk()">
  <div style='text-align: center'>
  <p *ngIf="img!==''"><img [src]='img'/></p>
  <p *ngIf="info!==''" class='infostyle'><span><img [src]='alertimg'>&nbsp;{{info}}</span></p>
  <p  *ngIf="reason!==''" class='textstyle'><span>{{reason}}</span></p>
  <p class='textstyle'><span>{{text}}</span></p>
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
      }
      .infostyle{
        font-family: PingFangSC-Regular;
        font-size: 18px;
        color: #1F2B38;
        letter-spacing: 0.39px;
      }
      .textstyle{
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #798088;
      }
      ::ng-deep .ant-btn{
        width: 120px;
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

      ::ng-deep .ant-modal-title{
        margin: 0;
       color: rgba(0,0,0,.85);
       font-weight: 500;
       font-size: 14px;
       line-height: 22px;
       word-wrap: break-word;
      }
      ::ng-deep .ant-modal-body{
        padding:18px;
      }
      ::ng-deep .ant-modal-close-x{
           padding-top: 15px;
      }
  `]
})
export class NzDemoModalBasicComponent {
  isVisible = false;
  private observer: any;
  title: '';
  img: '';
  info: '';
  text: '';
  okButton: '';
  cancelButton: '';
  reason: '';
  alertimg: '';
  constructor() { }

  showModal(): void {
    this.isVisible = true;
  }
  open(params: any): Observable<any> {
    this.isVisible = true;
    this.title = params.title || '';
    this.img = params.img || '';
    this.info = params.info || '';
    this.text = params.text || '';
    this.alertimg = params.alertimg || '';
    this.reason = params.reason;
    this.okButton = params.okButton;
    this.cancelButton = params.cancelButton;
    return Observable.create(observer => {
      this.observer = observer;
    });
  }

  handleOk(): void {
    this.isVisible = false;
    this.close({ action: 'ok' });
  }

  private close(value) {
    this.isVisible = false;
    this.observer.next(value);
    this.observer.complete();
  }

  handleCancel(): void {
    this.isVisible = false;
    this.close({ action: 'no' });
  }
}
