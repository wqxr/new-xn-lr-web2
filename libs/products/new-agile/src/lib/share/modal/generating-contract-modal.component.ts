import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable, of} from 'rxjs';
import {FormGroup} from '@angular/forms';
import { ModalComponent, ModalSize } from 'libs/shared/src/lib/common/modal/ng2-bs3-modal';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';

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
                        label: '《应收账款转让通知书回执（适用于雅居乐下属公司向保理商出具）》'
                    },
                    {
                        value: 'capital04',
                        label: '《应收账款转让通知书回执（适用于雅居乐控股向保理商出具）》'
                    },
                    {
                        value: 'headquarters_receipt',
                        label: '《应收账款转让通知书回执（适用于雅居乐控股向供应商出具）》'
                    },
                    {
                        value: 'project_receipt',
                        label: '《应收账款转让通知书回执（适用于雅居乐下属公司向供应商出具）》'
                    },
                    {
                        value: 'headquarters_qrs',
                        label: '《付款确认书（总部致保理商）》'
                    },
                    {
                        value: 'project_qrs',
                        label: '《付款确认书（适用于雅居乐下属公司向供应商出具）》'
                    },
                    {
                        value: 'traders_qrs',
                        label: '《付款确认书（雅居乐控股致券商）》'
                    },
                    {
                        value: 'headquarters_qrs',
                        label: '《付款确认书（适用于雅居乐控股向供应商出具）》'
                    },
                    {
                        value: 'confirm_file',
                        label: '《确认函》'
                    }
                ]
            }
        ];
        // 根据 this.shows 中 selectOptions 的顺序，从0开始,包含即disable
        this.selectItem = {
            雅居乐集团控股有限公司: [4, 6 , 8], // 0 1 2 3 5 7
        };
        this.selectItem[params].forEach(c => {
            this.shows[0].selectOptions = this.shows[0].selectOptions.map((v, i) => {
                if (i === c) {
                    v.disable = true;
                }
                return v;
            });
        });
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
