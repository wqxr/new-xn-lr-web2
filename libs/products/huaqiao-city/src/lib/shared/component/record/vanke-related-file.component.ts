import { Component, OnInit, ViewContainerRef, Input } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute } from '@angular/router';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { DragonMfilesViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import { DragonPdfSignModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/pdf-sign-modal.component';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import VankebusinessdataTabConfig from 'libs/shared/src/lib/public/dragon-vanke/components/bean/vanke-business-related';

@Component({
  selector: 'huaqiao-city-file-related',
  templateUrl: './vanke-related-file.component.html',
  styles: [
    `
      .table {
        font-size: 13px;
      }

      .table-head .sorting,
      .table-head .sorting_asc,
      .table-head .sorting_desc {
        position: relative;
        cursor: pointer;
      }

      .table-head .sorting:after,
      .table-head .sorting_asc:after,
      .table-head .sorting_desc:after {
        position: absolute;
        bottom: 8px;
        right: 8px;
        display: block;
        font-family: 'Glyphicons Halflings';
        opacity: 0.5;
      }

      .table-head .sorting:after {
        content: '\\e150';
        opacity: 0.2;
      }

      .table-head .sorting_asc:after {
        content: '\\e155';
      }

      .table-head .sorting_desc:after {
        content: '\\e156';
      }

      .tab-heads {
        margin-bottom: 10px;
        display: flex;
      }
      tbody tr:hover {
        background-color: #e6f7ff;
        transition: all 0.1s linear;
      }
    `,
  ],
})
export class HuaQiaoCityRelatedFileComponent implements OnInit {
  /** 列表数据 */
  data: any[] = [];
  heads: any[];
  @Input() mainFlowId: string;
  @Input() params: any;

  /** 页码配置 */
  pageConfig = {
    pageSize: 10,
    first: 1,
    total: 0,
  };
  tabConfig: any;
  /** 部分公司选项 */
  options = [];
  paging = 0; // 共享该变量
  public supplierOperateAppId: any;

  constructor(
    private xn: XnService,
    private vcr: ViewContainerRef,
    private loading: LoadingService
  ) {}

  ngOnInit() {
    this.tabConfig = VankebusinessdataTabConfig.vankebusinessRelated;
    this.onPage({ page: this.paging });

    // 过滤所有供应商的操作日志, 登陆企业为供应商时
    if (this.xn.user.orgType === 1) {
      this.supplierAppIdSet();
    }
  }
  showFile(paramFile) {
    let paramFiles = JSON.parse(paramFile);
    if (paramFiles.length) {
      paramFiles = paramFiles[0];
    }
    return paramFiles.label ? paramFiles.label : paramFiles.fileName;
  }
  /**
   * 找出所有企业类型为供应商的 appId 合集
   */
  private supplierAppIdSet() {
    this.xn.api
      .post('/custom/vanke_v5/app/get_app', { orgName: this.xn.user.orgName })
      .subscribe((x) => {
        this.supplierOperateAppId = x.data;
      });
  }

  viewMFiles(paramFile) {
    let paramFiles = JSON.parse(paramFile);
    if (paramFiles.length) {
      paramFiles = paramFiles[0];
    }
    if (paramFiles.label) {
      const params = Object.assign({}, paramFiles, { readonly: true });
      XnModalUtils.openInViewContainer(
        this.xn,
        this.vcr,
        DragonPdfSignModalComponent,
        params
      ).subscribe();
    } else {
      XnModalUtils.openInViewContainer(
        this.xn,
        this.vcr,
        DragonMfilesViewModalComponent,
        [paramFiles]
      ).subscribe();
    }
  }

  /**
   * 下载文件 合同 图片等
   * @param paramFile 文件
   */
  public donwLoadFiles(paramFile) {
    const orgName = this.xn.user.orgName;
    const parseFile = JSON.parse(paramFile);
    const fileData = parseFile.length ? parseFile[0] : JSON.parse(paramFile);
    const fileLabel = fileData.label;
    this.xn.api.dragon
      .download('/file/downFile', {
        files: [fileData],
      })
      .subscribe((v: any) => {
        this.xn.dragon.save(v._body, `${orgName}-${fileLabel}文件.zip`);
      });
  }
  /**
   *  下载附件
   *  供应商：只能下载自己上传的文件和合同；
   *  保理商、核心企业、中介机构：下载本交易ID下所有的文件和合同。
   */
  public download() {
    this.xn.dragon
      .post('/list/main/flow_relate_file', {
        mainFlowId: this.mainFlowId,
        start: 0,
        length: Number.MAX_SAFE_INTEGER,
      })
      .subscribe((x) => {
        if (x.data && x.data.data && x.data.data.length) {
          let files = x.data.data.map((x) => JSON.parse(x[0]));
          files = XnUtils.uniqueBoth(files);
          const appId = this.xn.user.appId;
          const orgName = this.xn.user.orgName;
          const time = new Date().getTime();
          const filename = appId + '-' + orgName + '-' + time + '.zip';
          this.xn.dragon
            .download('/file/downFile', {
              files,
              mainFlowId: this.mainFlowId,
            })
            .subscribe((v: any) => {
              this.loading.close();
              this.xn.dragon.save(v._body, filename);
            });
        } else {
          this.xn.msgBox.open(false, '无可下载项');
        }
      });
  }

  /**
   * @param e  page: 新页码、 pageSize: 页面显示行数、first: 新页面之前的总行数、pageCount : 页码总数
   * @summary 采购融资，地产abs  请求api有区别，采购融资：avenger 、地产abs：api
   */
  public onPage(e?: {
    page: number;
    first?: number;
    pageSize?: number;
    pageCount?: number;
  }) {
    this.paging = e.page || 1;
    this.pageConfig = Object.assign({}, this.pageConfig, e);
    // 页面配置

    this.heads = CommUtils.getListFields(this.tabConfig.heads);

    // 构建参数

    this.xn.loading.open();
    // 采购融资 ：avenger,  地产abs ：api
    this.xn.dragon
      .post('/list/main/flow_relate_file', {
        mainFlowId: this.mainFlowId,
        start: (this.paging - 1) * this.pageConfig.pageSize,
        length: this.pageConfig.pageSize,
      })
      .subscribe(
        (x) => {
          if (x.data && x.data.data && x.data.data.length) {
            this.data = x.data.data;
            if (x.data.recordsTotal === undefined) {
              this.pageConfig.total = x.data.count;
            } else {
              this.pageConfig.total = x.data.recordsTotal;
            }
          } else if (x.data && x.data.lists && x.data.lists.length) {
            this.data = x.data.lists;
            this.pageConfig.total = x.data.count;
          } else {
            // 固定值
            this.data = [];
            this.pageConfig.total = 0;
          }
        },
        () => {
          // 固定值
          this.data = [];
          this.pageConfig.total = 0;
        },
        () => {
          this.xn.loading.close();
        }
      );
  }
  /**
   *  返回
   */
  public onCancel(): void {
    this.xn.user.navigateBack();
  }
}
