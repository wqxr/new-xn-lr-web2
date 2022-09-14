import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';
import {FormGroup} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';
import {Observable, of} from 'rxjs';

@Component({
    templateUrl: './contract-new-modal.component.html',
    styles: []
})
export class ContractNewModalComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;

    private observer: any;
    mainForm: FormGroup;
    rows: any[] = [];

    constructor() {
    }

    ngOnInit() {
    }

    open(): Observable<any> {
        this.rows = [
            {
                title: '合同文件图片', checkerId: 'img', type: 'mfile',
                options: {
                    // showWhen: ['fileType', 'img'],
                    filename: '合同文件图片',
                    fileext: 'jpg, jpeg, png',
                    picSize: '500'
                },
                memo: '上传图片'
            },
        ];

        XnFormUtils.buildSelectOptions(this.rows);
        this.buildChecker(this.rows);
        this.mainForm = XnFormUtils.buildFormGroup(this.rows);

        this.modal.open(ModalSize.Large);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }

    onSubmit() {
        const v = this.mainForm.value;
        if (v.fileType === 'pdf') {
            this.close({
                files: [JSON.parse(v.pdf)]
            });
        }
        else {
            this.close({
                files: JSON.parse(v.img)
            });
        }
    }

    onCancel() {
        this.close(null);
    }
}
