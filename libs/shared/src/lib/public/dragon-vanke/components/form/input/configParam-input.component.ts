import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../form/xn-input.options';

declare const moment: any;

/**
 *  ABS二期-提醒管理-提醒配置参数项
 * 
 */
@Component({
    selector: 'config-param-input',
    templateUrl: './configParam-input.component.html',
    styles: []
})
@DynamicForm({ type: 'config-params-input', formModule: 'dragon-input' })
export class ConfigParamsInputComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    public readonly: boolean = false;
    public paramConfig: any[] = [];
    /* 自定义组件配置。若不设置，则使用默认配置 */
    public options: any = {
        format: 'yyyy-mm-dd',
        startDate: new Date(), // 开始时间
    };

    public constructor(private er: ElementRef, private cdr: ChangeDetectorRef) {
    }

    public ngOnInit() {
        this.readonly = this.row.options.readonly;
        this.ctrl = this.form.get(this.row.name);
        this.ctrl.valueChanges.subscribe(() => {
            this.cdr.markForCheck();
        });

        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
        this.paramConfig = $.extend(true, [], this.row.selectOptions || []); // 深拷贝; 
    }

    /**
     *  输入参数
     * @param e
     * @param 
     */
    public inputChange(e: any, i: number) {
        const ok = /^\d*$/.test(e); // 限制数字
        if (Number(e) > 30 || Number(e) < 1 || !ok) {
            this.row.selectOptions[i]['alert'] = '请输入1~30之间的数字'
            const paramConfig = this.row.selectOptions.map((v:any) => { return { value: Number(v.value), name: v.name } })
            this.ctrl.setValue(paramConfig)
            return
        } else {
            this.row.selectOptions[i]['alert'] = '';
            delete this.row.selectOptions[i]['alert'];
            const paramConfig = this.row.selectOptions.map((v:any) => { return { value: Number(v.value), name: v.name } })
            this.toValue(paramConfig)
        }
    }

    /**
     *  选择时间参数
     * @param value 时间
     * @param index 参数项下标
     */
    public selectedDate(value: any, index: number) {
        this.paramConfig[index]['value'] = moment(value.format()).valueOf(); // 获取时间戳
        const ok = this.judgeTime(this.paramConfig); // 判断时间
        if (!ok) {
            this.row.selectOptions[index]['alert'] = '前一项时间参数应 晚于 后一项时间参数'
        } else {
            this.row.selectOptions.forEach(x => x.alert = undefined)
            this.row.selectOptions[index]['alert'] = ''
            delete this.row.selectOptions[index]['alert']
        }
        this.paramConfig.forEach(x => { x.value = moment(x.value).valueOf() })
        console.log(this.paramConfig);
        console.log(this.row.selectOptions);
        
        const paramConfig = this.paramConfig.map((v:any) => { return { value: Number(v.value), name: v.name } })
        this.toValue(paramConfig)
    }

    /**
     *  判断时间参数是否满足要求
     * @param paramConfig 时间参数数组
     * 前一项时间参数应 晚于 后一项时间参数
     */
    public judgeTime(paramConfig: any[]) {
        const timeList = paramConfig.map(x => {
            return moment(x.value).valueOf()
        });
        let ok = true;
        timeList.forEach((v, i) => {
            if (i < timeList.length - 1 && timeList[i] < timeList[i + 1]) {
                ok = false
            }
        });
        return ok
    }

    private toValue(value) {
        this.ctrl.setValue(JSON.stringify(value))
    }
}
