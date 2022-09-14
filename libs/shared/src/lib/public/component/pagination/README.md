# Pagination 分页

## 示例

```typescript
<xn-pagination
    rows="10"
    totalRecords="120"
    pageSizeOptions="[10,20,30]"
    (pageChange)="onPageChange($event)"></xn-pagination>
```

## 属性

| 名称            | 类型    | 默认值           | 描述                   |
| --------------- | ------- | ---------------- | ---------------------- |
| totalRecords    | number  | 0                | 数据总数               |
| rows            | number  | 0                | 每页显示行数           |
| first           | number  | 0                | 显示前n（从0算起）行   |
| pageLinkSize    | number  | 5                | 页码数量               |
| pageSizeOptions | array   | [10, 20, 30, 40] | 指定每页显示行数       |
| style           | string  | null             | 组件行内样式           |
| styleClass      | string  | null             | 组件样式               |
| alwaysShow      | boolean | true             | 只有一页数据时显示与否 |

## 事件

| 名称       | 参数                                                                                                                  | 描述         |
| ---------- | --------------------------------------------------------------------------------------------------------------------- | ------------ |
| pageChange | event.page: 新页码 <br> event.pageSize: 页面显示行数<br>event.first: 新页面之前的总行数<br>event.pageCount : 页码总数 | 切换页面事件 |
