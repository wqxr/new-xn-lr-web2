import { Component, ViewChild, OnInit } from '@angular/core';
import { NewComponent } from '../new.component';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { BankFormService } from './bank.form.service';
import {LocalStorageService} from 'libs/shared/src/lib/services/local-storage.service';
import { applyFactoringTtype } from 'libs/shared/src/lib/config/select-options';

@Component({
    selector: 'xn-bank-new',
    templateUrl: './new.component.html'
})
export class BankNewComponent implements OnInit {
    @ViewChild(NewComponent) newComponent: NewComponent;

    constructor(
        private xn: XnService,
        private bankFormService: BankFormService,
        private localStorageService: LocalStorageService
    ) {}

    ngOnInit() {
        // 重写 doSubmit 方法，因为旧的获取不到 readonly 控件的值
        this.newComponent.doSubmit = this.doSubmit.bind(this);
        this.localStorageService.setCacheValue('current_flow', this.newComponent.flowId); // 存储流程
    }

    onAfterBuildFormGroup() {
        // 业务类型
        this.newComponent.mainForm.get('businessType').setValue(
            '向保理商申请保证付款，向银行申请商品融资'
        );

        this.bankFormService.onValueChanges(this.newComponent.mainForm, this.newComponent.rows);
    }

    private doSubmit() {
        const formValue: any = this.newComponent.mainForm.getRawValue();

        this.bankFormService.prepareData(formValue);

        const params: any = {
            flowId: this.newComponent.flowId,
            procedureId: this.newComponent.svrConfig.procedure.procedureId,
            title: formValue.title,
            memo: formValue.memo,
            checkers: XnFlowUtils.buildSubmitCheckers(
                this.newComponent.svrConfig.checkers,
                formValue
            ),
            recordId:
                (this.newComponent.svrConfig.record &&
                    this.newComponent.svrConfig.record.recordId) ||
                '',
            contracts: this.newComponent.svrConfig.contracts
        };

        if (this.newComponent.Relate.flowId !== '') {
            params[
                this.newComponent.Relate.relate
            ] = this.newComponent.Relate.relateValue;
        } else {
            params.toString();
        }

        if (this.newComponent.svrConfig.constParams) {
            params.relatedRecordId =
                this.newComponent.svrConfig.constParams.relatedRecordId || '';
            if (this.newComponent.svrConfig.constParams.checkers) {
                for (const key in this.newComponent.svrConfig.constParams
                    .checkers) {
                    if (
                        this.newComponent.svrConfig.constParams.checkers.hasOwnProperty(
                            key
                        )
                    ) {
                        params.checkers[
                            key
                        ] = this.newComponent.svrConfig.constParams.checkers[
                            key
                        ];
                    }
                }
            }
        }
        // console.log(params);

        // 加上loading
        XnUtils.checkLoading(this.newComponent);
        params.factoringAppId = applyFactoringTtype.深圳市柏霖汇商业保理有限公司;
        this.xn.api
            .post(`/record/record?method=new`, params)
            .subscribe(json => {
                this.xn.router.navigate([
                    `/console/bank/record/${this.newComponent.flowId}`
                ]);
            });
    }

}
