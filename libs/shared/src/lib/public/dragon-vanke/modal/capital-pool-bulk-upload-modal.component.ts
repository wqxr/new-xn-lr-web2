import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ModalComponent, ModalSize } from '../../../common/modal/ng2-bs3-modal';
import { XnService } from '../../../services/xn.service';
import { XnFormUtils } from '../../../common/xn-form-utils';
import { ContractCreateType, SelectRange } from '../../../common/dragon-vanke/emus';

/**
 *  资产池批量上传
 */
@Component({
    templateUrl: './capital-pool-bulk-upload-modal.component.html'
})
export class CapitalPoolBulkUploadModalComponent implements OnInit {
    public form1: FormGroup;
    public form2: FormGroup;
    @ViewChild('modal')
    modal: ModalComponent;
    private observer: any;
    public shows1: any;
    public shows2: any;
    private selectItem: any;
    public formModule = 'dragon-input';

    public constructor(private xn: XnService) {
    }

    open(params: any): Observable<string> {
        this.shows1 = [
            {
                checkerId: 'scope',
                name: 'scope',
                required: true,
                type: 'radio',
                title: '上传范围',
                selectOptions: [
                    {
                        value: SelectRange.All,
                        label: '当前筛选条件下的所有交易'
                    },
                    {
                        value: SelectRange.Select,
                        label: '勾选交易'
                    }
                ]
            },
            {
                checkerId: 'content',
                name: 'content',
                required: true,
                type: 'radio',
                title: '上传内容',
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
                    // {
                    //     value: ContractCreateType.CodeFactoringPayConfirm,
                    //     label: '《付款确认书（总部致保理商）》'
                    // },
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
        this.shows2 = [
            {
                title: '文件',
                checkerId: 'fileList',
                type: 'mfile',
                options: {
                    filename: '企业回传文件',
                    fileext: 'jpg, jpeg, png, pdf',
                    picSize: '500'
                }
            }
        ];

        // 根据 this.shows 中 selectOptions 配置
        this.selectItem = {
            深圳市龙光控股有限公司: [
                ContractCreateType.CodeReceipt2,
                ContractCreateType.CodeBrokerPayConfirm,
                ContractCreateType.CodeFactoringPayConfirm
            ],
        };

        this.shows1[1].selectOptions
            .filter(x => !this.selectItem[params].includes(x.value))
            .forEach((v) => v.disable = true);

        this.form1 = XnFormUtils.buildFormGroup(this.shows1);
        XnFormUtils.buildSelectOptions(this.shows2);
        this.buildChecker(this.shows2);
        this.form2 = XnFormUtils.buildFormGroup(this.shows2);
        this.modal.open(ModalSize.Large);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    public ngOnInit() {
    }

    public onSubmit() {
        this.close(Object.assign(this.form1.value, this.form2.value));
    }

    public onCancel() {
        this.close('');
    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }
}
