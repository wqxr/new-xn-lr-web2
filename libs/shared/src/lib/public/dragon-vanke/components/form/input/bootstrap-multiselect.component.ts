import { ChangeDetectionStrategy, Component, OnInit, ElementRef, Input, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnFormUtils } from '../../../../../common/xn-form-utils';
import { SelectOptions } from '../../../../../config/select-options';
import { XnInputOptions } from '../../../../../public/form/xn-input.options';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnService } from '../../../../../services/xn.service';
declare var $: any;

@Component({
    selector: 'bootstrap-multiselect-component',
    templateUrl: './bootstrap-multiselect.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
    `]
})
@DynamicForm({ type: 'multiselect', formModule: 'default-input' })
export class BootstrapMultiselectInputComponent implements OnInit, AfterViewInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @ViewChild('selectMultiRef') selectMultiRef: ElementRef;

    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    reg: RegExp = /[\"\']/g;
    xnOptions: XnInputOptions;

    constructor(private xn: XnService, private er: ElementRef, private cdr: ChangeDetectorRef,
    ) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.calcAlertClass();
        this.ctrl.valueChanges.subscribe(v => {
            this.cdr.markForCheck();
            this.calcAlertClass();
        });
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    ngAfterViewInit(): void {

        $(this.selectMultiRef.nativeElement).multiselect({
            dataprovider: this.row.selectOptions,
            nonSelectedText: '请选择',
            // enableClickableOptGroups: true,  //分组可选
            // enableCollapsibleOptGroups: true,  //可折叠
            // includeSelectAllOption: true, //可全选
            allSelectedText: '全选', // 全选文本
            nSelectedText: '个已选中', // 超过numberDisplayed限制显示文本
            dropRight: true,  // 右侧显示下拉选项
            numberDisplayed: 5,   // 可展示已选择option的数量（numberDisplayed）
            maxHeight: 250,  // 下拉最大高度
            // buttonClass: 'btn btn-default',  //按钮样式
            buttonWidth: 203, // 按钮宽度
            onChange: (option, checked, select) => {
                const selectedItems = $(this.selectMultiRef.nativeElement).val() || [];
                const selectArr = selectedItems.filter((x: string) => !!x).map((str: string) => {
                    return str.includes(':') ? str.split(':')[1].trim().replace(this.reg, '') : str.trim();
                });
                this.ctrl.setValue(selectArr);
            }
        });
        $(this.selectMultiRef.nativeElement).multiselect('dataprovider', this.row.selectOptions);
        if (!!this.row.value){
            $(this.selectMultiRef.nativeElement).multiselect('select', this.row.value);
        }
        $(this.selectMultiRef.nativeElement).multiselect('refresh');
    }

    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}
