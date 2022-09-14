import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DynamicForm } from '../../dynamic.decorators';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
declare const moment: any;

@Component({
    templateUrl: './text-input.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
        `.inMemo {
            padding: 5px 0px;
            color: #f20000
        }`
    ]
})
@DynamicForm({ type: 'text', formModule: 'default-input' })
export class TextInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    public ctrl1: AbstractControl;
    public ctrl2: AbstractControl;
    public ctrl3: AbstractControl;
    @ViewChild('input', { static: true }) input: ElementRef;
    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    inMemo = '';
    dateCheckTemp = false;
    dateAlert: any;
    isShow = false;
    private kprq: any; // 日期格式

    get readonly(){
      return this.row?.options?.readonly ? true : false;
    }

    @ViewChild('dateInput', { static: true }) dateInput: ElementRef;

    constructor(private er: ElementRef, private xn: XnService, private localStorageService: LocalStorageService) {
    }

    ngOnInit() {
        if (!this.row.placeholder) {
            this.row.placeholder = '';
            if (this.row.type === 'text' && this.row.value === 0) {
                this.row.placeholder = 0;
            }
        }

        if (this.row.checkerId === 'registerNum') {
            this.ctrl1 = this.form.get('modifiedCode');
            this.ctrl2 = this.form.get('checkCertFile');
            this.ctrl3 = this.form.get('registerCertFile');
            if (this.row.options.readonly === false && this.row.value === '') {
                this.isShow = true;
            }
        }
        // if (this.row.checkerId === 'modifiedCode') {
        //         this.ctrl.setValue('1234');
        // }
        this.inMemo = !!this.row.options && this.row.options !== '' && this.row.options.inMemo || '';
        this.ctrl = this.form.get(this.row.name);

        this.calcAlertClass();
        if (this.row.name === 'signTime') {
            if (this.row.value !== '') {
                this.row.value = moment(this.row.value).format('YYYYMMDD');
                this.ctrl.setValue(this.row.value);
            }

        }
        this.ctrl.valueChanges.subscribe(v => {
            if (this.row.name === 'payRate' || this.row.name === 'purchaseRatio') {
                if (isNaN(v) || 0.01 > Number(v) || Number(v) > 100) {
                    this.alert = '请输入0.01-100之间的数字';
                } else {
                    this.alert = '';
                }
            } else {
                this.calcAlertClass();

            }
        });
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    onBlur(event: any): void {

        if (this.row.name === 'payRate' || this.row.name === 'purchaseRatio') {
            if (isNaN(event.target.value) || 0.01 > Number(event.target.value) || Number(event.target.value) > 100) {
                this.alert = '请输入0.01-100之间的数字';
            } else {
                this.alert = '';
            }
        } else if (this.row.flowId === 'sub_cfca_sign_pre' && this.row.checkerId === 'appName') { //通用签章流程获取当前签章方式
            if (this.ctrl.value) {
                this.xn.dragon.post('/cfca/get_cadata_info', { appName: this.ctrl.value }).subscribe(x => {
                    this.form.get('caType').setValue(x.data.type);
                });
            }
        } else {
            this.calcAlertClass();
        }
    }
    onKeyDownEnter(event: any, row: any) {
        console.log('row', row);
        // 回车逗号分割
        if (row?.options?.enter === 'segmentation') {
            const lastIndex = this.ctrl.value.length - 1;
            const lastChar = this.ctrl.value.charAt(lastIndex);
            if (lastChar === ',') {
                return;
            }
            this.ctrl.setValue(this.ctrl.value + ',');
        }

    }
    // 日期输入格式验证
    onDateInput() {
        this.dateCheck(this.ctrl.value);
    }
    getinfo() {
        this.xn.dragon.post('/zhongdeng/zd/getZdFile',
            { registerNum: this.ctrl.value, mainFlowId: this.svrConfig.record.mainFlowId }).subscribe(x => {
                this.ctrl1.setValue(x.data.modifiedCode);
                this.ctrl2.setValue(x.data.checkCertFile);
                this.ctrl3.setValue(x.data.registerCertFile);
                this.localStorageService.setCacheValue('modifiedCode', x.data.modifiedCode);
            });

    }

    dateCheck(date) {
        if (!date) {
            return;
        }
        this.dateCheckTemp = XnUtils.toDateFromString(date);
        if (!this.dateCheckTemp) {
            $(this.dateInput.nativeElement).addClass('not-invalid');
            this.dateAlert = '很抱歉，您需要输入格式为20170731的日期';
        } else {
            $(this.dateInput.nativeElement).removeClass('not-invalid');
            this.dateAlert = '';
            // this.ctrl.setValue()
        }
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
