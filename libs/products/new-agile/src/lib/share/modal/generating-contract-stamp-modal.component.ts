import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Observable, of} from 'rxjs';
import { ModalComponent, ModalSize } from 'libs/shared/src/lib/common/modal/ng2-bs3-modal';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';

/**
 *  资产池生成并签署合同
 */
@Component({
    templateUrl: './generating-contract-stamp-modal.component.html'
})
export class GeneratingContractStampModalComponent implements OnInit {
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
                checkerId: 'generatingAndSing',
                name: 'generatingAndSing',
                required: true,
                type: 'radio',
                title: '合同名称',
                selectOptions: [
                    {
                        value: 'capital01',
                        label: '《应收账款转让通知书（适用于保理商向雅居乐控股出具）》'
                    },
                    {
                        value: 'capital02',
                        label: '《应收账款转让通知书（适用于保理商向雅居乐下属公司出具）》'
                    }
                ]
            }
        ];
        // 根据 this.shows 中 selectOptions 的顺序，从0开始,包含即disable
        this.selectItem = {
            雅居乐集团控股有限公司: [],
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
