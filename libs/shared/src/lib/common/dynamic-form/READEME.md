# 动态表单模块

## 示例

```typescript
  @Component({
      selector: 'xn-dynamic-form-component',
      template: `
        <app-dynamic-input
          [row]="row"
          [form]="mainForm"
          [svrConfig]="svrConfig"
          formModule="avenger-input"
        ></app-dynamic-input>
      `
  })
  export class AvengerInputComponent implements OnInit {

    // 当前行信息
    @Input() row: any;
    // 表单组
    @Input() form: FormGroup;
    // 主流程信息
    @Input() svrConfig: any;
  }
```

## 动态组件定义

```typescript
  @Component({
      selector: 'xn-check-form-component',
      template: '',
  })
  @DynamicForm({ type: 'type', formModule: 'avenger-input' })
  export class XnCheckFormComponent implements OnInit {
    
  }
```
