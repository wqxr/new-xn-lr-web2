
import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { FileViewModalComponent } from '../../modal/file-view-modal.component';
import { ModalComponent, ModalSize } from '../../../common/modal/components/modal';
import { XnService } from '../../../services/xn.service';
import { XnModalUtils } from '../../../common/xn-modal-utils';
import { DragonPdfSignModalComponent } from '../../dragon-vanke/modal/pdf-sign-modal.component';


@Component({
    template: `
        <modal #modal [backdrop]="'static'" [keyboard]="false" [animation]="false">
            <form class="form-horizontal">
                <modal-header style='text-align:center'>
                    <h4 class="modal-title">变更账号记录</h4>
                </modal-header>
                <modal-body>
                   <div>
                        <ul style='list-style:none;width:70%;margin-left:100px'>
                         <li style='display:flex;margin-bottom:10px'>
                         <span style='width: 53%;text-align: right;margin-right:10px'>交易Id</span>
                         <input type='text' class="form-control xn-input-font xn-input-border-radius" readonly [value]="items.mainFlowId">
                         </li>
                         <li style='display:flex;margin-bottom:10px'>
                         <span style='width: 53%;text-align: right;margin-right:10px'>收款单位户名</span>
                         <input type='text' class="form-control xn-input-font xn-input-border-radius" readonly [value]="items.receiveOrg">
                         </li>
                         <li style='display:flex;margin-bottom:10px'>
                         <span style='width: 53%;text-align: right;margin-right:10px'>收款单位账号</span>
                         <input type='text' class="form-control xn-input-font xn-input-border-radius"
                           readonly [value]="items.receiveAccount">
                         </li>
                         <li style='display:flex;margin-bottom:10px'>
                         <span style='width: 53%;text-align: right;margin-right:10px'>收款单位开户行</span>
                         <input type='text' class="form-control xn-input-font xn-input-border-radius"
                          readonly [value]="items.receiveBank">
                         </li>
                         <li style='display:flex;margin-bottom:10px'>
                         <span style='width: 53%;text-align: right;margin-right:10px'>收款单位开户行行号</span>
                         <input type='text' class="form-control xn-input-font xn-input-border-radius"
                          readonly [value]="items.receiveBankNo">
                         </li>
                         <li style='display:flex;margin-bottom:10px'>
                         <span style='width: 53%;text-align: right;margin-right:10px'>提单收款单位</span>
                         <input type='text' class="form-control xn-input-font xn-input-border-radius"
                         readonly [value]="items.oldReceiveOrg">
                         </li>
                         <li style='display:flex;margin-bottom:10px'>
                         <span style='width: 53%;text-align: right;margin-right:10px'>提单收款单位账号</span>
                         <input type='text' class="form-control xn-input-font xn-input-border-radius"
                         readonly [value]="items.oldReceiveAccount">
                         </li>
                         <li style='display:flex;margin-bottom:10px'>
                         <span style='width: 53%;text-align: right;margin-right:10px'>提单收款单位开户行</span>
                         <input type='text' class="form-control xn-input-font xn-input-border-radius"
                          readonly [value]="items.oldReceiveBank">
                         </li>
                         <li style='display:flex;margin-bottom:10px'>
                         <span style='width: 53%;text-align: right;margin-right:10px'>供应商收款账号变更说明文件</span>
                         <div style='width: 100%;
                         border: 0.5px solid #ccc;
                         line-height: 30px;height:30px'>
                         <ng-container *ngIf='!!items.contracts && items.contracts!==undefined&& items.contracts!==null'>
                         <span *ngFor="let sub of items.contracts | xnJson; let i=index">
                         <a href="javaScript:void(0)" (click)="showContract(sub,1)">{{sub.label}}</a>
                         </span>
                         </ng-container>
                       </div>
                         </li>
                         <li style='display:flex;margin-bottom:10px'>
                         <span style='width: 53%;text-align: right;margin-right:10px'>项目公司更正函</span>
                         <div style='width: 100%;
                         border: 0.5px solid #ccc;
                         line-height: 30px;height:30px'>
                         <ng-container *ngIf='!!items.correctFile && items.correctFile!==undefined && items.correctFile!==null'>
                         <span  *ngFor="let sub of items.correctFile | xnJson; let i=index">
                         <a href="javaScript:void(0)" (click)="showContract(sub,2)">{{sub.fileName}}</a>
                       </span>
                       </ng-container>
                       </div>
                         </li>
                        </ul>
                   </div>
                </modal-body>
                <modal-footer>
                <button type="button" class="btn btn-success" (click)="onOk()">确定</button>
              </modal-footer>
            </form>
        </modal>
    `
})
export class AvengerChangeAccountComponent {

    @ViewChild('modal') modal: ModalComponent;
    private observer: any;
    public mainForm: FormGroup;
    public items = {
        mainFlowId: '',
        receiveOrg: '',
        receiveAccount: '',
        receiveBank: '',
        receiveBankNo: '',
        oldReceiveOrg: '',
        oldReceiveAccount: '',
        oldReceiveBank: '',
        contracts: '',
        correctFile: '',
    };
    constructor(private xn: XnService,
        private vcr: ViewContainerRef,
    ) {
    }
    open(params: any): Observable<any> {
        this.items = params;
        this.modal.open(ModalSize.Large);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }
    /**
        *  查看文件
        * @param paramFile
        */
    public showContract(paramFile: any, type: number): void {
        if (type === 1) {
            const params = Object.assign({}, paramFile, { readonly: true });
            XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonPdfSignModalComponent, params).subscribe();
        } else {
            const params = Object.assign({}, paramFile, { isAvenger: true });
            XnModalUtils.openInViewContainer(this.xn, this.vcr, FileViewModalComponent, params).subscribe(() => {
            });
        }
    }
    onOk() {
        this.modal.close();
    }
}
