import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';
import {XnService} from '../../services/xn.service';
import {FormGroup} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';

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
                required: false,
                type: 'radio',
                title: '合同名称',
                selectOptions: [
                    {
                        value: 'capital01',
                        label: '《致总部公司通知书（二次转让）》'
                    },
                    {
                        value: 'capital02',
                        label: '《致项目公司通知书（二次转让）》'
                    },
                ]
            }
        ];
        // 根据 this.shows 中 selectOptions 的顺序，从0开始,包含即disable
        this.selectItem = {
            '万科': [],
            '金地（集团）股份有限公司': [],
            '雅居乐地产控股有限公司': [],
            '深圳市龙光控股有限公司': [0],
        };
        if (params === '金地（集团）股份有限公司') {
            let gemdale = {
                checkerId: 'gemdaleAndSing',
                name: 'gemdaleAndSing',
                required: false,
                type: 'radio',
                title: '金地国寿合同名称',
                selectOptions: [
                    {
                        value: 'capital13',
                        label: '《应收账款转让通知书（保理商出给项目公司）》'
                    },
                ]
            };
            this.shows[0].title = '金地ABS合同名称';
            this.shows.push(gemdale);
        }
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
