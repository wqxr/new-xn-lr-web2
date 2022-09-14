import {XnModalUtils} from '../../common/xn-modal-utils';
import {Component, OnInit, Input, ElementRef, ViewContainerRef} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';
import {XnUtils} from '../../common/xn-utils';
import {XnInputOptions} from './xn-input.options';
import {XnService} from '../../services/xn.service';
import {PdfSignModalComponent} from '../modal/pdf-sign-modal.component';

@Component({
    selector: 'xn-fixedfile1-input',
    templateUrl: './fixedfile1-input.component.html',
    styles: []
})
export class Fixedfile1InputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;

    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    items: any[];

    constructor(private er: ElementRef, private xn: XnService, private vcr: ViewContainerRef) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.fromValue();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    showContract(id: string, secret: string, label: string) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, PdfSignModalComponent, {
            id,
            secret,
            label,
            readonly: true
        }).subscribe(() => {
        });
    }

    private fromValue() {
        this.items = XnUtils.parseObject(this.ctrl.value, []);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}
