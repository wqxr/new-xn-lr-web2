# Tabs 组件（使用路由切换内容）

## 示例

*-routing.module.ts

```typescript
  {
      path: 'record',
      component: XnTabsComponent,
      data: {
          title: '上传付款计划（房地产供应链标准保理）',
          tabs: [{
                  label: '万科、雅居乐',
                  link: 'record-vanke/financing_pre6',
                  index: 0
              }, {
                  label: '龙光',
                  link: 'record-vanke/dragon/pre_recordfinancing_pre6',
                  index: 1
              }]
      },
  }
```
