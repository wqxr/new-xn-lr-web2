# 可折叠的搜索条件表单组件

## 示例

```html
  <collapse-condition-form
    colNum="6"
    [shows]="shows"
    [form]="mainForm"
  ></collapse-condition-form>
```

## 属性

| 名称            | 类型    | 默认值           | 描述                   |
| --------------- | ------- | ---------------- | ---------------------- |
| colNum          | number  | 4                | 柵格例数                |
| defaultRows     | number  | 2                | 默认显示行数             |
| shows           | array   | []               | 动态表单 check 配置      |
| formModule      | string  | default-input    | 表单所属模块             |
| form            | FormGroup  |               | FormGroup 对象          |
| showColon       | boolean | false            | 是否在 label 后显示冒号   |
