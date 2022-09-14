import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DynamicForm } from '../../dynamic.decorators';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';

@Component({
    templateUrl: '../input/text-input.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
        `.inMemo {
            padding: 5px 0px;
            color: #f20000
        }`
    ]
})
@DynamicForm({ type: 'number-control', formModule: 'default-input' })
export class NumerControlInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    @ViewChild('input', { static: true }) input: ElementRef;
    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    inMemo = '';

    get readonly(){
      return this.row?.options?.readonly ? true : false;
    }
    constructor(private er: ElementRef, private xn: XnService, private localStorageService: LocalStorageService) {
    }

    ngOnInit() {
        if (!this.row.placeholder) {
            this.row.placeholder = '';
        }
        this.inMemo = !!this.row.options && this.row.options !== '' && this.row.options.inMemo || '';
        this.ctrl = this.form.get(this.row.name);
        this.ctrl.valueChanges.subscribe(x => {
            if (this.input?.nativeElement?.value){
                this.input.nativeElement.value = XnUtils.formatMoney(x);
            }
            this.calcAlertClass();
        });
        this.calcAlertClass();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    onBlur(event: any): void {
        this.calcAlertClass();
    }
    calcAlertClass(): void {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    /**
     * 占位符
     * @returns
     */
     placeholderText(): string {
      return this.readonly ? '' : this.row?.placeholder || this.row.options?.placeholder || '请输入';
    }

    /**
     * 输入框border样式
     * @returns
     */
    borderStyle(): string {
      if(this.readonly){
        return this.row?.value ? 'solid' : 'dashed';
      } else {
        return 'solid';
      }
    }
}
