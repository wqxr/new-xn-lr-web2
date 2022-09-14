import {Component, OnInit, Input, ElementRef, ViewChild} from '@angular/core';
import {FormGroup, AbstractControl, FormControl} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';
import {XnUtils} from '../../common/xn-utils';
import {isNullOrUndefined} from 'util';
import {XnInputOptions} from './xn-input.options';
import {CalendarData} from '../../config/calendar';

@Component({
    selector: 'xn-end-input',
    templateUrl: './end-input.component.html',
    styles: [
        `.xn-holiday-alert { color: #8d4bbb; font-size: 12px; }`,
        `.not-invalid {border-color: #e15f63;}`,
    ]
})
export class EndInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @ViewChild('factoringEndInput', { static: true }) factoringEndInput: ElementRef;

    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    factoringEndAlert = '';
    holidayAlert = '';

    constructor(private er: ElementRef) {
    }

    ngOnInit() {
        if (!this.row.placeholder) {
            this.row.placeholder = '';
        }

        this.ctrl = this.form.get(this.row.name);

        this.calcAlertClass();

        this.ctrl.valueChanges.subscribe(v => {
            this.getDay(this.ctrl.value);
            this.calcAlertClass();
        });

        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    onBlur(): void {
        this.calcAlertClass();
    }

    getDay(date) {
        const data = {} as any;
        data.factoringDate = date;
        const controller = XnUtils.computeDay(data, CalendarData);
        if (controller.factoringDateTemp === true) {
            this.factoringEndAlert = '';
            this.holidayAlert = controller.holidayAlert;
            $(this.factoringEndInput.nativeElement).removeClass('not-invalid');
        }
        else if (controller.factoringDateTemp === false) {
            this.holidayAlert = '';
            this.factoringEndAlert = controller.factoringEndAlert;
            $(this.factoringEndInput.nativeElement).addClass('not-invalid');
        }
    }

    calcAlertClass(): void {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

}
