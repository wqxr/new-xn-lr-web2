import {Component, OnInit, Input, OnChanges, SimpleChanges, AfterContentChecked, ElementRef, ViewContainerRef} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnInputOptions} from './xn-input.options';
import {XnService} from '../../services/xn.service';

@Component({
    selector: 'xn-number-input',
    templateUrl: './number-input.component.html',
    styles: [
        `.file-row-table { margin-bottom: 0}`,
        `.file-row-table td { padding: 6px; border-color: #d2d6de; font-size: 12px; }`,
        `.file-row-table th { font-weight: normal; border-color: #d2d6de; border-bottom-width: 1px; line-height: 100%; font-size: 12px;}`,
        `.table-bordered {border-color: #d2d6de; }`,
        `.table > thead > tr > th { padding-top: 7px; padding-bottom: 7px; }`
    ]
})
export class NumberInputComponent implements OnInit, OnChanges, AfterContentChecked {

    @Input() row: any;
    @Input() form: FormGroup;

    items: any[];
    mode: string;

    alert = '';
    ctrl: AbstractControl;
    numberChange: AbstractControl;
    supplierChange: AbstractControl;
    xnOptions: XnInputOptions;
    ctrlValue: any;
    ctrlValueTemp: any;

    constructor(private xn: XnService,
                private er: ElementRef,
                private vcr: ViewContainerRef) {
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log('OnChanges');
    }

    ngOnInit() {
        // this.mode = this.row.options.mode || 'upload';
        this.ctrl = this.form.get(this.row.name);
        this.ctrlValueTemp = this.ctrl.value;
        if (this.ctrl.value !== '') {
            const ctrlValue = JSON.parse(this.ctrl.value);
            console.log('ctrlValueInit: ', ctrlValue);
            this.items = ctrlValue;
        }

        // this.fromValue();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    ngAfterContentChecked() {
        this.ctrl = this.form.get(this.row.name);

        if (this.ctrl.value === '') {
            return;
        }
        if (this.ctrlValueTemp === this.ctrl.value) {
            return;
        }
        this.ctrlValueTemp = this.ctrl.value;
        const ctrlValue = JSON.parse(this.ctrl.value);
        console.log('ctrlValueChecked: ', ctrlValue);
        this.items = ctrlValue;
    }

}
