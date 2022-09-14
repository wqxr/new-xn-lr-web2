/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：file-edit-input1-modal.component.ts
 * @summary：补充文件信息弹框，左侧信息输入，右侧批量文件查看
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          添加注释         2019-04-22
 * **********************************************************************
 */


import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {ModalComponent, ModalSize} from 'libs/shared/src/lib/common/modal/components/modal';
import {Observable, of} from 'rxjs';
import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';
import {InputModel, OutputModel, SelectItem} from '../bank-card-single-input.component';
import {HwModeService} from 'libs/shared/src/lib/services/hw-mode.service';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {PdfViewService} from 'libs/shared/src/lib/services/pdf-view.service';

@Component({
    templateUrl: './file-edit-input1-modal.component.html',
    styleUrls: ['./file-edit-input1-modal.component.css'],
    providers: [
        PdfViewService
    ]
})
export class FileEditInput1ModalComponent {

    @ViewChild('modal') modal: ModalComponent;

    @ViewChild('innerImg') innerImg: ElementRef;
    @ViewChild('outerImg') outerImg: ElementRef;
    @ViewChild('imgContainer') imgContainer: ElementRef;
    private observer: any;
    public entry: InputModel = new InputModel();
    public files: any;
    public fileSrc: string;
    public pageSize = 1;
    public total = 0;
    public fileType = '';
    public degree = 0;
    public items: any = [];
    public params: any;
    public bankLists: OutputModel[] = [];
    public bankCardItem: SelectItem[] = [];
    private currentScale = 0.6;

    public constructor(private hwModeService: HwModeService,
                       private xn: XnService,
                       private pdfViewService: PdfViewService) {
    }

    /**
     * 打开查看窗口
     * @param params
     * @returns {Observable}
     */
    open(params: any): Observable<any> {
        // 获取角色银行账号信息
        this.hwModeService.getData().subscribe(x => {
            this.bankLists = x;
            this.bankCardItem = this.hwModeService.formatData(this.bankLists);
        });
        this.params = params;
        this.entry.accountName = params.accountName;
        this.entry.bankName = params.bankName;
        this.entry.accountNumber = params.accountNumber;
        this.total = params.items.length;
        this.files = params.items;
        if (params.items.length > 0) {
            this.onPage(1);
        }
        this.modal.open(ModalSize.XLarge);

        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    /**
     * 验证输入
     */
    public isValid(): boolean {
        if (this.params.edit.required === 0) {
            return true;
        }
        return this.entry.accountName !== ''
            && this.entry.accountNumber !== ''
            && this.entry.bankName !== '';
    }

    /**
     *  切换查看文件
     * @param index 当前文件下标
     */
    public onPage(index): void {
        if (typeof index !== 'number') {
            return;
        }
        const file = this.params.items[index - 1];
        this.fileType = (file.fileId.substr(-3)
            .toLowerCase() === 'pdf') ? 'pdf' : 'img';

        if (this.fileType === 'img') {
            this.fileSrc = `/api/attachment/view?key=${file.fileId}`;
        } else {
            setTimeout(() => {
                this.pdfViewService.pdfToCanvas(`/api/attachment/view?key=${file.fileId}`);
            }, 0);
        }
    }

    /**
     *  确认
     */
    public onOk(): void {
        this.close({action: 'ok', value: this.entry});
    }

    /**
     * 取消
     */
    public onCancel(): void {
        this.close({
            action: 'cancel'
        });
    }

    public onChange(e): void {
        this.entry.accountNumber = e.target.value;
    }

    public handleInput(e): void {
        this.entry.accountNumber = e.target.value;
    }

    /**
     *  保存所有图片
     */
    public savePic(): void {
        if (this.degree === 0) {
            return this.xn.msgBox.open(false, '请旋转后再保存图片。');
        }
        const key = XnUtils.parseUrl(this.fileSrc).key || 0;
        this.xn.api.post('/attachment/image/rotate', {
            key,
            angle: this.degree
        }).subscribe(() => {
            this.xn.msgBox.open(false, '图片旋转保存成功。');
        });
    }

    /**
     *  下载所有图片
     */
    public download(): void {
        this.xn.loading.open();
        this.xn.api.download('/file/down_file', {
            files: this.files
        }).subscribe((v: any) => {
            this.xn.api.save(v._body, '申请表.zip');
            this.xn.loading.close();
        });
    }

    /**
     *  文件旋转
     * @param paramsOperate 旋转方向 left:左转，right:右转
     */
    public rotateImg(paramsOperate): void {
        if (this.innerImg
            && this.innerImg.nativeElement
            && this.outerImg
            && this.outerImg.nativeElement
            && this.imgContainer
            && this.imgContainer.nativeElement
        ) {
            this.degree = this.pdfViewService.rotateImg(paramsOperate,
                this.degree,
                this.innerImg.nativeElement,
                this.outerImg.nativeElement,
                this.imgContainer.nativeElement,
                this.currentScale);
        }
    }


    /**
     *  文件缩放
     * @param paramsOperate 放大缩小  large:放大，small:缩小
     */
    public scaleImg(paramsOperate: string): void {
        if (!paramsOperate) {
            return;
        }
        if (this.innerImg
            && this.innerImg.nativeElement
            && this.outerImg
            && this.outerImg.nativeElement
            && this.imgContainer
            && this.imgContainer.nativeElement
        ) {
            // 缩放图片
            this.currentScale = this.pdfViewService.scaleImg(paramsOperate,
                this.innerImg.nativeElement
                , this.outerImg.nativeElement,
                this.imgContainer.nativeElement);
        }
    }

    /**
     *  关闭弹窗并返回值
     * @param paramSubscribeValue
     */
    private close(paramSubscribeValue: any): void {
        this.modal.close();
        this.pdfViewService.onDestroy();
        this.observer.next(paramSubscribeValue);
        this.observer.complete();
    }

}
