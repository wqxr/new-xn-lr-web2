/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：contract-vanke-edit-modal.component
 * @summary：查看营业执照文件
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          营业执照信息       2019-03-22
 * 2.0                 zhyuanan          pdf查看           2019-03-25
 * **********************************************************************
 */

import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ModalComponent, ModalSize } from '../../common/modal/components/modal';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnFormUtils } from '../../common/xn-form-utils';
import { DragonPdfViewService } from 'libs/products/bank-puhuitong/src/lib/services/pdf-view.service';
import { XnUtils } from '../../common/xn-utils';
import { XnService } from '../../services/xn.service';
import { PdfViewService } from '../../services/pdf-view.service';

@Component({
    templateUrl: './businessLicense-view-modal.component.html',
    selector: 'business-detail-view',
    styles: [`
        .pdf-container {
            width: 100%;
            min-height: 100%;
            background: #E6E6E6;
        }

        .this-img {
            width: 60%;
            border: none;
            box-shadow: 8px 8px 15px #888888;
        }

        .this-pdf {
            border: none;
            box-shadow: 8px 8px 15px #888888;
        }

        .img-container {
            width: 100%;
            min-height: 100%;
            text-align: center;
            position: relative;
            background: #E6E6E6;
        }

        .img-wrapper {
            transition: all 0.5s ease-in-out;
        }

        .page {
            float: right;
            vertical-align: middle;
        }

        .edit-content {
            height: calc(100vh - 280px);
            display: flex;
            flex-flow: column;
        }

        .edit-content-flex {
            flex: 1;
            text-align: center;
            overflow-y: auto;
            background: #E6E6E6;
        }

        .button-group {
            float: right;
            padding: 20px 15px 0 15px;
        }

    `],
    providers: [
        PdfViewService
    ]
})
export class BusinessDetailComponent {
    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('innerImg') innerImg: ElementRef;
    @ViewChild('outerImg') outerImg: ElementRef;
    @ViewChild('imgContainer') imgContainer: ElementRef;
    public fileType: string;
    public fileSrc: string;
    public total: number;
    public pageSize = 1;
    private observer: any;
    public mainForm: FormGroup;
    public degree = 0;
    public params: any;
    public pageTitle = '';
    public isShow = false;
    private currentScale = .6; // 初始缩放
    public shows = [
        {
            title: '企业名称',
            checkerId: 'orgName',
            type: 'text',
            required: 0,
            options: { readonly: true },
            data: '',
        },
        {
            title: '统一社会信用代码',
            checkerId: 'orgCodeNo',
            type: 'text',
            required: 0,
            validators: {},
            options: { readonly: true },
            data: '',
        },
        {
            title: '企业类型',
            checkerId: 'orgType',
            required: 0,
            type: 'text',
            validators: {},
            options: { readonly: true },
            data: '',
        },
        {
            title: '成立日期',
            checkerId: 'termStart',
            required: 0,
            type: 'text',
            validators: {},
            options: { readonly: true },
            data: '',
        },
        {
            title: '住所',
            checkerId: 'address',
            required: 0,
            type: 'text',
            validators: {},
            options: { readonly: true },
            data: '',
        },
        {
            title: '营业期限',
            checkerId: 'term',
            required: 0,
            type: 'text',
            validators: {},
            options: { readonly: true },
            data: '',
        },
        {
            title: '法定代表人',
            checkerId: 'operName',
            required: 0,
            type: 'text',
            validators: {},
            options: { readonly: true },
            data: '',
        },
        {
            title: '注册资本',
            checkerId: 'registCapi',
            required: 0,
            type: 'text',
            validators: {},
            options: { readonly: true },
            data: '',
        },
        {
            title: '经营范围',
            checkerId: 'scope',
            required: 0,
            type: 'textarea',
            validators: {},
            options: { readonly: true },
            data: '',
        },
    ];
    constructor(public xn: XnService, private pdfViewService: DragonPdfViewService) {
    }

    /**
     *  打开模态框
     * @param params
     */
    open(params: any): Observable<any> {
        // console.log(params);
        this.xn.api.post('/custom/dragon/verify_business_file/detail', { orgName: params.orgName }).subscribe(x => {
            if (x.data) {
                this.shows.forEach(item => {
                    item.data = x.data[item.checkerId];
                });
                this.buildFormGroup();
            }
        });
        this.params = params;
        this.pageTitle = '营业执照审核';
        this.total = 1;
        if (params && params.businessLicenseFile) {
            this.onPage(1, params);
        }
        this.modal.open(ModalSize.XLarge);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    /**
     *  翻页查看文件
     * @param e 当先文件所在页码
     * this.pdfViewService.m_init = false; 将类的m_init值设置为false
     */
    public onPage(e: number, param: any) {
        if (typeof e !== 'number') {
            return;
        }
        this.pdfViewService.m_init = false;

        this.fileType = (JSON.parse(param.businessLicenseFile)[0].fileId.substr(-3).toLowerCase() === 'pdf') ? 'pdf' : 'img';
        if (this.fileType === 'img') {
            this.fileSrc = this.xn.file.view(JSON.parse(param.businessLicenseFile)[0]);
        } else {
            setTimeout(() => {
                this.pdfViewService.pdfToCanvas(this.xn.file.view(JSON.parse(param.businessLicenseFile)[0]));
            });
        }
    }
    onPagePdf(e) {
        if (typeof e !== 'number') {
            return;
        }
        this.pdfViewService.getTopage(e);
    }
    /**
     *  文件旋转
     * @param val 旋转方向 left:左转，right:右转
     */
    public rotateImg(val) {
        if (this.innerImg && this.innerImg.nativeElement
            && this.outerImg && this.outerImg.nativeElement
            && this.imgContainer && this.imgContainer.nativeElement
        ) {
            this.degree = this.pdfViewService.rotateImg(val, this.degree,
                this.innerImg.nativeElement, this.outerImg.nativeElement, this.imgContainer.nativeElement, this.currentScale);
        }
    }


    /**
     *  文件缩放
     * @param params 放大缩小  large:放大，small:缩小
     */
    public scaleImg(params: string) {
        if (this.innerImg && this.innerImg.nativeElement
            && this.outerImg && this.outerImg.nativeElement
            && this.imgContainer && this.imgContainer.nativeElement
        ) {
            // 缩放图片
            this.currentScale = this.pdfViewService.scaleImg(params,
                this.innerImg.nativeElement, this.outerImg.nativeElement, this.imgContainer.nativeElement);
        }
    }

    public handleCancel() {
        this.close({
            action: 'cancel'
        });
    }

    private close(value) {
        this.modal.close();
        this.pdfViewService.onDestroy();
        this.observer.next(value);
        this.observer.complete();
    }

    /**
     *  构建表单控件
     */
    private buildFormGroup() {
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.mainForm = XnFormUtils.buildFormGroup(this.shows);
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }
}
