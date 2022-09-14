import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';
import {XnService} from '../../services/xn.service';
import {FormGroup} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';

/**
 *  资产池下载附件
 */
@Component({
    templateUrl: './download-attachments-modal.component.html'
})
export class DownloadAttachmentsmodalComponent implements OnInit {
    public params: any;
    public form: FormGroup;
    @ViewChild('modal')
    modal: ModalComponent;
    private observer: any;
    public shows: any;
    private selectItem: any;

    public constructor(private xn: XnService) {
    }

    open(params: any): Observable<string> {
        this.params = params;
        this.shows = [
            {
                checkerId: 'downloadRange',
                name: 'downloadRange',
                required: true,
                type: 'radio',
                title: '下载范围',
                selectOptions: [
                    {
                        value: 'all',
                        label: '当前筛选条件下的所有交易'
                    },
                    {
                        value: 'selected',
                        label: '勾选交易'
                    }
                ]
            },
            {
                checkerId: 'chooseFile',
                name: 'chooseFile',
                required: true,
                type: 'checkbox',
                title: '下载内容',
                selectOptions: [
                    {
                        value: 'capitalPoolContract01',
                        label: '《致总部公司通知书（二次转让）》'
                    },
                    {
                        value: 'capitalPoolContract02',
                        label: '《致项目公司通知书（二次转让）》'
                    },
                    {
                        value: 'capitalPoolContract03',
                        label: '《总部公司回执（二次转让）》'
                    },
                    {
                        value: 'capitalPoolContract04',
                        label: '《项目公司回执（二次转让）》'
                    },
                    {
                        value: 'headquartersReceipt',
                        label: '《总部公司回执（一次转让）》'
                    },
                    {
                        value: 'projectReceipt',
                        label: '《项目公司回执（一次转让）》'
                    },
                    {
                        value: 'pdfProjectFiles',
                        label: '《付款确认书（总部致保理商）》'
                    },
                    {
                        value: 'projectQrs',
                        label: '《付款确认书（项目公司致供应商）》'
                    },
                    {
                        value: 'tradersQrs',
                        label: '《付款确认书（总部致券商）》'
                    },
                    {
                        value: 'pdfProjectFiles',
                        label: '《付款确认书（总部致供应商）》'
                    },
                    {
                        value: 'confirmFile',
                        label: '《确认函》'
                    }
                ]
            }
        ];
        // 是否有勾选列表中某行
        if (!params.hasSelect) {
            this.shows[0].selectOptions[1].disable = true;
        }
        // 根据 this.shows 中 selectOptions 的顺序，从0开始,包含即disable
        this.selectItem = {
            万科: [2, 4, 5, 7, 8, 9], // 0 1 3 6
            '金地（集团）股份有限公司': [2, 4, 5, 7, 8, 9, 10],
            雅居乐地产控股有限公司: [6, 8, 10],
            深圳市龙光控股有限公司: [0, 2, 4, 7, 9, 10],
            notConsiderCompany: [0, 2, 4, 6, 8, 9, 10] // 1 3 5 7
        };
        this.selectItem[params.selectedCompany].forEach(c => {
            this.shows[1].selectOptions = this.shows[1].selectOptions.map((v, i) => {
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
