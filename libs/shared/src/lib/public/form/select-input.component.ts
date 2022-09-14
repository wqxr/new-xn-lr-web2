import { ChangeDetectionStrategy, Component, OnInit, ElementRef, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnFormUtils } from '../../common/xn-form-utils';
import { XnInputOptions } from './xn-input.options';
import { PublicCommunicateService } from '../../services/public-communicate.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
    selector: 'xn-select-input',
    templateUrl: './select-input.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,

})
export class SelectInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;

    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;

    constructor(private er: ElementRef,
        private publicCommunicateService: PublicCommunicateService,
        private localStorageService: LocalStorageService) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.calcAlertClass();
        this.ctrl.valueChanges.subscribe(v => {
            this.ctrl.markAsTouched();
            this.calcAlertClass();
            // 改变状态
            this.publicCommunicateService.change.emit(v);
        });
        // 为万科保理审核总部公司
        if ((this.row.checkerId === 'headquarters' && this.row.flowId === 'financing_supplier6') ||
            (this.row.checkerId === 'enterprise' && this.row.flowId === 'financing_pre6')
        ) {
            this.localStorageService.caCheMap.set('headquarters', this.ctrl.value);
        }
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    onBlur() {
        this.calcAlertClass();
    }

    private calcAlertClass() {
        // this.localStorageService.setCacheValue('headquarters', v);
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}
