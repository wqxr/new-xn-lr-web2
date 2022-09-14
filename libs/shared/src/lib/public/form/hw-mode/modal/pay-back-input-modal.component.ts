import {Component, ViewChild} from '@angular/core';
import {Observable, of} from 'rxjs';
import {FormGroup} from '@angular/forms';
import {ModalComponent, ModalSize} from 'libs/shared/src/lib/common/modal/components/modal';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';

/**
 *  保理商确认回款-录入信息
 */
@Component({
    template: `
        <modal #modal [backdrop]="'static'" [keyboard]="false" [animation]="false">
            <form class="form-horizontal" (ngSubmit)="onSubmit()" [formGroup]="mainForm" *ngIf="!!mainForm">
                <modal-header [showClose]="true">
                    <h4 class="modal-title">请输入要收款的合同ID</h4>
                </modal-header>
                <modal-body>
                    <div class="form-group" *ngFor="let row of rows">
                        <div class="col-sm-3 xn-control-label">
                            {{row.title}} <span *ngIf="row.required !== false && row.required !== 0" class="required-label">*</span>
                        </div>
                        <div class="col-sm-6">
                            <xn-input [row]="row" [form]="mainForm"></xn-input>
                        </div>
                    </div>
                </modal-body>
                <modal-footer>
                    <button type="button" class="btn btn-default" (click)="onCancel()">取消</button>
                    <button type="submit" class="btn btn-danger" [disabled]="!mainForm.valid">确定</button>
                </modal-footer>
            </form>
        </modal>

    `,
    styles: []
})
export class PayBackInputModalComponent {

    @ViewChild('modal') modal: ModalComponent;

    private observer: any;
    rows: any[] = [];
    mainForm: FormGroup;

    public constructor(private xn: XnService) {
    }

    open(params?: any): Observable<any> {
        this.rows = [
            {
                title: '交易ID', checkerId: 'mainFlowId', type: 'text',
            },
            // {
            //     title: '预计到期日', checkerId: 'actualPayBackDate', type: 'date'
            // }
        ];

        XnFormUtils.buildSelectOptions(this.rows);
        this.buildChecker(this.rows);
        this.mainForm = XnFormUtils.buildFormGroup(this.rows);
        this.modal.open(ModalSize.Large);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }


    public onCancel() {
        this.close({
            action: 'navigate-back'
        });
    }

    /**
     *  根据供应商和是预计到期日，查询需要回款确认的交易
     */
    public onSubmit() {
        this.xn.api.post('/llz/direct_payment/factoring_payment', this.mainForm.value).subscribe(json => {
            this.close({
                action: 'const-params',
                data: json.data
            });
        });
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    private close(value: any) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }
}
