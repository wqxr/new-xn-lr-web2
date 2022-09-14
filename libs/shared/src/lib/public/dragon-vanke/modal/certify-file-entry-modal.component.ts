
/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：customer-template-component.ts
 * @summary：资质录入文件选择框
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing             添加         2019-08-28
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ModalComponent, ModalSize } from '../../../common/modal/components/modal';
import { XnService } from '../../../services/xn.service';
import { Observable, of, forkJoin } from 'rxjs';
import { HwModeService } from '../../../services/hw-mode.service';
import { OperateType, MediaFileTypeEnum, OperateCertifyEnum } from '../../../config/enum/common-enum';
import { FormGroup } from '@angular/forms';
import { XnFormUtils } from '../../../common/xn-form-utils';
import { PdfViewService } from '../../../services/pdf-view.service';
import * as moment from 'moment';

@Component({
    templateUrl: `./certify-file-entry-modal.component.html`,
    styles: [`
    .modal-title{
        height:50px;
    }
    ::ng-deep .cdk-overlay-container {
        z-index: 3000;
    }
    .edit-content {
        height: calc(100vh - 280px);
        display: flex;
        flex-flow: column;
      }

      .edit-content-flex {
        flex: 1;
        text-align: center;
        overflow-y: scroll;
        background: #e6e6e6;
      }
      .page {
        float: right;
        vertical-align: middle;
      }
      .button-group {
        float: right;
        padding: 20px 15px 0 15px;
      }
      .info{
        max-height: 65vh;
        overflow: auto;
    }

    `]
})
export class CertifyFileEntryModal implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    public checkers = [
        {
            title: '发证日期',
            checkerId: 'certify_date',
            type: 'date',
            value: '',
            required: 1,
            options: { readonly: false }
        },

        {
            title: '有效期至',
            checkerId: 'certify_indate',
            type: 'date',
            required: 1,
            value: '',
            options: { readonly: false }
        },
    ];
    private observer: any;
    public mainForm: FormGroup;
    public fileType: string;
    public fileSrc = '';
    public fSrc: string;
    public params: any;
    public title = '修改资质信息';
    public total: number;
    public certificateNo = '';
    public companyName = '';
    public certify_app_name = '';
    public listInfo = [];
    public flowId = '';
    nzFilterOption = () => true;
    public certifileList = [
        {
            certify_classes: '',
            certify_grade: '',
            listOfOption: [],
            secondOption: []
        }
    ];
    public alert = '';
    public searchResult = '';//查询结果提示
    public listOfOption: Array<string> = [];
    public secondOption: Array<string> = [];
    public paramType: number;
    @ViewChild('innerImg') innerImg: ElementRef;
    @ViewChild('outerImg') outerImg: ElementRef;
    @ViewChild('imgContainer') imgContainer: ElementRef;
    public degree = 0;
    public currentScale = 1;
    get fileExt() {
        return MediaFileTypeEnum;
    }
    get OperateExt() {
        return OperateCertifyEnum;
    }

    constructor(private cdr: ChangeDetectorRef,
        private xn: XnService, private pdfViewService: PdfViewService,
        public hwModeService: HwModeService, private er: ElementRef,) {
    }

    ngOnInit(): void {
        XnFormUtils.buildSelectOptions(this.checkers);
        this.buildChecker(this.checkers);
        this.mainForm = XnFormUtils.buildFormGroup(this.checkers);

    }


    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }
    // 新增资质
    addCettify() {
        this.certifileList.push({
            certify_classes: '',
            certify_grade: '',
            listOfOption: this.listOfOption,
            secondOption: []
        })
    }
    // 点击查询，获取是否有录入过相同资质，获取公司下资质相关信息
    onSearch() {
        this.xn.api.dragon.post('/certify/certify_find_info', { appName: this.companyName, certify_code: this.certificateNo }).subscribe(x => {
            if (x.ret === 0 && x.data.length > 0) {
                const certifyClass = x.data[0].certifyClasseList;
                this.companyName = x.data[0].appName;
                this.certificateNo = x.data[0].certify_code;
                this.certify_app_name = x.data[0].certify_app_name;
                const certifyDate = moment(x.data[0].certify_date).format('YYYY-MM-DD');
                const certifyIndate = moment(x.data[0].certify_indate).format('YYYY-MM-DD');
                this.mainForm.get('certify_date').setValue(certifyDate);
                this.mainForm.get('certify_indate').setValue(certifyIndate);
                this.getCertifyClass(certifyClass);
            } else {
                this.searchResult = '已查询，无重复记录'
            }
        })
    }
    // 资质一级过滤
    search(value: string, paramIndex: number): void {
        this.xn.api.dragon.post('/certify/certify_classes_list', { certify_classes: value }).subscribe(x => {
            if (x.ret === 0) {
                this.certifileList[paramIndex].listOfOption = x.data;
                this.cdr.detectChanges();
            }
        });
    }
    // 资质一级发生改变时，二级内容接口获取
    onFirstChange(value: string, paramIndex: number) {
        this.certifileList[paramIndex].certify_grade = '';
        this.xn.api.dragon.post('/certify/certify_grade_list', { certify_classes: value }).subscribe(x => {
            if (x.ret === 0) {
                this.certifileList[paramIndex].secondOption = x.data;
            }
            this.cdr.detectChanges();
        });

    }
    // 获取资质二级
    onSecondChange(value: any, paramIndex, classesValue: string): void {
        if (!!value) {
            this.xn.api.dragon.post('/certify/certify_grade_list', { certify_classes: classesValue, certify_grade: value }).subscribe(x => {
                if (x.ret === 0) {
                    this.certifileList[paramIndex].secondOption = x.data;
                }
                this.cdr.detectChanges();
            });
        } else {
            if (!!classesValue) {
                this.xn.api.dragon.post('/certify/certify_grade_list', { certify_classes: classesValue }).subscribe(x => {
                    if (x.ret === 0) {
                        this.certifileList[paramIndex].secondOption = x.data;
                    }
                    this.cdr.detectChanges();
                });
            }
        }
    }
    // 提交
    onSubmit() {
        const certifyClasseList = this.certifileList.map(x => {
            const { certify_classes, certify_grade } = x;
            return { certify_classes, certify_grade };
        })
        let listData = { certify_file: JSON.stringify(this.params), certify_app_name: this.certify_app_name, certifyClasseList: certifyClasseList, ...this.mainForm.value, appName: this.companyName.trim(), certify_code: this.certificateNo.trim() };
        listData.certify_date = moment(listData.certify_date).valueOf();
        listData.certify_indate = moment(listData.certify_indate).valueOf();
        if (listData.certify_date >= listData.certify_indate) {
            this.xn.msgBox.open(false, '发证日期大于或者等于有效期，请确认');
            return;
        }
        this.xn.api.dragon.post('/certify/certify_check_info', listData).subscribe(x => {
            if (x.ret === 0) {
                this.modal.close();
                this.observer.next({ value: listData });
                this.observer.complete();
            }
        })
    }
    // 下载附件
    onDownload() {
        const { fileName } = this.params[0];

        this.xn.dragon
            .download('/file/downFile', {
                files: this.params,
            })
            .subscribe((v: any) => {
                this.xn.dragon.save(v._body, `${fileName}.zip`);
            });
    }
    /**
     *  翻页查看文件
     * @param e 当先文件所在页码
     * this.pdfViewService.m_init = false; 将类的m_init值设置为false
     */
    public onPage(e) {
        if (typeof e !== 'number') {
            return;
        }
        this.pdfViewService.m_init = false;
        this.fSrc = this.fileSrc[e - 1];
        let file = this.params[e - 1];
        if (typeof file === 'string') {
            file = JSON.parse(file);
        }
        this.fileType = this.getFileType(file);
        if (this.fileType === MediaFileTypeEnum.IMG) {
            this.fSrc = file.isAvenger
                ? this.xn.file.view(file)
                : this.xn.file.dragonView(file);
        } else {
            setTimeout(() => {
                file.isAvenger
                    ? this.pdfViewService.pdfToCanvas(this.xn.file.view(file))
                    : this.pdfViewService.pdfToCanvas(this.xn.file.dragonView(file));
            });
        }
    }
    // 提交限制
    valid() {
        const isCertifile = this.certifileList.some(x => x.certify_classes !== '' && x.certify_grade !== '');
        return (!isCertifile) || !this.companyName || !this.mainForm.valid || !this.certificateNo || this.alert;
    }
    // 验证输入只能是数组和字母的
    certiNoenter(event) {
        let exp = /^[A-Za-z0-9]+$/gi;
        const ok = exp.test(event.target.value.trim());
        this.alert = !ok ? '只能输入数字和字母，请重新输入' : '';
    }
    // 去除资质列表
    MinusCettify(paramIndex) {
        this.certifileList.splice(paramIndex, 1);
    }

    /**
      * 获取文件类型
      * @param file 文件
      */
    getFileType(file: any): string {
        const fileSubStr = file.fileName.substr(-3).toLowerCase();
        let fileType = '';
        if (!!!file.filePath) {
            fileType =
                fileSubStr === MediaFileTypeEnum.PDF
                    ? MediaFileTypeEnum.PDF
                    : MediaFileTypeEnum.IMG;
        } else {
            fileType =
                fileSubStr === MediaFileTypeEnum.PDF
                    ? MediaFileTypeEnum.PDF
                    : MediaFileTypeEnum.IMG;
        }
        return fileType;
    }



    /**
     *  打开模态框
     * @param params
     */
    open(params: any): Observable<any> {
        this.params = JSON.parse(params.certify_file);
        this.companyName = params.appName;
        this.certificateNo = params.certify_code;
        this.paramType = params.type;
        this.flowId = params.flowId;
        this.certify_app_name = params.certify_app_name;
        if (!!params.certify_date) {
            this.mainForm.get('certify_date').setValue(moment(params.certify_date).format('YYYY-MM-DD'));
            this.mainForm.get('certify_indate').setValue(moment(params.certify_indate).format('YYYY-MM-DD'));
        }
        const list = this.xn.api.dragon.post('/certify/certify_classes_list', {});
        forkJoin(list).subscribe((x: any) => {
            if (x[0].ret === 0) {
                this.certifileList[0].listOfOption = x[0].data;
                this.listOfOption = x[0].data;
                this.cdr.detectChanges();
                if (!!params.certifyClasseList && params.certifyClasseList.length > 0) {
                    this.getCertifyClass(params.certifyClasseList);
                }
            }
        });
        this.total = this.params.length;
        if (this.params && this.params.length > 0) {
            this.onPage(1);
        }
        this.modal.open(ModalSize.XXXLarge);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }
    onCancel() {
        this.modal.close();
    }
    // 第二次进来时，获取资质列表
    getCertifyClass(paramCertify) {
        this.certifileList = [];
        for (let i = 0; i < paramCertify.length; i++) {
            let dataList = paramCertify[i];
            this.certifileList.push({
                certify_classes: dataList.certify_classes,
                certify_grade: dataList.certify_grade,
                listOfOption: this.listOfOption,
                secondOption: []
            })
        }
        const gradeList$ = this.certifileList.map((temp) =>
            this.xn.dragon.post('/certify/certify_grade_list', {
                certify_classes: temp.certify_classes,
            })
        );
        forkJoin(gradeList$).subscribe(async (x: any) => {
            this.certifileList.forEach((item, index) => {
                item.secondOption = x[index].data;
            });
        })
    }
    /**
  *  文件旋转
  * @param val 旋转方向 left:左转，right:右转
  */
    public rotateImg(val) {
        if (
            this.innerImg &&
            this.innerImg.nativeElement &&
            this.outerImg &&
            this.outerImg.nativeElement &&
            this.imgContainer &&
            this.imgContainer.nativeElement
        ) {
            this.degree = this.pdfViewService.rotateImg(
                val,
                this.degree,
                this.innerImg.nativeElement,
                this.outerImg.nativeElement,
                this.imgContainer.nativeElement,
                this.currentScale
            );
        }
    }

    /**
     *  文件缩放
     * @param params 放大缩小  large:放大，small:缩小
     */
    public scaleImg(params: string) {
        if (
            this.innerImg &&
            this.innerImg.nativeElement &&
            this.outerImg &&
            this.outerImg.nativeElement &&
            this.imgContainer &&
            this.imgContainer.nativeElement
        ) {
            // 缩放图片
            this.currentScale = this.pdfViewService.scaleImg(
                params,
                this.innerImg.nativeElement,
                this.outerImg.nativeElement,
                this.imgContainer.nativeElement
            );
        }
    }

}
