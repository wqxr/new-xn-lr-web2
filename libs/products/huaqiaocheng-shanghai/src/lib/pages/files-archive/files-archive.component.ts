import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { FormlyFieldConfig } from '@lr/ngx-formly';
import { Column, ColumnButton, TableChange, TableData } from '@lr/ngx-table';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { SearchFormComponent } from '@lr/ngx-shared';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ButtonConfigs, ButtonGroup } from '../../logic/table-button.interface';
import FilesArchiveConfig from '../../logic/files-archive';
import { FileAdapterService } from 'libs/shared/src/lib/services/file-adapter.service';
import { FileSignService } from 'libs/products/bank-shanghai/src/lib/share/components/file-sign';
import { Router } from '@angular/router';
import { ShowModalService } from 'libs/products/bank-shanghai/src/lib/share/services/show-modal.service';
import { AntResultModalComponent } from 'libs/products/bank-shanghai/src/lib/share/components/result-modal/ant-result-modal.component';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'oct-files-archive',
  templateUrl: './files-archive.component.html',
  styleUrls: ['./files-archive.component.css']
})
export class OctFilesArchiveComponent implements OnInit {
  @ViewChild('searchForm') searchForm: SearchFormComponent;
  showFields: FormlyFieldConfig[] = FilesArchiveConfig.getConfig('defaultFields');
  columns: Column[] = [
    ...FilesArchiveConfig.getConfig('defaultColumns'),
    { title: '操作', width: 50, fixed: 'right', buttons: [
        { text: '签收', type: 'link', iif: (item: TableData, btn: ColumnButton, column: Column) =>
          item.filesList.some((x: any) => !x.signStatus), iifBehavior: 'hide',
          // pop: {
          //   title: '请先选择要签收的文件，',
          //   trigger: 'click',
          //   placement: 'top',
          //   okText: '全选',
          //   cancelText: '关闭',
          //   okType: 'primary',
          //   condition: (item: TableData) => item.filesList.some((x: any) => !!x.checked)
          // },
          click: (e: any) => {
            const noSelect = e.filesList.every((x: any) => !x.checked);
            if (noSelect){
              this.showAlert();
              return false;
            }
            this.antSignFiles(e, 1);
          },
        },
        { text: '查看', type: 'link', iif: (item: TableData, btn: ColumnButton, column: Column) =>
          !item.filesList.some((x: any) => !x.signStatus), iifBehavior: 'hide', click: (e: any) => {
            this.antSignFiles(e, 0);
          },
        }
      ],
    },
  ];
  // 表格头部按钮配置
  tableHeadBtn: ButtonConfigs = FilesArchiveConfig.getConfig('tableHeadBtn');
  get tableHeadBtnConfig() {
    return Object.keys(this.tableHeadBtn) || [];
  }

  data = [];
  loading = true;

  pageConfig = {
    pageIndex: 1,
    pageSize: 10,
    total: 0
  };
  selectedList: any[] = [];
  tabelConfig: any;
  searchModels: {[key: string]: any} = {};

  constructor(
    private fileSignService: FileSignService,
    private fileAdapter: FileAdapterService,
    private xn: XnService,
    private msg: NzMessageService,
    private vcr: ViewContainerRef,
    private router: Router,
    private showModalService: ShowModalService
  ) {}

  ngOnInit(): void {
    this.onPage({ pageIndex: 1, pageSize: 10 }, {});
  }

