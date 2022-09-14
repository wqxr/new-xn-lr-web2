import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ModalComponent, ModalSize } from '../../../common/modal/ng2-bs3-modal';
import { XnService } from '../../../services/xn.service';
import { XnFormUtils } from '../../../common/xn-form-utils';
import { ContractCreateType } from '../../../common/dragon-vanke/emus';

/**
 *  资产池生成合同
 */
@Component({
    templateUrl: './capital-pool-generating-contract-modal.component.html'
})
export class CapitalPoolGeneratingContractModalComponent implements OnInit {
    public form: FormGroup;
    @ViewChild('modal')
    modal: ModalComponent;
    private observer: any;
    public shows: any;
    public formModule = 'dragon-input';
    private selectItem: any;

    public constructor(private xn: XnService) {
    }

    open(params: any): Observable<string> {
        this.shows = [
            {
                checkerId: 'generatingContract',
                name: 'generatingContract',
                required: true,
                type: 'radio',
                title: '合同名称',
                selectOptions: [
                    {
                        value: ContractCreateType.CodeReceipt2,
                        label: '《总部公司回执（二次转让）》'
                    },
                    {
                        value: ContractCreateType.CodeProjectReceipt2,
                        label: '《项目公司回执（二次转让）》'
                    },
                    {
                        value: ContractCreateType.CodeProjectReceipt1,
                        label: '《项目公司回执（一次转让）》'
                    },
                    {
                        value: ContractCreateType.CodeBrokerPayConfirm,
                        label: '《付款确认书（总部致券商）》'
                    },
                    {
                        value: ContractCreateType.CodeFactoringPayConfirm,
                        label: '《付款确认书（总部致保理商）》'
                    },
                    {
                        value: ContractCreateType.CodeNotice2,
                        label: '《致总部公司通知书（二次转让）》'
                    },
                    {
                        value: ContractCreateType.CodeProjectNotice2,
                        label: '《致项目公司通知书（二次转让）》'
                    },
                ]
            }
        ];
        // 根据 this.shows 中 selectOptions 配置
        this.selectItem = {
            深圳市龙光控股有限公司: [
                ContractCreateType.CodeReceipt2,
                ContractCreateType.CodeProjectReceipt2,
                ContractCreateType.CodeProjectReceipt1,
                ContractCreateType.CodeBrokerPayConfirm,
                ContractCreateType.CodeFactoringPayConfirm,
            ],
            龙光工程建设有限公司: [
                ContractCreateType.CodeReceipt2,
                ContractCreateType.CodeProjectReceipt2,
                ContractCreateType.CodeProjectReceipt1,
                ContractCreateType.CodeBrokerPayConfirm,
                ContractCreateType.CodeFactoringPayConfirm,
            ],
        };

        this.shows[0].selectOptions
            .filter(x => !this.selectItem[params].includes(x.value))
            .forEach((v) => v.disable = true);

        this.form = XnFormUtils.buildFormGroup(this.shows);

        this.modal.open(ModalSize.Large);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    public ngOnInit() {
    }

    public onSubmit() {
        this.close(this.form.value);
    }

    public onCancel() {
        this.close('');
    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }
}
