import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';

@Component({
    selector: 'avenger-rate-info',
    templateUrl: './avenger-rate-info.html',
    styles: [
        `

       .readonlystyle {
           background:#eee;

       }
            `

    ]
})
@DynamicForm({ type: 'rate', formModule: 'avenger-input' })
export class AvengerRateInfoComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @ViewChild('input', { static: true }) input: ElementRef;
    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    inMemo = '';
    datalist: any[] = [];
    twodatalist: any[] = [];
    alldatalist: any[] = [];

    constructor(private er: ElementRef) {
    }

    ngOnInit() {
        this.datalist = JSON.parse(this.row.value);
        this.twodatalist = this.datalist.splice(0, 3);
        this.ctrl = this.form.get(this.row.name);
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }
}