  /**
   * 获取接口数据
   * @param pageConfig pageIndex 页码 pageSize 每页数量 total 数据总数
   * @searchModel 搜索项
   */
  onPage(pageConfig: { pageIndex: number, pageSize: number, total?: number }, searchModel: {[key: string]: any} = {}) {
    this.pageConfig = Object.assign({}, this.pageConfig, pageConfig);
    this.searchModels = searchModel;
    const params = this.buildParams(searchModel);
    this.xn.dragon.postMapCatch('/shanghai_bank/so_supplier_archive/getArchiveList', params).subscribe({
      next: (res) => {
        if (res && res.ret === 0 && res.data) {
          this.data = res.data.data || [];
          this.pageConfig.total = res.data.count;
        } else if (res && res.ret !== 0) {
          this.showPostError(res);
          this.data = [];
          this.pageConfig.total = 0;
        } else {
          this.data = [];
          this.pageConfig.total = 0;
        }
        this.selectedList = [];
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

   /**
    * 表格头部按钮事件处理
    * @param btn 按钮配置
    */
  handleHeadClick(btn: ButtonGroup) {
    console.log('handleHeadClick====', btn);
    if (btn.btnKey === 'export_manifest') {
      // 导出清单
      if(!this.data.length) {
        this.msg.error('没有要导出的数据！');
        return ;
      }
      const params = this.buildParams(this.searchModels);
      this.xn.dragon.download(btn.postUrl, params).subscribe((con: any) => {
        this.xn.api.save(con._body, '企业文件归档清单.xlsx');
        this.xn.loading.close();
      });
    } else if (btn.click) {
      btn.click(btn);
    }
  }

  /**
   * 搜索条件查询
   */
  onSearch(data: any) {
    this.pageConfig.pageIndex = 1;
    this.onPage(this.pageConfig, data);
  }

  /**
   * 重置搜索项表单
   */
  onReset(searchForm: any) {
    searchForm.form.reset();
    this.onSearch({});
  }

  /**
   * 构建参数
   */
  private buildParams(searchModel: {[key: string]: any}) {
    // 分页处理
    const params: any = {
      start: (this.pageConfig.pageIndex - 1) * this.pageConfig.pageSize,
      length: this.pageConfig.pageSize,
    };
    // 排序处理

    // 搜索处理
    for (const key of Object.keys(searchModel)) {
      if (!XnUtils.isEmptys(searchModel[key], [0])) {
        if (key === 'orgName') {
          params.companyName = searchModel[key];
        } else if (key === 'signForStatus') {
          const { first, second } = searchModel[key];
          if (!XnUtils.isEmptys(first, [0]) && !XnUtils.isEmptys(second, [0])){
            params[SignForStatus[Number(first)]] = Number(second);
          }
        } else {
          params[key] = searchModel[key];
        }
      }
    }
    return params;
  }

  /**
   * 数组格式转换 过滤
   * @param arr 源数据
   * @param filter 过滤条件
   */
  getFilesArr(arr: any, filter: {key: string, value: any}) {
    const arrTpl = XnUtils.parseObject(arr, []) || [];
    return arrTpl.filter((x: any) => String(filter.value) === String(x[filter.key]));
  }

  /**
   * 文件勾选处理
   * @param seletedArr 已选项value数组
   * @param model 数据model
   */
  onCheckChanges(seletedArr: string[], model: any[]): void {
    model.map((x: any) => {
      x.checked = seletedArr.includes(x.value);
    });
  }

  /**
   * table事件处理
   * @param e 分页参数
   * @param searchForm 搜索项
   */
  handleTableChange(e: TableChange, searchForm: {[key: string]: any}) {
    switch (e.type) {
      case 'pageIndex':
      case 'pageSize':
        this.onPage(e, searchForm.model);
        break;
      case 'checkbox':
        console.log('checkbox', e);
        this.selectedList = e.checkbox || [];
        break;
      default:
        break;
    }
  }

  // 签收文件-图片、pdf
  antSignFiles(item: {filesList: any[], appId: string}, type: number) {
    const filesLists = !!type ? item.filesList.filter((x: any) => !!x.checked) : item.filesList;
    filesLists.map((filesObj: any) => {
      filesObj.files.map((file: any) => {
          file.url = this.fileAdapter.XnFilesView({ fileId: file.filePath, filePath: file.filePath }, 'dragon'),
          file.selected = false;
      });
      return filesObj;
    });
    const param = {
      filesList: filesLists,
      appId: item.appId.toString(),
      postUrl: '/shanghai_bank/so_supplier_archive/updateArchive',
    };
    this.fileSignService.openModal(param).subscribe((v: any) => {
      if (v && v.action === 'cancel'){
        this.onPage(this.pageConfig, {});
      }
    });
  }

  /**
   * 没勾选文件时提示
   */
  showAlert() {
    const params = {
      nzTitle: '',
      nzWidth: 480,
      nzFooter: false,
      delayTime: 3000,
      message: {
        nzType: 'info-circle',
        nzColor: '#1890ff',
        nzTitle: '提示',
        nzContent: '请先选择要签收的文件',
      },
    };
    this.showModalService.openModal(this.xn, this.vcr, AntResultModalComponent, params).subscribe((x: any) => {
    });
  }

  showPostError(json: {ret: number, msg: string}) {
    const param = {
      nzTitle: '',
      nzWidth: 480,
      nzFooter: true,
      nzMaskClosable: true,
      nzClosable: true,
      message: {
        nzType: 'close-circle',
        nzColor: '#ff4d4f',
        nzTitle: '错误',
        nzContent: `错误码[${json.ret}]，${json.msg}`,
      },
      buttons: {
        left: [],
        right: [
          { label: '确定', btnKey: 'ok', type: 'normal' }
        ]
      }
    };
    this.showModalService.openModal(this.xn, this.vcr, AntResultModalComponent, param).subscribe((x: any) => {
      if ([99902, 20001].includes(json.ret)) {
        // 用户没有登录，跳转到登录界面
        this.router.navigate(['/login']);
      }
    });
  }

}

enum SignForStatus {
  // 征信授权书
  'authorizeLetterStatus' = 1,
  // 受益人识别表
  'profitsRecognitionStatus' = 2,
  // 受益人身份证
  'profitsCardStatus' = 3,
}
