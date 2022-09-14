# 日期选择组件

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
            <xn-date-picker
              #datepicker
              [placeholder]="'请录入保理融资到期日，格式为：20190101'"
              [options]="options"
              (changeDate)="selectedDate($event, 'factoringEndDate')"
            ></xn-date-picker>
          </div>
        </div>
    `,
})
export class MyComponent {

    defalutDate = '2020-02-06';
    disabled = false;


    // options: https://bootstrap-datepicker.readthedocs.io/en/latest/options.html#quick-reference
    public options: any = {
        format: 'yyyymmdd',
    };

    public selectedDate(value: any) {
      const startDate = value.start.format('x'); // 获取起始时间的时间戳
      const endDate = value.end.format('x'); // 获取结束时间的时间戳
    }
}
```

### 3. 处理组件事件

有效事件有：

1. `changeDate` 日期变更事件

2. `show` 显示事件

3. `hide` 隐藏 picker 事件

```
@Component({
    selector: 'my-component',
    template: `
        <div class="item-box col-md-6">
          <div class="item-label">
            <label>创建时间:</label>
          </div>
          <div class="item-control">
            <xn-date-picker
              (changeDate)="selectedDate($event)"
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

    ....
}
```

# Links

[bootstrap-datepicker](https://bootstrap-datepicker.readthedocs.io/en/latest/index.html)
