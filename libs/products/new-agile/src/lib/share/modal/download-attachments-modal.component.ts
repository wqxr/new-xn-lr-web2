import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable, of} from 'rxjs';
import {FormGroup} from '@angular/forms';
import { ModalComponent, ModalSize } from 'libs/shared/src/lib/common/modal/ng2-bs3-modal';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';

/**
 *  资产池下载附件
 */
@Component({
    templateUrl: './download-attachments-modal.component.html'
})
export class DownloadAttachmentsModalComponent implements OnInit {
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
                        label: '《应收账款转让通知书（适用于保理商向雅居乐控股出具）》'
                    },
                    {
                        value: 'capitalPoolContract02',
                        label: '《应收账款转让通知书（适用于保理商向雅居乐下属公司出具）》'
                    },
                    {
                        value: 'capitalPoolContract03',
                        label: '《应收账款转让通知书回执（适用于雅居乐控股向保理商出具）》'
                    },
                    {
                        value: 'capitalPoolContract04',
                        label: '《应收账款转让通知书回执（适用于雅居乐下属公司向保理商出具）》'
                    },
                    {
                        value: 'headquartersReceipt',
                        label: '《应收账款转让通知书回执（适用于雅居乐控股向供应商出具）》'
                    },
                    {
                        value: 'projectReceipt',
                        label: '《应收账款转让通知书回执（适用于雅居乐下属公司向供应商出具）》'
                    },
                    {
                        value: 'pdfProjectFiles',
                        label: '《付款确认书（总部致保理商）》'
                    },
                    {
                        value: 'projectQrs',
                        label: '《付款确认书（适用于雅居乐下属公司向供应商出具）》'
                    },
                    {
                        value: 'tradersQrs',
                        label: '《付款确认书（雅居乐控股致券商）》'
                    },
                    {
                        value: 'pdfProjectFiles',
                        label: '《付款确认书（适用于雅居乐控股向供应商出具）》'
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
            雅居乐集团控股有限公司: [6, 8, 10],
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
