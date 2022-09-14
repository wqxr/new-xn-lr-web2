/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：mfile-input.component
 * @summary：批量上传文件
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          上传文件         2019-03-29
 * **********************************************************************
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewContainerRef } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { DragonCfcaCustomModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/cfca-custom/dragon-cfca-custom-modal.component';
import { DragonConfigMfilesViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/config-mfiles-view-modal.component';
import { DragonViewContractModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/dragon-mfile-detail.modal';
import { DragonQrsDetailModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/dragon-qrs-detail.modal';
import { DragonMfilesViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import { DragonPdfSignModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/pdf-sign-modal.component';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { LoadingPercentService } from 'libs/shared/src/lib/services/loading-percent.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { UploadPicService } from 'libs/shared/src/lib/services/upload-pic.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { isNullOrUndefined } from 'util';
import { DynamicForm } from '../../dynamic.decorators';

declare const moment: any;

@Component({
    selector: 'dragon-xn-mfile-input',
    templateUrl: './mfile-input.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
        `.file-row-table {
            margin-bottom: 0;
            max-height: 100%;
        }

        .table-box {
            max-height: 350px;
            overflow-y: auto;
            position:relative;
            z-index:8;
        }

        .file-row-table td {
            padding: 6px;
        }

        .file-row-table button:focus {
            outline: none
        }

        .btn-position {
            position: absolute;
            right: -100px;
            top: 5px
        }

        .span-disabled-bg {
            background-color: #eee
        }
        .detailP {
            float: left;
            height: 25px;
            font-size: 14px;
            line-height: 25px;
            color: #ccc;
            margin-left: 15px;
        }
        .helpMsg {
            float: left;
            height: 25px;
            font-size: 13px;
            line-height: 25px;
            color: #F59A23;
            margin-left: 6px;
        }

        .btn-td {
            outline: 0;
            border: none;
            background: transparent;
            padding: 0;
        }
        .disabled {
            pointer-events: none;
            filter: alpha(opacity=50); /*IE滤镜，透明度50%*/
            -moz-opacity: 0.5; /*Firefox私有，透明度50%*/
            opacity: 0.5; /*其他，透明度50%*/
        }
        tbody tr{
            height:33px;
        }
        tbody tr td:nth-child(1){
            position: absolute;
            z-index: 7
        }
        .teach{
            justify-content: center;
            text-decoration: underline;
            text-align: right;
          }
          .btn-file {
            float: left;
            width: 120px;
            border-radius: 3px;
            color:#3c8dbc;
            padding: 6px 5px !important;
          }

        `
    ]
})
@DynamicForm({ type: 'dragonMfile', formModule: 'default-input' })
export class CommonMfileInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig?: any;
    @Input() mainFlowId?: string;
    @Input() step?: any;

    public label;
    public files: any[];

    public myClass = '';
    public alert = '';
    public ctrl: AbstractControl;
    public ctrl1: AbstractControl;

    public xnOptions: XnInputOptions;
    // 删除按钮的状态
    public delButtonStatus: boolean;
    public showP = true;
    imgType: any;

    constructor(private xn: XnService,
        private er: ElementRef,
        private vcr: ViewContainerRef,
        private cdr: ChangeDetectorRef,
        private loading: LoadingPercentService,
        private uploadPicService: UploadPicService,
        private publicCommunicateService: PublicCommunicateService,
        private nzModal: NzModalService,) {
    }

    ngOnInit() {
        if (this.row.checkerId === 'fileUpload') {
            this.showP = false;
        }
        this.delButtonStatus = this.row.options && this.row.options.readonly && this.row.options.readonly === true || (this.step && this.step.result_status === 1);
        this.ctrl = this.form.get(this.row.name);
        this.ctrl.statusChanges.subscribe(v => {
            this.calcAlertClass();
        });
        if (this.row.name === 'tripleAgreement') {
            this.ctrl1 = this.form.get('debtCompare');
            if (!!this.ctrl1 && !!this.ctrl1.value && JSON.parse(this.ctrl1.value).changeReason === '5') {
                this.showRow();
            } else {
                this.hideRow();
            }
            // let controls = this.form.controls[this.row.name].validator;
            this.publicCommunicateService.change.subscribe(x => {
                if (this.row.name === 'tripleAgreement' && x === '5') {
                    // this.form.controls[this.row.name].setValidators(controls);
                    // this.form.controls[this.row.name].updateValueAndValidity();
                    // this.row.required = true;
                    this.showRow();
                } else if (this.row.name === 'tripleAgreement') {
                    // this.form.controls[this.row.name].setValidators(null);
                    // this.form.controls[this.row.name].updateValueAndValidity();
                    // this.row.required = false;
                    this.hideRow();
                    // this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
                }
            });
        }
        if (!!this.row.options.fileext) {
            this.imgType = `请上传${this.row.options.fileext}文件格式的文件`;
        } else {
            this.imgType = '';
        }
        if (['sub_sh_supplementaryinfo_input', 'sub_so_supplementaryinfo_input'].includes(this.row.flowId)) {
            if (this.row.options.fileext !== 'pdf') {
                const imgLength = this.row.options.fileext?.split(',') || '';
                if (this.row.options.fileext?.includes('pdf') && imgLength.length > 1) {
                    this.imgType = '请上传图片或PDF';
                } else if (!this.row.options.fileext?.includes('pdf') && imgLength.length >= 1) {
                    this.imgType = '请上传图片';
                }
            } else {
                this.imgType = '请上传PDF';
            }
        }
        // 设置初始值
        this.files = XnUtils.jsonFileToArry(this.ctrl.value);
        this.formatLabelByFiles();
        this.calcAlertClass();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    /**
     * 上传之前校验handle
     */
    onBeforeUpload(row: any) {
      if(row?.stepId && this.files.some((file: any) => file?.isVanke)) {
        this.vankeFileHandle();
      } else {
        $(`#${row.checkerId}`).trigger('click');
      }
    }

    public onBeforeSelect(e) {
      if (e.target.files.length === 0) {
        return;
      }
      this.ctrl.markAsTouched();
      this.calcAlertClass();

    }

    public onSelect(e) {

        if (e.target.files.length === 0) {
            return;
        }
        // 交易合同只允许上传同一种类型的文件
        if (!!this.row?.stepId && this.row.stepId === 'contractStep') {
            if(this.onlyFileType(e.target.files)){
                return;
            };
        }
        const data = [];
        for (const file of e.target.files) {
            if(file.size===0){
                this.xn.msgBox.open(false,`很抱歉，您上传的${file.name}是个空文件，不能上传`);
                break;
            }
            const err = this.validateFileExt(file.name);
            if (!XnUtils.isEmpty(err)) {
                this.alert = err;
                // 把file input的值置为空，这样下次选择同一个文件还能触发这个请求
                $(e.target).val('');
                return;
            }
            data.push(file);
        }
        this.uploadImg(data, 0);
        $(e.target).val('');
    }
    /**
     *  查看合同
     * @param id
     * @param secret
     * @param label
     */
    public showContract(id: string, secret: string, label: string) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonPdfSignModalComponent, {
            id,
            secret,
            label,
            readonly: true
        }).subscribe(() => {
        });
    }

    /**
     *  上传图片
     * @param files
     * @param index
     */
    private uploadImg(files: any[], index: number) {
        if (files.length === index) {
            this.files.sort((a: any, b: any): number => {
                if (Number(a.fileName.substr(0, a.fileName.lastIndexOf('.'))) > Number(b.fileName.substr(0, b.fileName.lastIndexOf('.')))) {
                    return 1;
                } else {
                    return -1;
                }
            });
            this.setValueByFiles();
            // 已上传完毕关闭
            this.loading.close();
            return;
        }
        // 打开loading,传入上传的总数，和当前上传的图片
        this.loading.open(files.length, index);
        this.uploadPicService.compressImage(files[index], this.alert, this.row, (blob, file) => {
            const fd = new FormData();
            fd.append('checkerId', this.row.checkerId);
            // FormData.append中如果不带第三个参数，则默认filename属性为blob, file && file.name是为了检测file是否存在
            fd.append('file_data', blob, file && file.name);
            this.xn.file.dragonUpload(fd).subscribe({
                next: v => {
                    if (v.type === 'progress') {
                        this.alert = this.uploadPicService.onProgress(v.data.originalEvent);
                    } else if (v.type === 'complete') {
                        if (v.data.ret === 0) {
                            v.data.data.prevName = (file && file.name) || (blob && blob.name); // filename不存在则检测blobname
                            this.files.push(v.data.data);
                        } else {
                            this.xn.msgBox.open(false, v.data.msg);
                            // 上传失败
                        }
                        index++;
                        setTimeout(() => {
                            this.uploadImg(files, index);
                        }, 1000);
                    } else {
                        // 上传失败
                        this.xn.msgBox.open(false, v.data.msg);
                        this.loading.close();
                    }
                },
                error: errs => {
                    this.xn.msgBox.open(false, errs);
                    this.loading.close();
                },
                complete: () => {
                    this.ctrl.markAsDirty();
                    this.formatLabelByFiles();
                    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
                    this.loading.close();
                }
            });
        });
    }

    /**
     *  删除文件
     * @param file
     */
    public onRemove(file: any) {
      if(this.row?.stepId && this.files.some((file: any) => file?.isVanke)) {
        /** 万科汇融文件需弹窗提示供应商 */
        return this.vankeFileHandle();
      }
      this.xn.msgBox.open(true, '是否删除文件？', () => {
        if (this.row.options && this.row.options.others && this.row.options.others.helpMsg === 'viewMfile') { // 删除中介机构上传文件
          if (!!file.id) { // 已上传的文件
            this.xn.dragon.post('/project_manage/file_agency/delete_agency_file', { id: file.id }).subscribe(t => {
              if (t.ret === 0) {
                this.xn.file.dragonRemove(file.fileId).subscribe(json => {
                  this.delFile(file);
                });
              }
            });
          } else { // 新上传的文件
            this.xn.file.dragonRemove(file.fileId).subscribe(json => {
              this.delFile(file);
            });
          }
        } else {
          this.xn.file.remove(file.fileId, this.row.isAvenger).subscribe(json => {
            this.delFile(file);
          });
        }
      }, () => {
        return;
      });
    }

    /**
     * 删除指定file
     * @param file file
     */
    delFile(file: any) {
      for (let i = 0; i < this.files.length; ++i) {
        if (this.files[i].fileId === file.fileId) {
          this.files.splice(i, 1);
          this.setValueByFiles();
          this.ctrl.markAsDirty();
          this.calcAlertClass();
          this.formatLabelByFiles();
          break;
        }
      }
    }

    /**
        *  查看文件
        * @param paramFile
        * @param index 下标
        */
    public onView(paramFile: any, index: number): void {
        let paramFiles = [];
        if (this.row.name === 'factoringOtherFile') {
            this.xn.dragon.post('/contract_temporary/view', { mainFlowId: this.svrConfig.record.mainFlowId }).subscribe(x => {
                if (x.ret === 0) {
                    const datainfo = x.data.data;
                    datainfo.contractFile = JSON.stringify([paramFile]);
                    this.uploadPicService.viewDetail(datainfo, this.vcr, DragonViewContractModalComponent);
                }
            });
        } else if (this.row.name === 'financeFile') {
            let checkersVal = {
                astTotAmt: this.form.get('astTotAmt')?.value || '',
                bsnIncmAmt: this.form.get('bsnIncmAmt')?.value || '',
                netAst: this.form.get('netAst')?.value || '',
            };
            const file = XnUtils.parseObject(paramFile, {});
            const financeFiles = XnUtils.isEmptys(file) ? [] : [file];
            financeFiles.forEach((file) => file.isAvenger = false);
            const params = {
                checkers: [
                    { title: '资产总额:', checkerId: 'astTotAmt', type: 'money', required: false, options: { readonly: true, }, value: checkersVal.astTotAmt },
                    { title: '营业收入:', checkerId: 'bsnIncmAmt', type: 'money', required: false, options: { readonly: true, }, value: checkersVal.bsnIncmAmt },
                    { title: '所有者权益:', checkerId: 'netAst', type: 'money', required: false, options: { readonly: true, }, value: checkersVal.netAst }],
                value: { payConfimFile: financeFiles },
                copies: Number(index + 1),  // 第几行
                title: '查看财务报表',
                isShow: true,
                isAvenger: false,
                qrsType: '财务报表'
            };
            XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonQrsDetailModalComponent, params).subscribe((v) => { });
        } else if (this.row.options && this.row.options.others && this.row.options.others.helpMsg === 'viewMfile') { // 中介机构查看文件
            paramFiles = [].concat(this.files);
            XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonConfigMfilesViewModalComponent,
                {
                    paramFiles,
                    index,
                    capitalPoolId: this.row.otherValue, // 资产池
                    fileType: AgencyTypeFile[this.row.checkerId], // 中介机构文件类型
                    leftButtons: this.row.leftButtons || [],
                    rightButtons: this.row.rightButtons || []
                }
            ).subscribe(x => {

            });
        } else {
            paramFiles.push(paramFile);
            XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, paramFiles).subscribe(x => { });
        }
    }

    onViewCfca(paramFile: any, index: number) {
        let paramFiles = [].concat(this.files);
        // paramFiles.push(paramFile);
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonCfcaCustomModalComponent, paramFiles).subscribe(x => { });
    }




    /**
     *  格式化提示信息
     */
    private formatLabelByFiles() {
        if (this.files.constructor.name === 'Array') {
            if (this.files.length === 0) {
                this.label = '请点击右边按钮上传文件';
            } else {
                this.label = `已上传${this.files.length}个文件`;
            }
            this.cdr.detectChanges();
        }
    }
    private onlyFileType(files: any):boolean {
        let filesType = [];
        for (const file of files) {
            filesType.push(file.type.split('/')[0]);
        };
        filesType = Array.from(new Set(filesType));
        if (filesType.length > 1) {
            this.xn.msgBox.open(false, '请上传同一种类型的文件');
            return true;
        }else{
            return false;
        }
    }

    /**
     *  验证文件格式
     * @param s
     */
    private validateFileExt(s: string): string {
        if (!isNullOrUndefined(this.row.options)) {
            if ('fileext' in this.row.options) {
                const exts = this.row.options.fileext.replace(/,/g, '|')
                    .replace(/\s+/g, ''); // 删除所有空格
                if (s.match(new RegExp('\\.(' + exts + ')$', 'i'))) {
                    return '';
                } else {
                    return `只支持以下文件格式: ${this.row.options.fileext}`;
                }
            } else {
                return '';
            }
        } else {
            return '';
        }
    }
    private setValueByFiles() {
        if (this.files.length === 0) {
            this.ctrl.setValue('');
        } else {
            if (this.row.options && this.row.options.others && this.row.options.others.helpMsg === 'viewMfile') { // 中介机构上传 需要带上文件 id
                this.ctrl.setValue(JSON.stringify(this.files.map(v => {
                    return {
                        id: v.id,
                        fileId: v.fileId,
                        fileName: v.fileName,
                        filePath: v.filePath,
                    };
                })));
            } else {
                this.ctrl.setValue(JSON.stringify(this.files.map(v => {
                    return {
                        fileId: v.fileId,
                        fileName: v.fileName,
                        filePath: v.filePath,
                    };
                })));
                if (this.row.checkerId === 'contractUpload') {
                    this.files = [];
                }
            }
        }
        this.cdr.detectChanges();
    }


    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    private showRow(): void {
        $(this.er.nativeElement).parents('.form-group').show();
        if (!this.row.options.readonly) {
            this.ctrl.enable({ onlySelf: false, emitEvent: true });
            this.ctrl.updateValueAndValidity();
        }
    }

    private hideRow(): void {
        $(this.er.nativeElement).parents('.form-group').hide();
        if (!this.row.options.readonly) {
            this.ctrl.disable();
        }
    }

  /**
   * 万科汇融文件handle
   * @returns
   */
  vankeFileHandle() {
    this.nzModal.create({
      nzTitle: '提示',
      nzContent: '点击”确定“后，系统上甲方提供的资料将被替换，请确认',
      nzMaskClosable: false,
      nzOnOk: () => {
        this.ctrl.setValue('');
        this.files = [];
        setTimeout(() => {
          $(`#${this.row.checkerId}`).trigger('click');
        }, 0);
      },
      nzOnCancel: ()=> {
        return;
      }
    });
  }
}

// 中介机构文件类型
export enum AgencyTypeFile {
    'palnManagerFile' = 1,  // 计划管理人
    'originalOrderFile' = 2, // 原始权益人
    'lawFirmFile' = 3,  // 律师事务所
    'assetServiceOrgFile' = 4,  // 资产服务机构
    'rateOrgFile' = 5,   // 评级机构
    'hostServiceOrgFile' = 6,  // 托管服务机构
    'saleFile' = 7,  // 承销机构文件
    'accountingFirmFile' = 8,  // 会计师事务所
    'caseServiceOrgFile' = 9,  // 资金服务机构
}
