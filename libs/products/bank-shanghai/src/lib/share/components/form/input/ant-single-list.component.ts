import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Column, ColumnButton, TableChange, TableData } from '@lr/ngx-table';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { FileAdapterService } from 'libs/shared/src/lib/services/file-adapter.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import {
  ButtonConfigs,
  ButtonGroup,
} from '../../../../logic/table-button.interface';
import { ShangHaiMfilesViewModalComponent } from '../../../modal/mfiles-view-modal.component';
import { ShowModalService } from '../../../services/show-modal.service';
import AntTableListConfig from '../../bean/ant-table-config';
import { MFileViewerService } from '../../mfile-viewer/mfile-viewer.service';
import { AntResultModalComponent } from '../../result-modal/ant-result-modal.component';

@Component({
  selector: 'lib-ant-single-list',
  templateUrl: './ant-single-list.component.html',
  styleUrls: ['./ant-single-list.component.css'],
})
@DynamicForm({ type: 'ant-list', formModule: 'dragon-input' })
export class AnTSingleListComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;

  columns: Column[] = [];
  statisticColumn: string[] = [];
  // 表格头部按钮配置
  tableHeadBtn: ButtonConfigs = {};
  lists: any[] = [];
  selectedList: any[] = [];
  loading = false;

  myClass = '';
  alert = '';
  ctrl: AbstractControl;
  xnOptions: XnInputOptions;
  get tableHeadBtnConfig() {
    return Object.keys(this.tableHeadBtn) || [];
  }
  headTip: {
    updateTime: number | string;
    isUpdate: string;
  } = {
    updateTime: 0,
    isUpdate: '无更新',
  };

  constructor(
    private er: ElementRef,
    private xn: XnService,
    private render2: Renderer2,
    private showModalService: ShowModalService,
    private router: Router,
    private vcr: ViewContainerRef,
    private fileAdapter: FileAdapterService,
    private mFileViewerService: MFileViewerService
  ) {}

  ngOnInit(): void {
    this.ctrl = this.form.get(this.row.name);
    this.initTip();
    this.initList();
    this.xnOptions = new XnInputOptions(
      this.row,
      this.form,
      this.ctrl,
      this.er
    );
  }

  initTip() {
    if (['baseFile'].includes(this.row.checkerId)) {
      const params = {
        appId: this.svrConfig?.debtUnitId,
      };
      this.xn.dragon
        .post(`/shanghai_bank/${this.svrConfig.record.flowId?.substring(0, 2)}_supplier/getSupplierUpdateFlag`, params)
        .subscribe({
          next: (x) => {
            if (x && x.ret === 0 && x.data) {
              this.headTip = {
                updateTime: x.data.updateFlagTime || 0,
                isUpdate: AllStatus[x.data.updateFlag],
              };
            }
          },
          error: (errors) => {},
          complete: () => {},
        });
    }
  }

  initList() {
    // 配置
    const { columns, tableHeadBtn } = AntTableListConfig.getConfig(
      this.row.checkerId
    );
    this.columns = [
      ...columns,
      {
        title: '操作',
        width: '10%',
        buttons: [
          {
            text: '查看',
            type: 'link',
            iif: (item: TableData, btn: ColumnButton, column: Column) =>
              ['invoice', 'baseFile'].includes(this.row.checkerId),
            iifBehavior: 'hide',
            click: (e: any) => {
              console.log('查看 click', e);
              const files =
                this.row.checkerId === 'baseFile' ? e.fileInfo : [e];
              this.viewFiles(XnUtils.parseObject(files, []), false);
            },
          },
          {
            text: '下载',
            type: 'link',
            iif: (item: TableData, btn: ColumnButton, column: Column) =>
              ['baseFile'].includes(this.row.checkerId),
            iifBehavior: 'hide',
            click: (e: any) => {
              console.log('下载 click', e);
              this.downloadFiles(XnUtils.parseObject(e.fileInfo, []), e);
            },
          },
          {
            text: '查看文件',
            type: 'link',
            iif: (item: TableData, btn: ColumnButton, column: Column) =>
              ['dealContract'].includes(this.row.checkerId),
            iifBehavior: 'hide',
            click: (e: any) => {
              this.viewFiles(XnUtils.parseObject(e.contractFile, []), false);
            },
          },
        ],
      },
    ];
    this.tableHeadBtn = tableHeadBtn;
    if (
      ['baseFile'].includes(this.row.checkerId) &&
      ['sh_vanke_platform_verify', 'so_platform_verify'].includes(this.row.flowId)
    ) {
      const value = this.row?.value ? this.row?.value : this.row?.data;
      const resList = XnUtils.parseObject(value, []) || [];
      const keys = XnUtils.distinctArray(resList.map((v: any) => v.fileType));
      this.lists = keys.map((key: string) => {
        const fileInfo = resList
          .filter((res: any) => key === res.fileType)
          .map((z: any) => XnUtils.parseObject(z.fileInfo, {}));
        return {
          fileType: key,
          fileInfo,
          operatorUserId:
            resList.find((res: any) => key === res.fileType)?.operatorUserId ||
            '',
        };
      });
    } else {
      const value = this.row?.value ? this.row?.value : this.row?.data;
      this.lists = XnUtils.parseObject(value, []);
    }
    const needStatistic = columns.some((x: any) =>
      x.hasOwnProperty('statistical')
    );
    this.statisticColumn =
      this.lists && this.lists.length && needStatistic
        ? columns.map((x: any) => x.index)
        : [];
    this.toValue();
    this.calcAlertClass();
  }

  /**
   * 行按钮组事件
   * @param paramItem 当前行数据
   * @param btn 按钮操作配置
   * @param i 下标
   */
  public handleHeadClick(btn: ButtonGroup) {
    if (btn.btnKey === 'basicInfoAllDownload') {
      const param = {
        appId: this.svrConfig?.debtUnitId,
      };
      this.xn.dragon
        .download(`/shanghai_bank/${this.svrConfig.record.flowId?.substring(0, 2)}_supplier/shBaseFileAllDown`, param)
        .subscribe((v: any) => {
          if (!!v && !!v.ret && v.ret !== 0) {
            this.showPostError(v);
          } else if (!!v && !!v._body) {
            this.xn.api.save(
              v._body,
              `${this.svrConfig?.debtUnit}-准入资料.zip`
            );
          }
        });
    } else if (btn.btnKey === 'contractAllDownload') {
      const param = {
        mainFlowId: this.svrConfig.record?.mainFlowId,
      };
      this.xn.dragon
        .download('/shanghai_bank/sh_general/downContractFiles', param)
        .subscribe((v: any) => {
          if (!!v && !!v.ret && v.ret !== 0) {
            this.showPostError(v);
          } else if (!!v && !!v._body) {
            this.xn.api.save(
              v._body,
              `${this.svrConfig?.debtUnit}-交易合同.zip`
            );
          }
        });
    } else if (btn.btnKey === 'invoiceAllDownload') {
      const param = {
        mainFlowId: this.svrConfig.record?.mainFlowId,
      };
      this.xn.dragon
        .download('/shanghai_bank/sh_general/downInvoiceFiles', param)
        .subscribe((v: any) => {
          if (!!v && !!v.ret && v.ret !== 0) {
            this.showPostError(v);
          } else if (!!v && !!v._body) {
            this.xn.api.save(v._body, `${this.svrConfig?.debtUnit}-发票.zip`);
          }
        });
    }
  }

  /**
   * table事件处理
   * @param e 分页参数
   * @param searchForm 搜索项
   */
  handleTableChange(e: TableChange) {
    // console.log('handleTableChange', e);
    switch (e.type) {
      case 'pageIndex':
      case 'pageSize':
        break;
      case 'checkbox':
        console.log('checkbox', e);
        this.selectedList = e.checkbox || [];
        break;
    }
  }

  // 查看文件-图片、pdf
  // viewFiles(files: any) {
  //   // console.log('viewFiles-----------', files);
  //   const filesArr = files.map((x: any) => {
  //     return {
  //       ...x,
  //       url: this.fileAdapter.XnFilesView(x, 'dragon')
  //     };
  //   });
  //   const param = {
  //     nzTitle: '文件查看',
  //     nzWidth: 1100,
  //     nzFooter: true,
  //     nzMaskClosable: false,
  //     nzClosable: true,
  //     filesList: {
  //       files: !!filesArr.length ? filesArr : [{ fileId: '', fileName: '', filePath: '', url: '' }],
  //       showTools: true,
  //       width: '100%'
  //     },
  //     buttons: {
  //       left: [],
  //       right: [
  //         { label: '关闭', btnKey: 'cancel', type: 'normal' }
  //       ]
  //     }
  //   };
  //   this.mFileViewerService.openModal(param).subscribe((x: any) => { });
  // }

  // 查看文件-老
  viewFiles(files: any[], isAvenger: boolean) {
    files.map((x: any) => {
      x.isAvenger = isAvenger;
    });
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      ShangHaiMfilesViewModalComponent,
      files
    ).subscribe((v) => {
      if (v.action === 'cancel') {
        return;
      } else {
      }
    });
  }

  // 下载文件
  downloadFiles(files: any[], e: any) {
    // console.log('downloadFiles------', files);
    if (files && files.length === 1) {
      this.fileAdapter.saveFile(
        files[0],
        `${FilesName[e.fileType]}-${files[0]?.fileName}`,
        'dragon'
      );
    } else {
      const param = {
        appId: this.svrConfig?.debtUnitId,
        fileType: e.fileType,
      };
      this.xn.dragon
        .download(`/shanghai_bank/${this.svrConfig.record.flowId?.substring(0, 2)}_supplier/shBaseFileDown`, param)
        .subscribe((v: any) => {
          if (!!v && !!v.ret && v.ret !== 0) {
            this.showPostError(v);
          } else if (!!v && !!v._body) {
            this.xn.api.save(
              v._body,
              `${this.svrConfig?.debtUnit}-${FilesName[e.fileType]}.zip`
            );
          }
        });
    }
  }

  public onBlur() {
    this.calcAlertClass();
  }

  private calcAlertClass() {
    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    if (this.row.checkerId === 'refEnterprise') {
      // 提示
      const isLimit = this.lists.some(
        (x: any) => x.refLevel.toString() === '4'
      );
      const tipStr = XnUtils.distinctArray(
        this.lists.map((x: any) => x.refContent)
      );
      this.alert = isLimit
        ? `${
            this.alert ? ',' : ''
          }该企业已达4级查询上限，请手动核查关联级别为4的企业与${tipStr.join(
            '、'
          )}关联关系`
        : this.alert;
    }
  }

  private toValue() {
    if (!this.lists.length) {
      this.ctrl.setValue('');
    } else {
      this.ctrl.setValue(JSON.stringify(this.ctrl.value));
    }
    this.ctrl.markAsTouched();
    this.calcAlertClass();
  }

  getFielsName(key: string): string {
    return FilesName[key] || '';
  }

  showPostError(json: { ret: number; msg: string }) {
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
        right: [{ label: '确定', btnKey: 'ok', type: 'normal' }],
      },
    };
    this.showModalService
      .openModal(this.xn, this.vcr, AntResultModalComponent, param)
      .subscribe((x: any) => {
        if ([99902, 20001].includes(json.ret)) {
          // 用户没有登录，跳转到登录界面
          this.router.navigate(['/login']);
        }
      });
  }
}

export enum AllStatus {
  '已更新' = 1,
  '无更新' = 2,
}

enum FilesName {
  businessLicenseFile = '营业执照',
  orgLegalCardFile = '法定代表人身份证',
  orgLegalCertFile = '法定代表人证明书',
  profitsRecognitionFile = '受益所有人信息表',
  profitsCardFile = '受益所有人身份证',
  companyDecisionFile = '公司章程',
  authorizeLetterFile = '征信授权书',
  financeFile = '财务报表',
}
