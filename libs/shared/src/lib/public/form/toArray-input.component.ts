import {Component, OnInit, Input, ElementRef, ViewContainerRef} from '@angular/core';
import {XnService} from '../../services/xn.service';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';
import {XnInputOptions} from './xn-input.options';
import {XnUtils} from '../../common/xn-utils';
import {setTimeout} from 'core-js/library/web/timers';

declare let $: any;

@Component({
    selector: 'xn-toArray-input',
    templateUrl: './toArray-input.component.html',
    styles: [
            `
            .border {
                border: 1px solid #ccc;
            }

            /*.border + .border {*/
                /*border-left: none;*/
            /*}*/

            /*.border-b {*/
                /*border-bottom: 1px dashed #ccc;*/
            /*}*/

            .inMemo {
                padding: 5px 0px;
                color: #f20000
            }`
    ]
})
export class ToArrayInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    public items: any[] = [];
    public mode: string;

    public alert = '';
    // 总数
    public amountAll = 0;
    public unfill = false;
    private ctrl: AbstractControl;
    private xnOptions: XnInputOptions;
    public inMemo = '';

    constructor(private xn: XnService,
                private er: ElementRef,
                private vcr: ViewContainerRef) {
    }

    public ngOnInit() {
        this.ctrl = this.form.get(this.row.name);

        this.inMemo = this.row.options !== '' && this.row.options.inMemo || '';

        this.fromValue();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    private fromValue() {
        this.items = XnUtils.parseObject(this.ctrl.value, []);

        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }


}
