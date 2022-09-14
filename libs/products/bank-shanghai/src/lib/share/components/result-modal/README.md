# 提示modal组件

## API

| 成员 | 说明 | 类型 | 默认值 | 
|----|----|----|-----|
| nzTitle | modal标题 | string | ''|
| nzWidth | modal宽度配置 | number | 400|
| nzFooter | modal页脚是否显示 | boolean | false|
| buttons | 页脚按钮，当modalFooter为true时有效 | ButtonConfigs | |
| delayTime | 延时关闭modal,单位ms | number | |
| message | message提示提示配置 | any | |
| message.nzType | 提示类型，决定图标类型| 'check-circle','close-circle','exclamation-circle','info-circle' | |
| message.nzColor | 图标颜色 | '#52c41a','#ff4d4f','#faad14','#1890ff' | |
| message.nzTitle | 提示标题 | string | |
| message.nzContent | 提示内容 | string | |
| message.buttons | 按钮 | ButtonGroup | |
| result | result结果配置 | any | |
| result.nzStatus | 结果的状态，决定图标和颜色 | 'success', 'error', 'info', 'warning','404', '403','500', 'info' | |
| result.nzTitle | 标题 | string | |
| result.nzSubTitle | 副标题 | string | |
| result.buttons | modal宽度配置 | ButtonGroup[] | |

## 示例

1. 使用 `showModalService` 打开模态框 注意message和result, localFilesView只能配置其中一个
```
const params = {
  nzTitle: '提示',
  nzWidth: 480,
  nzFooter: true,
  buttons: {
    left: [
      { label: '按钮1', type: 'normal', btnKey: 'btn1'},
    ],
    right: [
      { label: '按钮2', type: 'normal', btnKey: 'btn2'},
    ]
  },
  message: {
    nzType: 'info-circle',
    nzColor: '#1890ff',
    nzTitle: '提示',
    nzContent: '请先选择要签收的文件',
    buttons: { label: '按钮3', type: 'normal', btnKey: 'btn3', btnType: 'primary' },
  },
  result: {
    nzStatus: 'info',
    nzTitle: '提示',
    nzSubTitle: '请先选择要签收的文件',
    buttons: [
      { label: '按钮4', type: 'normal', btnKey: 'btn4', btnType: 'default' },
      { label: '按钮5', type: 'normal', btnKey: 'btn5', btnType: 'primary' },
    ],
  },
  localFilesView: {
    src: '/assets/lr/doc/avenger-mode/法定代表人证明书.pdf',
    height: '500px'
  }
};
this.showModalService.openModal(this.xn, this.vcr, AntResultModalComponent, params).subscribe((x: any) => {
});
```