# 文件（图片和 pdf）查看组件

## API

| 成员 | 说明 | 类型 | 默认值 | 
|----|----|----|-----|
| files | 查看文件列表 | array | |
| current | 当前查看的文件对象(可选) | any |

## 示例

1. 使用 `fileViewerService` 打开模态框
```
onPreview: (e: any, type: XnFormlyFieldUpload) => {
  this.fileViewerService.openModal({
    current: e,
    files: type.to?.nzFileList,
  });
},
```

2. 模板
```
<xn-protocol-file-viewer [files]="fileList"></xn-protocol-file-viewer>
```
