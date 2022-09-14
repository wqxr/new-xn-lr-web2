import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { FileAdapterService } from 'libs/shared/src/lib/services/file-adapter.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ShangHaiMfilesViewModalComponent } from '../../../modal/mfiles-view-modal.component';
import { ShowModalService } from '../../../services/show-modal.service';
import { MFileViewerService } from '../../mfile-viewer/mfile-viewer.service';
import { AntResultModalComponent } from '../../result-modal/ant-result-modal.component';

@Component({
  selector: 'lib-ant-files-input',
  template: `
    <div [formGroup]="form">
      <nz-space nzDirection="horizontal" *ngIf="!!files.length; else empty">
        <nz-space-item>
          <a href="javaScript:void(0)" (click)="onClick('viewFiles')">
            <i nz-icon nzType="folder-view" nzTheme="outline"></i>查看
          </a>
        </nz-space-item>
        <nz-space-item>
          <nz-spin [nzTip]="nzTip" [nzSpinning]="isSpinning" [nzDelay]="500">
            <a href="javaScript:void(0)" (click)="onClick('download')">
              <i nz-icon nzType="cloud-download" nzTheme="outline"></i>下载
            </a>
          </nz-spin>
        </nz-space-item>
      </nz-space>
      <ng-template #empty>
        <span class="input-text">无</span>
      </ng-template>
    </div>
    <span class="xn-input-alert">{{ alert }}</span>
  `,
  styles: [
    `
      ::ng-deep .ng2-pdf-viewer-container {
        overflow-x: unset !important;
      }
      .input-text {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #1f2b38;
        font-weight: bold;
      }
    `,
  ],
})
@DynamicForm({ type: 'ant-files', formModule: 'dragon-input' })
export class AntFilesInputComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;

  nzTip = '';
  isSpinning = false;
  myClass = '';
  alert = '';
  ctrl: AbstractControl;
  xnOptions: XnInputOptions;
  files: any[] = [];
  constructor(
    private er: ElementRef,
    private xn: XnService,
    private router: Router,
    private vcr: ViewContainerRef,
    private showModalService: ShowModalService,
    private fileAdapter: FileAdapterService,
    private mFileViewerService: MFileViewerService
  ) {}

  ngOnInit() {
    // console.log(this.row);
    this.ctrl = this.form.get(this.row.name);
    this.files = XnUtils.parseObject(this.row.value, []);
    this.calcAlertClass();
    this.ctrl.valueChanges.subscribe((v) => {
      this.calcAlertClass();
    });
    this.xnOptions = new XnInputOptions(
      this.row,
      this.form,
      this.ctrl,
      this.er
    );
  }

  onClick(type: string) {
    if (type === 'viewFiles') {
      this.viewFiles(this.files, false);
    } else if (type === 'download') {
      this.downloadFiles(this.files);
    }
  }

  // 查看文件-图片、pdf
  // viewFiles(files: any) {
  //     // console.log('viewFiles-----------', files);
  //     const filesArr = files.map((x: any) => {
  //         return {
  //             ...x,
  //             url: this.fileAdapter.XnFilesView(x, 'dragon')
  //         };
  //     });
  //     const param = {
  //         nzTitle: '文件查看',
  //         nzWidth: 1100,
  //         nzFooter: true,
  //         nzMaskClosable: false,
  //         nzClosable: true,
  //         filesList: {
  //             files: !!filesArr.length ? filesArr : [{ fileId: '', fileName: '', filePath: '', url: '' }],
  //             showTools: true,
  //             width: '100%'
  //         },
  //         buttons: {
  //             left: [],
  //             right: [
  //                 { label: '关闭', btnKey: 'cancel', type: 'normal' }
  //             ]
  //         }
  //     };
  //     this.mFileViewerService.openModal(param).subscribe((x: any) => {});
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
  downloadFiles(files: any[]) {
    // console.log('downloadFiles------', files);
    if (['sh_vanke_bank_verify', 'so_bank_verify'].includes(this.row.flowId)) {
      if (files && files.length === 1) {
        this.fileAdapter.saveFile(
          files[0],
          `${FilesName[this.row.checkerId]}-${files[0]?.fileName}`,
          'dragon'
        );
      } else {
        const param = {
          mainFlowId: this.svrConfig.record?.mainFlowId,
          fileType: FilesType[this.row.checkerId],
        };
        this.isSpinning = true;
        this.xn.dragon
          .download(`/shanghai_bank/${this.svrConfig.record.flowId?.substring(0, 2)}_supplier/shFlowFileDown`, param)
          .subscribe({
            next: (v: any) => {
              if (!!v && !!v.ret && v.ret !== 0) {
                this.showPostError(v);
              } else if (!!v && !!v._body) {
                this.xn.api.save(
                  v._body,
                  `${this.svrConfig?.debtUnit}-${
                    FilesName[this.row.checkerId]
                  }.zip`
                );
              }
            },
            error: (err: any) => {
              console.error('err', err);
            },
            complete: () => {
              this.isSpinning = false;
            },
          });
      }
    } else {
      // TODO
    }
  }

  calcAlertClass(): void {
    this.myClass = XnFormUtils.getClass(this.ctrl);
    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
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
enum FilesName {
  creditPublicityFile = '国家企业信用公示文件',
  enterpriseExecutorFile = '企业被执行人查询文件',
  litigationFile = '诉讼说明文件',
  checkCertFile = '查询证明文件',
  registerCertFile = '登记证明文件',
}
enum FilesType {
  /** 国家企业信用公示文件 */
  creditPublicityFile = 'creditPublicityFile',
  /** 企业被执行人查询文件 */
  enterpriseExecutorFile = 'executedFile',
  /** 诉讼说明文件 */
  litigationFile = 'litigationFile',
  /** 查询证明文件 */
  checkCertFile = 'assetFile',
  /** 登记证明文件 */
  registerCertFile = 'registerFile',
}
