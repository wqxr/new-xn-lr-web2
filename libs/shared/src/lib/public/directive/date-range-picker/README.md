# 日期范围选择指令

## 使用方式

### 1. 基本使用方式

```
@Component({
    selector: 'my-component',
    template: `
        <div class="item-box col-md-6">
          <div class="item-label">
            <label>创建时间:</label>
          </div>
          <div class="item-control">
            <input
              class="form-control xn-input-font"
              type="text"
              name="daterangeInput"
              daterangepicker
              [options]="options"
              (selected)="selectedDate($event)"
            />
          </div>
        </div>
    `,
})
export class MyComponent {

    /* 自定义组件配置。若不设置，则使用默认配置 */
    public options: any = {
        locale: { format: 'YYYY-MM-DD' },
        alwaysShowCalendars: false,
    };

    public selectedDate(value: any) {
      const startDate = value.start.format('x'); // 获取起始时间的时间戳
      const endDate = value.end.format('x'); // 获取结束时间的时间戳
    }
}
```

### 2. 设置时间范围

```
@Component({
    selector: 'my-component',
    template: `
        <div class="item-box col-md-6">
          <div class="item-label">
            <label>创建时间:</label>
          </div>
          <div class="item-control">
            <input
              class="form-control xn-input-font"
              type="text"
              name="daterangeInput"
              daterangepicker
              (selected)="selectedDate($event)"
            />
          </div>
        </div>
    `,
})
export class MyComponent {

    @ViewChild(DaterangepickerDirective)
    private picker: DaterangepickerDirective;

    public updateDateRange() {
        this.picker.datePicker.setStartDate('2017-03-27');
        this.picker.datePicker.setEndDate('2017-04-08');
    }

    ....
}
```

### 3. 处理组件事件

有效事件有：

1. `cancelDaterangepicker` 取消事件

1. `applyDaterangepicker` 确认事件

1. `hideCalendarDaterangepicker` 隐藏 picker 事件

1. `showCalendarDaterangepicker` 显示 picker 事件

1. `hideDaterangepicker` 隐藏 calendar(s) 事件

1. `showDaterangepicker` 显示 calendar(s) 事件

```
@Component({
    selector: 'my-component',
    template: `
        <div class="item-box col-md-6">
          <div class="item-label">
            <label>创建时间:</label>
          </div>
          <div class="item-control">
            <input
              class="form-control xn-input-font"
              type="text"
              name="daterangeInput"
              daterangepicker
              (selected)="selectedDate($event)"
              (cancelDaterangepicker)="calendarCanceled($event)"
              (applyDaterangepicker)="calendarApplied($event)"
            />
          </div>
        </div>
    `,
})
export class MyComponent {

    private selectedDate(value: any) {
        const startDate = value.start.format('x'); // 获取起始时间的时间戳
        const endDate = value.end.format('x'); // 获取结束时间的时间戳
    }

    public calendarCanceled(e:any) {
        console.log(e);
        // e.event
        // e.picker
    }

    public calendarApplied(e:any) {
        console.log(e);
        // e.event
        // e.picker
    }

    ....
}
```

### 4. 单日期
```
@Component({
    selector: 'my-component',
    template: `
        <div class="item-box col-md-6">
          <div class="item-label">
            <label>创建时间:</label>
          </div>
          <div class="item-control">
            <input
              class="form-control xn-input-font"
              type="text"
              name="daterangeInput"
              daterangepicker
              [options]="options"
              (selected)="selectedDate($event)"
            />
          </div>
        </div>
    `,
})
export class MyComponent {

    /* 自定义组件配置。若不设置，则使用默认配置 */
    public options: any = {
        singleDatePicker: true,
    };

    public selectedDate(value: any) {
      const startDate = value.start.format('x'); // 获取起始时间的时间戳
    }
}
```

# Links

[Date Range Picker](http://www.daterangepicker.com/#options)
