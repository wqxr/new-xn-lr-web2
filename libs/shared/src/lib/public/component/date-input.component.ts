import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, OnChanges } from '@angular/core';

declare let $: any;
import * as moment from 'moment';

/**
 *  日期输入组件
 */
@Component({
    selector: 'app-public-date-input-component',
    template: `
        <div class="form-group has-feedback" style="margin: 0">
            <input type="text" #activityBeginTime (input)="dateInput()" class="form-control">
            <span class="glyphicon glyphicon-calendar fa fa-calendar form-control-feedback" aria-hidden="true"></span>
        </div>
    `,
    styles: [``]
})
export class DateInputDayComponent implements OnInit, OnChanges {
    //
    @ViewChild('activityBeginTime') activityBeginTime: ElementRef;
    @Output() public dateOutput = new EventEmitter<InputModel>();
    @Input() public dataValue: InputModel = new InputModel();

    public constructor() {
    }

    public ngOnInit() {
        setTimeout(() => {
            this.initDate();
            this.initTime();
        });
    }
    // 点重置时清除数据
    public clearDate() {
        this.activityBeginTime.nativeElement.value = '';
        this.dataValue.index = 0;
    }
    public ngOnChanges() {
        // setTimeout(() => {
        //     this.initDate();
        //     this.initTime();
        // });
    }

    public handleEdit() {
        this.dateOutput.emit({ value: $(this.activityBeginTime.nativeElement).val(), index: this.dataValue.index });
    }

    public initTime(e?) {
        if (!!e) {
            this.dataValue = e;
        }
        const start = moment().startOf('day').format('YYYY-MM-DD');
        if (!this.dataValue.value && this.dataValue.value !== undefined) {
            $(this.activityBeginTime.nativeElement).val(this.dataValue.value);
        } else {
            $(this.activityBeginTime.nativeElement).val(start);
        }
        // 如果选择默认日期，防止父组件接受不到默认日期，发送一次默认日期的值
        this.handleEdit();
    }

    public initDate() {
        $(this.activityBeginTime.nativeElement).daterangepicker({
            startDate: moment().subtract(0, 'days'),

            showDropdowns: false,
            showWeekNumbers: false,
            // timePicker: true,
            timePickerIncrement: 1,
            singleDatePicker: true,
            timePicker24Hour: true,
            autoUpdateInput: false,
            drops: 'down',
            locale: {
                customRangeLabel: '自定义日期',
                applyLabel: '确定',
                cancelLabel: '取消',
                fromLabel: '从',
                toLabel: '到',
                format: 'YYYY-MM-DD',
                weekLabel: '周',
                daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
            },
            opens: 'left',
            buttonClasses: ['btn btn-default'],
            applyClass: 'btn-small btn-primary',
            cancelClass: 'btn-small',
            format: 'YYYY-MM-DD',
        }, (start, end, label) => {
            $(this.activityBeginTime.nativeElement).val(start.format('YYYY-MM-DD'));
            this.handleEdit();
        });
    }

    public dateInput() {
        this.handleEdit();
    }
}

export class InputModel {
    public value?: string;
    public index?: number;
}
