import {Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';
import {Observable, of} from 'rxjs';
import {XnService} from '../../services/xn.service';
import {FormGroup} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';

@Component({
    templateUrl: './plan-edit-modal.component.html',
    styles: [

        `.panel { margin-bottom: 0 }`,
        `.form-group .input { height: 28px; line-height: normal }`,

    ]
})
export class PlanEditModalComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('editor') editor: ElementRef;
    @ViewChild('file') file: ElementRef;
    @ViewChild('KeTextArea') KeTextArea: ElementRef;

    private observer: any;

    params: any = {} as any;
    steped = 0;
    rows: any[] = [];
    shows: any[] = [];
    mainForm: FormGroup;
    formValid = false;
    files: any[];
    articalParams: any = {} as any;
    title = '';
    content = '';
    link: any = {} as any;
    showLink = false;
    showTextArea = false;
    selections: any = {} as any;
    selectedRange: any;
    linkValue = false;
    linkRadio = 'yes';  // 初始化默认为yes
    targetlinkTemp = '';

    constructor(private xn: XnService) {
    }

    ngOnInit() {
    }

    open(params: any): Observable<string> {

        this.params = params;
        this.modal.open(ModalSize.XLarge);

        const factoringValue = {
            label: this.params.appName,
            value: this.params.appId
        };
        // 处理数据
        this.shows = [];

        this.shows = [
            {
                title: '保理商',
                checkerId: 'factoring',
                required: true,
                type: 'picker',
                validators: {insName: true},
                options: {ref: 'factoring'},
                value: this.params.factoring || factoringValue
            },
            {
                title: '保理日期', checkerId: 'factoringBeginDate', required: true, type: 'date', value: this.params.factoringBeginDate
            },
            {
                title: '保理金额',
                checkerId: 'factoringAmount',
                required: true,
                type: 'money',
                memo: '单元（元）',
                validators: {money: true},
                value: this.params.factoringAmount
            },
            {
                title: '保理到期日', checkerId: 'factoringEndDate', required: true, type: 'date', value: this.params.factoringEndDate
            },
            {
                title: '供应商或经销商', checkerId: 'supplierName', required: true, type: 'text', value: this.params.supplierName
            },
            {
                title: '交易类型', checkerId: 'type', required: true, type: 'select', options: {ref: 'type'}, value: this.params.type
            },
            {
                title: '要素', checkerId: 'element', required: true, type: 'select', options: {ref: 'element'}, value: this.params.element
            },
            {
                title: '是否补齐', checkerId: 'complete', required: true, type: 'radio', options: {ref: 'complete'}, value: this.params.complete
            },
            {
                title: '何时提供发票', checkerId: 'invoice', required: true, type: 'select', options: {ref: 'invoice'}, value: this.params.invoice
            },
            {
                title: '描述', checkerId: 'desc', required: true, type: 'text', value: this.params.desc
            },
        ];

        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.mainForm = XnFormUtils.buildFormGroup(this.shows);

        this.mainForm.valueChanges.subscribe((v) => {
            this.formValid = this.mainForm.valid;
        });

        this.formValid = this.mainForm.valid;

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

    cssClass(step): string {
        if (step === this.steped) { return 'current'; }
        if (step > this.steped) { return 'disabled'; }
        else { return 'success'; }
    }

    onOk() {

    }

    onSubmit() {
        const data = $.extend(true, {}, this.mainForm.value); // 深拷贝
        let factoring = this.mainForm.value.factoring;
        if (factoring) {
            factoring = JSON.parse(factoring);
        }
        data.id = this.params.id;
        data.factoringAppId = factoring.value;

        this.xn.api.post('/tool/plan_save', {
            plans: [data]
        }).subscribe(json => {

            this.params.factoring = this.mainForm.value.factoring;
            this.params.factoringBeginDate = this.mainForm.value.factoringBeginDate;
            this.params.factoringAmount = this.mainForm.value.factoringAmount;
            this.params.factoringEndDate = this.mainForm.value.factoringEndDate;
            this.params.supplierName = this.mainForm.value.supplierName;
            this.params.type = this.mainForm.value.type;
            this.params.element = this.mainForm.value.element;
            this.params.complete = this.mainForm.value.complete;
            this.params.invoice = this.mainForm.value.invoice;
            this.params.desc = this.mainForm.value.desc;

            this.close(this.params);
        });
    }

}
