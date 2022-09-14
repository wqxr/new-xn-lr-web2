/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：contract-vanke-supplement-modal.component
 * @summary：万科补充信息[后补信息]
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          添加注释         2019-04-18
 * **********************************************************************
 */

import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';
import {FormGroup} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';
import {XnUtils} from '../../common/xn-utils';
import {XnService} from '../../services/xn.service';
import {PdfViewService} from '../../services/pdf-view.service';
@Component({
    selector: 'app-public-vanke-supplement-modal',
    templateUrl: './contract-vanke-supplement-modal.component.html',
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
            overflow-y: scroll;
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
export class ContractVankeSupplementModalComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('innerImg') innerImg: ElementRef;
    @ViewChild('outerImg') outerImg: ElementRef;
    @ViewChild('imgContainer') imgContainer: ElementRef;
    private observer: any;
    public moneyAlert: string;
    public fileType: string;
    public fileSrc: string;
    public total: number;
    public pageSize = 1;
    public mainForm: FormGroup;
    public shows: any[];
    public degree = 0;
    public params: any;
    public pageTitle = '';
    public buttonStatus = false;
    public currentScale = .6;

    public constructor(private xn: XnService, private pdfViewService: PdfViewService) {
    }

    public ngOnInit() {
    }

    open(params: any): Observable<any> {
        this.params = params;
        this.total = this.params.files.length;
        this.buildForm(this.params.data);
        if (this.total > 0) {
            this.onPage(1);
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
    public onPage(e) {
        if (typeof e !== 'number') {
            return;
        }
        this.pdfViewService.m_init = false;
        const file = this.params.files[e - 1];
        this.fileType = (file.fileId.substr(-3).toLowerCase() === 'pdf') ? 'pdf' : 'img';

        if (this.fileType === 'img') {
            this.fileSrc = `/api/attachment/view?key=${file.fileId}`;
        } else {
            setTimeout(() => {
                this.pdfViewService.pdfToCanvas(`/api/attachment/view?key=${file.fileId}`);
            });
        }
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
        this.close(null);
    }

    public handleSubmit() {
        const params = {
            mainFlowId: this.params.data.mainFlowId, // 必填
            contractSignTime: this.mainForm.value.contractSignTime.value,
            contractTemporary: this.mainForm.value.contractSignTime.state, // 必填, true为暂无，false则是有时间
            cumulativelyOutputValue: this.mainForm.value.cumulativelyOutputValue.value, // 当cumulativelyTemporary为false，必填
            cumulativelyTemporary: this.mainForm.value.cumulativelyOutputValue.state
        };
        this.xn.api.post(this.params.post_api, params).subscribe(() => {
            this.close({
                action: 'ok'
            });
        });
    }

    /**
     * 补录下一笔交易的数据
     */
    public nextTransaction(): void {
        this.buttonStatus = true;
        const params = {
            mainFlowId: this.params.data.mainFlowId, // 必填
            contractSignTime: this.mainForm.value.contractSignTime.value,
            contractTemporary: this.mainForm.value.contractSignTime.state, // 必填, true为暂无，false则是有时间
            cumulativelyOutputValue: this.mainForm.value.cumulativelyOutputValue.value, // 当cumulativelyTemporary为false，必填
            cumulativelyTemporary: this.mainForm.value.cumulativelyOutputValue.state
        };
        if (this.params.tab.value === 'do_down' && params.contractTemporary !== params.cumulativelyTemporary) {
            this.params.currentIndex = this.params.currentIndex + 1;

        }
        this.xn.api.post(this.params.post_api, params)
            .subscribe(() => {
                const get_params = Object.assign({},
                    this.params.searchParams,
                    {start: this.params.currentIndex, length: 1});
                this.xn.api.post(this.params.get_api, get_params)
                    .subscribe(x => {
                        if (x.data && x.data.lists && x.data.lists.length) {
                            // 获取成功，重新构造数据 this.params
                            this.shows = []; // 重置shows
                            this.params.data = x.data.lists[0];
                            this.params.files =
                                [].concat(XnUtils.transFormFilesConData(this.params.data.contractFile),
                                    XnUtils.transFormFilesConData(this.params.data.AppointFile),
                                    XnUtils.transFormFilesConData(this.params.data.otherFiles));
                            this.total = this.params.files.length;
                            if (this.total > 0) {
                                this.onPage(1);
                            }
                            setTimeout(() => {
                                this.buildForm(this.params.data);
                            }, 0);
                        } else {
                            this.xn.msgBox.open(false, '暂无数据', () => {
                                this.close({
                                    action: 'ok'
                                });
                            });
                        }
                    });

            }, (e) => {
            }, () => {
                setTimeout(() => {
                    this.buttonStatus = false;
                }, 2000);
            });
    }

    private close(value) {
        this.modal.close();
        this.pdfViewService.onDestroy();
        this.observer.next(value);
        this.observer.complete();
    }


    private buildForm(data) {
        this.shows = this.params.checkers.sort((a: any, b: any) => a.number > b.number);
        this.shows.forEach(show => {
            show.value = data[show.checkerId];
            if (show.checkerId === 'contractSignTime') { // 金额
                show.options.disabled = data.contractTemporary === 1 ? true : false;
            }
            if (show.checkerId === 'cumulativelyOutputValue') { // 时间
                show.options.disabled = data.cumulativelyTemporary === 1 ? true : false;
            }
        });
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
