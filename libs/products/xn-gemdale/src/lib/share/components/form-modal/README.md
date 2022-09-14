# 表单模态框组件

## API

| 成员 | 说明 | 类型 | 默认值 | 
|----|----|----|-----|
| `[isVisible]` | 是否显示模态框 | boolean | false |
| `[width]` | 模态框宽度 | number | 680 |
| `[title]` | 模态框标题 | string | '编辑合同信息' |
| `[modalFooter]` | 自定义模态框底部内容 | `TemplateRef` | |
| `[noColon]` | 是否不显示 label 后面的冒号 | boolean | true |
| `[layout]` | 表单布局 | `'horizontal' | 'vertical' | 'inline'` | `horizontal` |
| `[form]` | 表单实例 | `FormGroup` | `new FormGroup({})` |
| `[fields]` | 表单配置 | `FormlyFieldConfig[]` | [] |
| `[model]` | 表单初始值 | object | {} |
| `(ok)` | 点击确定按钮时将执行的回调函数 | function | |
| `(cancel)` | 点击遮罩层或右上角叉或取消按钮的回调 | function | |


## 示例

```html
<xn-form-modal
  title="编辑合同信息"
  [isVisible]="isVisible"
  [fields]="formModalFields"
  [modalFooter]="modalFooter"
  (ok)="onModalOk($event)"
  (cancel)="isVisible = false"
>
  <ng-template #modalFooter let-model>
    <button nz-button nzType="default" (click)="isVisible=false">取消</button>
  </ng-template>
</xn-form-modal>
```
