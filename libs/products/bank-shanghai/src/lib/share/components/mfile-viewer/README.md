# 文件（图片和 pdf）查看组件

## API

| 成员 | 说明 | 类型 | 默认值 | 
|----|----|----|-----|
| files | 查看文件列表 | array | |
| current | 当前查看的文件对象(可选) | any |

## 示例

1. 使用 `MFileViewerService` 打开模态框
```
const filesArr = files.map((x: any) => {
  return {
      ...x,
      url: `/dragon/file/view?sign=${sign}&t=${t}&key=${x.filePath}`
  };
});
const param = {
  nzTitle: '文件查看',
  nzWidth: 1100,
  nzFooter: true,
  nzMaskClosable: false,
  nzClosable: false,
  filesList: {
      files: !!filesArr.length ? filesArr : [{ fileId: '', fileName: '', filePath: '', url: '' }],
      showTools: true,
      width: '100%'
  },
  buttons: {
      left: [],
      right: [
          { label: '关闭', btnKey: 'cancel', type: 'normal' }
      ]
  }
};
this.mFileViewerService.openModal(param).subscribe((x: any) => {});
```

2. 模板
```
<xn-mfile-viewer [files]="fileList"></xn-mfile-viewer>
```
