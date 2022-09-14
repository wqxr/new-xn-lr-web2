import { Component, OnInit, ViewContainerRef, Input } from '@angular/core';
import { XnService } from '../../../../services/xn.service';
import { ActivatedRoute } from '@angular/router';
import VankebusinessdataTabConfig from '../bean/vanke-business-related';
import CommUtils from '../../../../public/component/comm-utils';
import { XnModalUtils } from '../../../../common/xn-modal-utils';
import { DragonMfilesViewModalComponent } from '../../modal/mfiles-view-modal.component';
import { DragonPdfSignModalComponent } from '../../modal/pdf-sign-modal.component';
import { XnUtils } from '../../../../common/xn-utils';
import { LoadingService } from '../../../../services/loading.service';

@Component({
  selector: 'vanke-file-related',
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
export class VankeRelatedFileComponent implements OnInit {
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
          let files = x.data.data.map((i) => JSON.parse(i[0]));
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
  //    /**
  //      *  格式化需要下载的文件
  //      * @param paramAction
  //      * @param paramFileArr
  //      */
  //     private selectFiles(paramAction, paramFileArr): Array<any> {
  //         // 所有文件子流程id（不包含保理放款和回款）
  //         const checkerFile = [];
  //         // 放款和回款的格式不一样，单独处理
  //         const checkerMoneyFile = ['factoring_loan', 'factoring_repayment'];
  //         this.params.logs.map(v => {
  //             if (v && v.flowId && (v.flowId !== 'factoring_loan' || v.flowId !== 'factoring_repayment')) {
  //                 checkerFile.push(v.flowId);
  //             }
  //         });
  //         // 其他文件信息
  //         for (const check of checkerFile) {
  //             if (paramAction && paramAction.flowId && paramAction.flowId === check) {
  //                 const checkers = JSON.parse(paramAction.checkers);
  //                 this.getCheckerFile(checkers, paramFileArr);
  //             }
  //         }

  //         for (const check of checkerMoneyFile) {
  //             if (paramAction && paramAction.flowId && paramAction.flowId === check) {
  //                 const checkers = JSON.parse(paramAction.checkers);
  //                 this.getMoneyCheckerFile(checkers, paramFileArr);
  //             }
  //         }
  //         // 合同文件
  //         if (paramAction && paramAction.contracts) {
  //             for (const contract of paramAction.contracts) {
  //                 paramFileArr.push(contract);
  //             }
  //         }
  //         // 去除重复的文件
  //         paramFileArr = XnUtils.uniqueBoth(paramFileArr);
  //         return paramFileArr;
  //     }
  //     /**
  //  * 放款和回款单独处理
  //  * @param paramCheckers
  //  * @param fileArr
  //  */
  //     private getMoneyCheckerFile(paramCheckers, fileArr) {
  //         const process = ['begin', 'operate'];
  //         for (const proce of process) {
  //             if (paramCheckers && paramCheckers[proce] && paramCheckers[proce].pic) {
  //                 for (const file of JSON.parse(paramCheckers[proce].pic)) {
  //                     file.fileTitle = proce;
  //                     fileArr.push(file);
  //                 }
  //             }
  //         }
  //         return fileArr;
  //     }
  // /**
  //  *  获取checker项中上传的文件
  //  * @param checkers 配置编辑页面的checkers
  //  * @param fileArr  所有文件属性名
  //  */
  // private getCheckerFile(checkers, fileArr): Array<any> {
  //     // 合同文件
  //     const contractArr = ['contractFile', 'contractInfo'];
  //     // 图片，pdf ,excel等格式文件
  //     const fileArrays = [
  //         'dockFile',
  //         'honourFile',
  //         'invoiceFile',
  //         'honourInfo',
  //         'invoiceInfo',
  //         'checkFile',
  //         'goodsFile',
  //         'constitutionFile',
  //         'certificateFile',
  //         'supervisorFile',
  //         'otherFile',
  //         'performanceFile', // 履约证明
  //         'proofFile',
  //         'ZDWFile',
  //         'qrs',  // 确认书
  //         'pz',   // 凭证
  //         'qrsReal',  // 实际确认书
  //         'paymentFile',  // 付款文件
  //         'receivableFile', // 应收账款文件
  //         'cotherFile',
  //         'supplyInvoice', // 补充发票文件
  //         'businessLicenseFile', // 营业执照
  //         'businessLicense',
  //         'projectLicense', // 项目公司执照
  //         'projectAuthority',
  //         'payFile',
  //         'contractFile',
  //         'companyDecision',
  //         'invoice',
  //         'otherFile',
  //         'factoringOtherFile',
  //         'checkCertFile',
  //         'dealContract',
  //         'registerCertFile',
  //         'projectBusinessLicense',
  //     ];
  //     const process = ['begin', 'operate'];
  //     for (const contract of contractArr) {
  //         for (const proce of process) {
  //             if (checkers && checkers[proce] && checkers[proce][contract]) {
  //                 for (const row of JSON.parse(checkers[proce][contract])) {
  //                     // row.files 可能是{}，[{}]
  //                     if (row.files instanceof Array) {
  //                         for (const file of row.files) {
  //                             file.fileTitle = contract;
  //                             fileArr.push(file);
  //                         }
  //                     } else {
  //                         for (const file of row.files.img) {
  //                             file.fileTitle = contract;
  //                             fileArr.push(file);
  //                         }
  //                     }
  //                 }
  //             }
  //         }
  //     }

  //     // 遍历图片
  //     for (const infile of fileArrays) {
  //         for (const proce of process) {
  //             if (checkers && checkers[proce] && checkers[proce][infile]) {
  //                 const tf = JSON.parse(checkers[proce][infile]);
  //                 if (Array.isArray(tf)) {
  //                     if (infile === 'dealContract') {
  //                         const contractFile = [];
  //                         if (typeof tf[0] === 'string') {
  //                             const isArrayList = JSON.parse(tf[0]);
  //                             isArrayList.forEach(x => {
  //                                 contractFile.push({ fileId: x.fileId, fileName: x.fileName, filePath: x.filePath });
  //                             });

  //                         } else {
  //                             for (let i = 0; i < tf.length; i++) {
  //                                 JSON.parse(tf[0].contractFile).forEach(x => {
  //                                     contractFile.push({ fileId: x.fileId, fileName: x.fileName, filePath: x.filePath });
  //                                 });
  //                             }
  //                         }
  //                         checkers[proce][infile] = JSON.stringify(contractFile);
  //                     } else if (infile === 'invoice') {
  //                         const contractFile = [];
  //                         tf.forEach(x => {
  //                             contractFile.push({ fileId: x.fileId, fileName: x.fileName, filePath: x.filePath });

  //                         });
  //                         checkers[proce][infile] = JSON.stringify(contractFile);
  //                     } else if (infile === 'performanceFile') {
  //                         const contractFile = [];
  //                         if (tf.length === 0) {
  //                             // contractFile = '';
  //                         } else {
  //                             if (tf[0].performanceFile === undefined) {
  //                                 // const isArrayList = JSON.parse(tf[0]);
  //                                 tf.forEach(x => {
  //                                     contractFile.push({ fileId: x.fileId, fileName: x.fileName, filePath: x.filePath });
  //                                 });
  //                             } else {
  //                                 for (let i = 0; i < tf.length; i++) {
  //                                     JSON.parse(tf[0].performanceFile).forEach(x => {
  //                                         contractFile.push({ fileId: x.fileId, fileName: x.fileName, filePath: x.filePath });
  //                                     });
  //                                 }
  //                             }
  //                             // contractFile = JSON.stringify(contractFile);
  //                         }
  //                         checkers[proce][infile] = JSON.stringify(contractFile);
  //                     } else if (infile === 'otherFile') {
  //                         const contractFile = [];
  //                         if (tf.length === 0) {
  //                             // contractFile = '';
  //                         } else {
  //                             if (tf[0].otherFile === undefined) {
  //                                 // const isArrayList = JSON.parse(tf[0]);
  //                                 tf.forEach(x => {
  //                                     contractFile.push({ fileId: x.fileId, fileName: x.fileName, filePath: x.filePath });
  //                                 });
  //                             } else {
  //                                 if (tf[0].otherFile !== '') {
  //                                     for (let i = 0; i < tf.length; i++) {
  //                                         JSON.parse(tf[0].otherFile).forEach(x => {
  //                                             contractFile.push({ fileId: x.fileId, fileName: x.fileName, filePath: x.filePath });
  //                                         });
  //                                     }
  //                                 }
  //                             }
  //                         }
  //                         checkers[proce][infile] = JSON.stringify(contractFile);
  //                     }

  //                     for (const file of JSON.parse(checkers[proce][infile])) {
  //                         if (file && file.fileId) {
  //                             file.fileTitle = infile;
  //                             fileArr.push(file);
  //                         }
  //                         if (file && file.files) {
  //                             for (const i of file.files.img) {
  //                                 i.fileTitle = infile;
  //                                 fileArr.push(i);
  //                             }
  //                         }
  //                     }
  //                 } else {
  //                     if (tf.fileId) {
  //                         tf.fileTitle = infile;
  //                         fileArr.push(tf);
  //                     }
  //                 }

  //             }
  //         }
  //     }
  //     return fileArr;
  // }

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
