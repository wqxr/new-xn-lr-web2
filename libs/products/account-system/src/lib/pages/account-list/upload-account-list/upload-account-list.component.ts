/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\account-system\src\lib\pages\upload-account-list\upload-account-list.component.ts
 * @summary：上传企业名单
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                 hucongying          init           2021-10-19
 ***************************************************************************/
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Column, TableChange, TableData } from '@lr/ngx-table';
import { NzMessageService } from 'ng-zorro-antd/message';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { HasAccountOptions, RegisterStatusOptions } from 'libs/shared/src/lib/config/options';
import { BankTypeEnum, FileUploadStatusEnum, RetCodeEnum, TemplateTypeEnum } from 'libs/shared/src/lib/config/enum';
import { NzUploadChangeParam, NzUploadFile, UploadFilter } from 'ng-zorro-antd/upload';
import { XnTableComponent } from '@lr/ngx-table/lib//table.component';
import { XnSelectOptionPipe } from '../../../shared/pipes';
import { MinUtils } from '../../../shared/utils';

@Component({
  templateUrl: './upload-account-list.component.html',
  styles: [
    `
      ::ng-deep .ant-card-head-title {
        font-weight: bold;
      }
      .upload-box {
        padding-bottom: 10px;
        position: relative;
      }
      .upload-tip {
        position: absolute;
        top: 5px;
        left: 100px;
        color: #727a82;
      }
      .box-content {
        border-radius: 3px;
        background: #ffffff;
        box-shadow: 0 1px 1px rgb(0 0 0 / 10%);
      }
    `,
  ],
})
export class UploadAccountListComponent implements OnInit {
  // 批次号
  batchNo: string;
  // 分页
  pageConfig = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };
  pageIndex: number = 1;
  // 表格数据
  listInfo: any[] = [] as any;
  // 表头
  columns: Column[] = [
    {
      title: '序号',
      index: 'no',
      width: 50,
      format: (item: TableData, col: Column, index: number): string =>
        (index + 1).toString(),
    },
    { title: '企业名称', index: 'appName' },
    {
      title: '平台注册状态', index: 'registerStatus', format: (item: TableData): string => {
        return this.optionPipe.transform(item.registerStatus, this.registerStatusOptions);
      }
    },
    {
      title: '是否已开户', index: 'hasAccount', format: (item: TableData): string => {
        return this.optionPipe.transform(item.hasAccount, this.hasAccountOptions);
      }
    },
    {
      title: '操作', index: 'action', buttons: [
        {
          text: '删除',
          type: 'del',
          click: (record: TableData, modal?: any, instance?: XnTableComponent) => {
            this.delApplyCompany(record)
          }
        }
      ]
    },
  ];
  loading: boolean = false;
  btnLoading: boolean = false;
  fileList: NzUploadFile[] = [];
  fileext: string[] =
    [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
  // 自定义过滤器
  public filters: UploadFilter[] = [
    {
      name: 'type',
      fn: (fileList: NzUploadFile[]) => {
        const filterFiles = fileList.filter(
          (w) =>
            this.fileext.includes(w.type)
        );
        if (filterFiles.length !== fileList.length) {
          this.message.warning('请上传.xlsx或.xls格式的文件');
          return filterFiles;
        }
        const isLt20M = fileList.filter(
          (x) => x.size / 1024 < 2000
        );
        if (isLt20M.length !== fileList.length) {
          this.message.warning('文件大小超过20M!，请重新上传');
          return isLt20M;
        }
        return fileList;
      },
    },
  ];
  get showIcon() {
    return { showDownloadIcon: false, showRemoveIcon: true }
  }
  get registerStatusOptions() {
    return RegisterStatusOptions
  }
  get hasAccountOptions() {
    return HasAccountOptions
  }
  constructor(
    private xn: XnService,
    private cdr: ChangeDetectorRef,
    public hwModeService: HwModeService,
    private vcr: ViewContainerRef,
    private router: ActivatedRoute,
    private message: NzMessageService,
    private optionPipe: XnSelectOptionPipe,
  ) { }
  ngOnInit(): void {

  }

  /**
   * 上传企业名单
   */
  uploadApplyList(fileKeys: string[], bankType: string) {
    this.xn.middle.post('/account/apply/upload', { fileKeys, bankType }).subscribe(
      (x) => {
        if (x.code === RetCodeEnum.OK) {
          this.batchNo = x.data.batchNo;
          this.onPage({ pageIndex: 1, pageSize: 10 }, x.data.batchNo);
        }
      },
      (err) => {
        this.message.error(err.msg);
      }
    );
  }

  /**
   * @param e  pageIndex 页码 pageSize 每页数量 total 数据总数
   * @param batchNo  批次号
   * @summary
   */
  onPage(
    e?: { pageIndex: number; pageSize?: number; total?: number },
    batchNo?: string
  ) {
    this.loading = true;
    this.pageIndex = e.pageIndex || 1;
    this.pageConfig = Object.assign({}, this.pageConfig, e);
    const params = this.buildParams();
    this.xn.middle.post2('/account/apply/list', params).subscribe(
      (x) => {
        this.loading = false;
        if (x.code === RetCodeEnum.OK) {
          this.listInfo = x.data.applyAppList;
          this.pageConfig.total = x.data.total;
        }
      },
      () => {
        this.loading = false;
      }
    );
  }

  /**
   * 构建列表请求参数
   * @param searchModel 搜索项
   */
  private buildParams() {
    const params: any = {
      page: this.pageIndex,
      size: this.pageConfig.pageSize,
      batchNo: this.batchNo
    };
    return params;
  }

  /**
   * 上传文件handle
   * @param info
   */
  handleChange(info: NzUploadChangeParam): void {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    fileList = fileList.map(file => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });
    this.fileList = fileList;
    if (info.type === FileUploadStatusEnum.SUCCESS) {
      MinUtils.jsonToHump(info.file.response.data);
      const fileKey = info.file.response.data.fileKey;
      this.uploadApplyList([fileKey], TemplateTypeEnum.UPLOAD_COMPANY);
    }
  }

  /**
   * 文件上传前处理
   * @param file
   * @returns
   */
  beforeUpload = (file: NzUploadFile) => {
    const lastModifiedList: any[] = this.fileList.map((x) => x.lastModified);
    if (this.fileList.length >= 1) {
      this.message.error('最多上传一个文件')
      return false;
    } else if (lastModifiedList.includes(file.lastModified)) {
      this.message.error(`${file.name}已经上传`);
      return false;
    } else {
      return true
    }
  };

  onRemoved = (file: NzUploadFile) => {
    this.listInfo = [];
    this.cdr.markForCheck();
    return true;
  }

  /**
   * 删除已上传的企业
   * @param record
   */
  delApplyCompany(record: TableData) {
    this.xn.middle.post('/account/apply/delete', { accountApplyId: record.accountApplyId }).subscribe(
      (x) => {
        if (x.code === RetCodeEnum.OK) {
          this.message.success('删除成功');
          this.onPage({ pageIndex: 1, pageSize: 10 }, this.batchNo);
        }
      },
      (err) => {
        this.message.error(err.msg);
      }
    );
  }

  /**
   * 下载模板
   */
  downloadTemplate() {
    this.xn.middle.getFileDownload('/template/download', { templateType: BankTypeEnum.SH_BANK }).subscribe(res => {
      const fileName = this.xn.middle.getFileName(res.Body.headers);
      this.xn.middle.save(res.Body.body, fileName);
    })
  }

  /**
   * 提交已上传的企业
   */
  submitList() {
    this.btnLoading = true;
    this.xn.middle.post2('/account/apply/submit', { batchNo: this.batchNo }).subscribe(
      (x) => {
        this.btnLoading = false;
        if (x.code === RetCodeEnum.OK) {
          this.message.success('提交成功');
          this.goBack();
        }
      },
      () => {
        this.btnLoading = false;
      }
    );
  }

  /**
   * 表格事件handle
   * @param e table事件
   * @param seachQuery 搜索项
   */
  handleTableChange(e: TableChange,) {
    switch (e.type) {
      case 'pageIndex':
        this.onPage(e, this.batchNo);
        break;
      case 'pageSize':
        this.onPage(e, this.batchNo);
        break;
      default:
        break;
    }
  }

  goBack() {
    window.history.go(-1)
  }
}
