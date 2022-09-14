import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';
import {XnService} from '../../services/xn.service';
import {FormGroup} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';

/**
 *  资产池生成合同
 */
@Component({
    templateUrl: './generating-contract-modal.component.html'
})
export class GeneratingContractModalComponent implements OnInit {
    public form: FormGroup;
    @ViewChild('modal')
    modal: ModalComponent;
    private observer: any;
    public shows: any;
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
                        value: 'capital03',
                        label: '《项目公司回执（二次转让）》'
                    },
                    {
                        value: 'capital04',
                        label: '《总部公司回执（二次转让）》'
                    },
                    {
                        value: 'headquarters_receipt',
                        label: '《总部公司回执（一次转让）》'
                    },
                    {
                        value: 'project_receipt',
                        label: '《项目公司回执（一次转让）》'
                    },
                    {
                        value: 'headquarters_qrs',
                        label: '《付款确认书（总部致保理商）》'
                    },
                    {
                        value: 'project_qrs',
                        label: '《付款确认书（项目公司致供应商）》'
                    },
                    {
                        value: 'traders_qrs',
                        label: '《付款确认书（总部致券商）》'
                    },
                    {
                        value: 'headquarters_qrs',
                        label: '《付款确认书（总部致供应商）》'
                    },
                    {
                        value: 'confirm_file',
                        label: '《确认函》'
                    },
                    {
                        value: 'second_jd_01',
                        label: '《应收账款转让通知书（适用于保理商出具项目公司）》'
                    },
                    {
                        value: 'second_jd_02',
                        label: '《应收账款转让通知书（适用于保理商出具集团）》'
                    },
                    {
                        value: 'second_jd_03',
                        label: '《东亚银行再保理买方确认函》'
                    },
                    {
                        value: 'second_jd_04',
                        label: '《发票清单-东亚再保理》'
                    },
                    {
                        value: 'second_jd_05',
                        label: '《应收账款债权转让申请书》'
                    },
                    {
                        value: 'second_jd_06',
                        label: '《应收账款转让登记协议》'
                    },
                    {
                        value: 'second_jd_07',
                        label: '《再保理融资申请书》'
                    },
                    {
                        value: 'second_jd_08',
                        label: '支付委托书'
                    },
                ]
            }
        ];
        // 根据 this.shows 中 selectOptions 的顺序，从0开始,包含即disable
        this.selectItem = {
            '万科': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], // 0 8
            '金地（集团）股份有限公司': [0, 1, 2, 3, 4, 5, 6, 7, 8], // 0
            '雅居乐地产控股有限公司': [4, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16], // 0 1 2 3 5 7
            '深圳市龙光控股有限公司': [1, 2, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], // 0 3 4 6
        };
        this.selectItem[params].forEach(c => {
            this.shows[0].selectOptions = this.shows[0].selectOptions.map((v, i) => {
                if (i === c) {
                    v.disable = true;
                }
                return v;
            });
        });
        if (params === '金地（集团）股份有限公司') {
            this.shows[0].selectOptions = this.shows[0].selectOptions.filter(x => !x.disable);
            this.shows[0].title = '东亚再保理合同';
        } else {
            this.shows[0].title = '合同名称';
        }

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
