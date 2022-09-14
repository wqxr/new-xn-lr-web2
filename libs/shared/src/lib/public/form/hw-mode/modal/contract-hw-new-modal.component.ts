import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalComponent, ModalSize} from 'libs/shared/src/lib/common/modal/components/modal';
import {FormGroup} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';

@Component({
    selector: 'app-contract-hw-new',
    template: `
        <modal #modal [backdrop]="'static'" [keyboard]="false" [animation]="false">
            <form class="form-horizontal" (ngSubmit)="onSubmit()" [formGroup]="mainForm" *ngIf="!!mainForm">
                <modal-header [showClose]="false">
                    <h4 class="modal-title">新增合同</h4>
                </modal-header>
                <modal-body>
                    <div class="form-group" *ngFor="let row of rows">
                        <div class="col-sm-3 xn-control-label">
                            {{row.title}} <span *ngIf="row.required !== false && row.required !== 0" class="required-label">*</span>
                        </div>
                        <div class="col-sm-6">
                            <xn-input [row]="row" [form]="mainForm"></xn-input>
                        </div>
                        <div class="col-sm-3 xn-control-desc">
                            {{row.memo}}
                        </div>
                    </div>
                </modal-body>
                <modal-footer>
                    <button type="button" class="btn btn-default" (click)="onCancel()">取消</button>
                    <button type="submit" class="btn btn-success" [disabled]="!mainForm.valid">提交</button>
                </modal-footer>
            </form>
        </modal>


    `
})
export class ContractHwNewModalComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;

    private observer: any;
    mainForm: FormGroup;
    rows: any[] = [];
    public contractType = '';

    public constructor() {
    }

    public ngOnInit() {
    }

    open(params?: any): Observable<any> {
        this.rows = [
            {
                title: '合同编号', checkerId: 'contractNum', type: 'text'
            },
            {
                title: '合同金额', checkerId: 'contractAmount', type: 'money', value: 0
            }, {
                title: '合同文件图片', checkerId: 'img', type: 'mfile',
                options: {
                    // showWhen: ['fileType', 'img'],
                    filename: '合同文件图片',
                    fileext: 'jpg, jpeg, png',
                    picSize: '500'
                }
            },
            {
                title: '合同类型',
                checkerId: 'contractType',
                type: 'select',
                flowId: 'financing10',
                required: true,
                options: {ref: 'hwContractType'},
                value: this.contractType
            },
        ];
        if (!!params && params.edit) {
            console.log('这是编辑页', params);
            this.rows.find((x: any) => x.checkerId === 'contractNum').value = params.data.files.contractNum;
            this.rows.find((x: any) => x.checkerId === 'contractAmount').value = params.data.files.contractAmount;
            this.rows.find((x: any) => x.checkerId === 'img').value = params.data.files.img;
            this.rows.find((x: any) => x.checkerId === 'contractType').value = params.data.files.contractType;
        }
        XnFormUtils.buildSelectOptions(this.rows);
        this.buildChecker(this.rows);
        this.mainForm = XnFormUtils.buildFormGroup(this.rows);

        this.modal.open(ModalSize.Large);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    public onSubmit() {
        const v = this.mainForm.value;
        this.close(v);
    }

    public onCancel() {
        this.close(null);
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }

}
