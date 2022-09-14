import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';
import {XnService} from '../../services/xn.service';
import {FormGroup} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';

/**
 *  资产池批量上传
 */
@Component({
    templateUrl: './bulk-upload-modal.component.html'
})
export class BulkUploadModalComponent implements OnInit {
    public form1: FormGroup;
    public form2: FormGroup;
    @ViewChild('modal')
    modal: ModalComponent;
    private observer: any;
    public shows1: any;
    public shows2: any;
    private selectItem: any;

    public constructor(private xn: XnService) {
    }

    open(params: any): Observable<string> {
        this.shows1 = [
            {
                checkerId: 'uploadRange',
                name: 'uploadRange',
                required: true,
                type: 'radio',
                title: '上传范围',
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
                checkerId: 'uploadType',
                name: 'uploadType',
                required: true,
                type: 'radio',
                title: '上传内容',
                selectOptions: [
                    {
                        value: 'photoCopy01',
                        label: '《总部公司回执（二次转让）》影印件'
                    },
                    {
                        value: 'photoCopy02',
                        label: '《项目公司回执（二次转让）》影印件'
                    },
                    {
                        value: 'photoCopy03',
                        label: '《总部公司回执（一次转让）》影印件'
                    },
                    {
                        value: 'photoCopy04',
                        label: '《项目公司回执（一次转让）》影印件'
                    },
                    {
                        value: 'photoCopy05',
                        label: '《付款确认书（总部致保理商）》影印件'
                    },
                    {
                        value: 'photoCopy06',
                        label: '《付款确认书（项目公司致供应商）》影印件'
                    },
                    {
                        value: 'photoCopy07',
                        label: '《付款确认书（总部致券商）》影印件'
                    },
                    {
                        value: 'photoCopy05',
                        label: '《付款确认书（总部致供应商）》影印件'
                    },
                    {
                        value: 'confirmPic',
                        label: '《确认函》影印件'
                    },
                ]
            }
        ];
        this.shows2 = [
            {
                title: '文件',
                checkerId: 'file',
                type: 'mfile',
                options: {
                    filename: '企业回传文件',
                    fileext: 'jpg, jpeg, png',
                    picSize: '500'
                }
            }
        ];
        // 根据 this.shows 中 selectOptions 的顺序，从0开始,包含即disable
        this.selectItem = {
            万科: [0, 2, 3, 4, 5, 6, 7],
            '金地（集团）股份有限公司': [0, 1, 2, 3, 4, 5, 6, 7],
            雅居乐地产控股有限公司: [1, 3, 4, 5, 6],
            深圳市龙光控股有限公司: [0, 1, 2, 3, 5, 7],
        };
        this.selectItem[params].forEach(c => {
            this.shows1[1].selectOptions = this.shows1[1].selectOptions.map((v, i) => {
                if (i === c) {
                    v.disable = true;
                }
                return v;
            });
        });
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
