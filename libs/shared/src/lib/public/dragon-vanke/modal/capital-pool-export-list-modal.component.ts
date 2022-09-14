import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ModalComponent, ModalSize } from '../../../common/modal/ng2-bs3-modal';
import { XnService } from '../../../services/xn.service';
import { XnFormUtils } from '../../../common/xn-form-utils';
import { SelectRange, SelectContent } from '../../../common/dragon-vanke/emus';

/**
 *  资产池导出清单
 */
@Component({
    templateUrl: './capital-pool-export-list-modal.component.html'
})
export class CapitalPoolExportListModalComponent implements OnInit {
    public form: FormGroup;
    @ViewChild('modal')
    modal: ModalComponent;
    private observer: any;
    public shows: any;
    public formModule = 'dragon-input';

    public constructor(private xn: XnService) {
    }

    open(params: any): Observable<string> {
        if (params.capitalType === 1) {
            // let content = params.contentTypeVal || '';
            this.shows = [{
                checkerId: 'scope', name: 'scope', required: true, type: 'radio', title: '导出清单范围',
                selectOptions: [
                    { value: SelectRange.All, label: `当前${params.capitalFlag === 1 ? '拟入池' : '资产池'}所有交易` },
                    { value: SelectRange.Sample, label: '仅抽样业务' },
                    { value: SelectRange.Select, label: '勾选交易' }
                ]
            },
            {
                checkerId: 'contentType', name: 'contentType', required: true, type: 'radio', title: '导出清单内容', selectOptions: [
                    { value: SelectContent.Default, label: '默认' },
                    { value: SelectContent.ReceiveTable, label: ' 应收账款数据录入表' },
                ]
            }
            ];
        } else {
            this.shows = [{
                checkerId: 'scope', name: 'scope', required: true, type: 'radio', title: '导出清单范围',
                selectOptions: [
                    { value: SelectRange.All, label: '当前所有交易' },
                    { value: SelectRange.Select, label: '勾选交易' }
                ]
            }];
        }

        if (!params.hasSelect) {
            // this.shows[0].selectOptions[1].disable = true;
            this.shows.find((obj) => obj.checkerId === 'scope').selectOptions
                .filter((x) => x.value !== SelectRange.All && x.value !== SelectRange.Sample)
                .forEach((v) => v.disable = true);
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
