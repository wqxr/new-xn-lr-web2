
import { Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ModalComponent, ModalSize } from '../../../common/modal/components/modal';


@Component({
  template: `
    <modal #modal [backdrop]="'static'" [keyboard]="false" [animation]="false" (onDismiss)="onOk()">
    <modal-header [showClose]="true" style='text-align:center'>
      <h4 class="modal-title" style='height:5px'>付确信息比对结果</h4>
    </modal-header>

    <modal-body>
      <div class="form-group" style='margin-bottom:20px;padding: 10px 10px;
      margin-right: 140px;' >
        <div class="col-sm-4 xn-control-label">
          交易ID
        </div>
        <div class="col-sm-8">
          <input type='text' class="form-control xn-input-font xn-input-border-radius" readonly [value]="items.mainFlowId || ''">
        </div>
      </div>
      <div class="form-group" style='margin-bottom:20px;padding: 10px 10px;
      margin-right: 140px;' >
        <div class="col-sm-4 xn-control-label">
          应收账款金额
        </div>
        <div class="col-sm-8">
          <input type='text' class="form-control xn-input-font xn-input-border-radius" readonly [value]='items.receivable  | xnMoney'>
        </div>
      </div>
        <div class="form-group" style='margin-bottom:20px;padding:10px 10px;
        margin-right: 140px;' >
        <div class="col-sm-4 xn-control-label">
          起息日
        </div>
        <div class="col-sm-8" *ngIf="items.valueDate">
          <input type='text' class="form-control xn-input-font xn-input-border-radius" readonly [value]="items.valueDate | xnDate:'date'">
        </div>
        <div class="col-sm-8" *ngIf="!items.valueDate">
          <input type='text' class="form-control xn-input-font xn-input-border-radius" readonly>
        </div>
        </div>
        <div class="form-group" style='margin-bottom:20px;padding: 10px 10px;
        margin-right: 140px;' >
        <div class="col-sm-4 xn-control-label">
          保理融资到期日
        </div>
        <div class="col-sm-8">
          <input type='text' class="form-control xn-input-font xn-input-border-radius"
           readonly [value]="items.factoringEndDate|xnDate:'date'">
        </div>
        </div>
        <div class="form-group" style='margin-bottom:20px;padding: 10px 10px;
        margin-right: 140px;' >
        <div class="col-sm-4 xn-control-label">
          付确匹配方式
        </div>
        <div class="col-sm-8">
          <input type='text' class="form-control xn-input-font xn-input-border-radius"
          readonly [value]="items.qrsMatchMethod | xnSelectTransform:'CompareStatus'">
        </div>
        </div>
      <div style="padding:20px 60px">
        <table class="table table-bordered text-center">
          <thead>
            <tr>
              <th>项目</th>
              <th>业务信息</th>
              <th>付确ocr信息</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>付款确认书编号</td>
              <td>{{items.payConfirmId}}</td>
              <td></td>

            </tr>
            <tr>
              <td>供应商名称</td>
              <td>{{items.debtUnitName}}</td>
              <td></td>

            </tr>
            <tr>
              <td>供应商银行账号</td>
              <td>{{items.debtUnitAccount}}</td>
              <td></td>

            </tr>
            <tr>
              <td>供应商银行账号开户行</td>
              <td>{{items.debtUnitBank}}</td>
              <td></td>

            </tr>
            <tr>
              <td>应收账款金额</td>
              <td>{{items.receivable | xnMoney}}</td>
              <td></td>

            </tr>
            <tr>
              <td>应收账款到期日</td>
              <td>{{items.factoringEndDate | xnDate:'date'}}</td>
              <td></td>

            </tr>
          </tbody>
        </table>
      </div>
    </modal-body>
    <modal-footer>
      <button type="button" class="btn btn-success" (click)="onOk()">确定</button>
    </modal-footer>
  </modal>

    `
})
export class AvengerResultCompareComponent {

  @ViewChild('modal') modal: ModalComponent;
  private observer: any;
  public mainForm: FormGroup;
  public items = {
    mainFlowId: '',
    receivable: '',
    valueDate: '',
    factoringEndDate: '',
    qrsMatchMethod: '',
    payConfirmId: '',
    debtUnitName: '',
    debtUnitAccount: '',
    debtUnitBank: '',
  };

  open(params: any): Observable<any> {
    this.items = params[0];
    this.modal.open(ModalSize.Large);
    return Observable.create(observer => {
      this.observer = observer;
    });
  }

  onOk() {
    this.modal.close();
  }
}
