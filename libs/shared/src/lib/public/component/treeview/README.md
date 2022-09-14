# 树结构

## 属性（TreeviewConfig）

| 名称            | 类型    | 默认值           | 描述                   |
| --------------- | ------- | ---------------- | ---------------------- |
| hasAllCheckBox  | boolean | true                | 是否显示选择所有               |
| hasFilter      | boolean  | false                | 是否可查询           |
| hasCollapseExpand  | boolean  | false                | 是否显示展开/收缩   |
| decoupleChildFromParent  | boolean  | false                | 是否取消父子结点联动               |
| maxHeight | number   | 500 | 最大高度       |


## 事件

| 名称       | 参数                                                                                                                  | 描述         |
| ---------- | --------------------------------------------------------------------------------------------------------------------- | ------------ |
| onCollapseExpand |  | 展开/收缩事件 |
| onCheckedChange |  | checkbox 选中事件 |
| onFilterTextChange |  | 查询事件 |


## 树组件（treeview）

```
  <treeview
    [config]="config"
    [items]="items"
    (selectedChange)="onSelectedChange($event)"
    (filterChange)="onFilterChange($event)"
  >
  </treeview>
```

## 下拉选择树（dropdown-treeview）

```
  <dropdown-treeview
    [config]="config"
    [items]="items"
    (selectedChange)="onSelectedChange($event)"
  >
  </dropdown-treeview>
```
