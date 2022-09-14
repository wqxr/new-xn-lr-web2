import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ModalComponent, ModalSize } from '../../common/modal/components/modal';
import { Observable, of } from 'rxjs';
import { XnService } from '../../services/xn.service';
import { FormGroup } from '@angular/forms';
import { XnFormUtils } from '../../common/xn-form-utils';

@Component({
    templateUrl: './approval-edit-modal.component.html',
    styles: [
        `.panel { margin-bottom: 0 }`,
        `.form-group .input { height: 28px; line-height: normal }`,
        `.button-list { margin-bottom: 10px }`,
        `.editor { height: 300px; border: 1px solid #ddd; border-radius: 5px; overflow-y: scroll}`,
    ]
})
export class ApprovalEditModalComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('editor') editor: ElementRef;
    private observer: any;

    params: any = {} as any;
    steped = 0;
    rows: any[] = [];
    shows: any[] = [];
    mainForm: FormGroup;
    formValid = false;
    title = '';
    content = '';

    constructor(private xn: XnService) {
    }

    ngOnInit() {
    }

    open(params: any): Observable<string> {
        this.params = params;
        this.shows = [];
        const coreValue = {
            label: params.appName,
            value: params.appId
        };

        this.shows = [
            {
                title: '核心企业', checkerId: 'appName', required: true, type: 'picker',
                validators: { insName: true }, options: { ref: 'core' }, value: coreValue
            },
            {
                title: '审核内容', checkerId: 'content', required: true, type: 'text', value: params.content
            },
        ];

        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.mainForm = XnFormUtils.buildFormGroup(this.shows);

        this.mainForm.valueChanges.subscribe((v) => {
            this.formValid = this.mainForm.valid;
        });
        this.modal.open(ModalSize.Large);

        return Observable.create(observer => {
            this.observer = observer;
        });
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

    cssClass(step): string {
        if (step === this.steped) {
            return 'current';
        }
        if (step > this.steped) {
            return 'disabled';
        } else {
            return 'success';
        }
    }

    onOk() {

    }

    onSubmit() {
        if (!this.mainForm.value.appName || this.mainForm.value.appName === '' || this.mainForm.value.content === '') {
            return;
        }
        const params = {} as any;
        params.appId = JSON.parse(this.mainForm.value.appName).value;
        params.appName = JSON.parse(this.mainForm.value.appName).label;
        params.content = this.mainForm.value.content;
        params.id = this.params.id;

        this.postValue(params);
    }

    postValue(params) {
        this.xn.api.post('/tool/condition_upt', params).subscribe(json => {
            // 有变化时，进行更改
            if (this.params.appId !== JSON.parse(this.mainForm.value.appName).value) {
                this.params.appId = JSON.parse(this.mainForm.value.appName).value;
            }
            if (this.params.appName !== JSON.parse(this.mainForm.value.appName).label) {
                this.params.appName = JSON.parse(this.mainForm.value.appName).label;
            }
            if (this.params.content !== this.mainForm.value.content) {
                this.params.content = this.mainForm.value.content;
            }

            this.close(this.params);
        });
    }
}
