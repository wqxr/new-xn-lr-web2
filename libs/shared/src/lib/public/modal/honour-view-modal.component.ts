import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';
import {Observable, of} from 'rxjs';
import {CalendarData} from '../../config/calendar';
import {XnUtils} from '../../common/xn-utils';
import {PdfViewService} from '../../services/pdf-view.service';

/**
 * 查看发票信息的模态框
 */
@Component({
    templateUrl: './honour-view-modal.component.html',
    styles: [
            `.flex-row {
            display: flex;
            margin-bottom: 15px;
        }

        .this-title {
            width: 90px;
            text-align: right;
            padding-top: 7px;
        }

        .this-padding {
            padding-left: 10px;
            padding-right: 10px;
        }

        .this-flex-1 {
            flex: 1;
        }

        .this-flex-2 {
            flex: 2;
        }

        .this-flex-3 {
            flex: 3;
        }

        .xn-money-alert {
            color: #8d4bbb;
            font-size: 12px;
        }

        .xn-holiday-alert {
            color: #8d4bbb;
            font-size: 12px;
        }

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

        .edit-content {
            height: calc(100vh - 280px);
            display: flex;
            flex-flow: column;
        }

        .edit-content-flex {
            flex: 1;
            text-align: center;
            overflow: auto;
            background: #E6E6E6;
        }

        .button-group {
            float: right;
            padding: 20px 15px 0 15px;
        }
        .this-control {
            display: block;
            vertical-align: top;
            font-size: 13px;
            width: 230px;
            margin-bottom: 5px
        }
        `,
    ],
    providers: [
        PdfViewService
    ]
})
export class HonourViewModalComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('innerImg') innerImg: ElementRef;
    @ViewChild('outerImg') outerImg: ElementRef;
    @ViewChild('imgContainer') imgContainer: ElementRef;
    @ViewChild('moneyInput') moneyInput: ElementRef;

    private observer: any;

    params: any;
    fileImg: any; // 商票图像
    degree = 0;
    moneyAlert = '';
    holidayAlert = '';
    dateEndAlert = '';
    private currentScale = .6;

    constructor(private pdfViewService: PdfViewService) {
    }

    ngOnInit() {
    }

    /**
     * 打开查看窗口
     * @param params
     * @returns {any}
     */
    open(params: any): Observable<any> {
        this.params = params;

        // 显示商票图像
        if (!!params.fileId) {
            this.fileImg = `/api/attachment/view?key=${params.fileId}`;
        }

        if (this.params.honourAmount) {
            this.moneyAlert = XnUtils.convertCurrency(this.params.honourAmount)[1];
        }

        // 到期日
        if (this.params.dueDate) {
            // 计算日历
            const data = {} as any;
            data.factoringDate = this.params.dueDate;
            const controller = XnUtils.computeDay(data, CalendarData);
            this.dateEndAlert = controller.holidayAlert;
        }

        // 保理到期日
        if (this.params.factoringDate) {
            // 计算日历
            const data = {} as any;
            data.factoringDate = this.params.factoringDate;
            const controller = XnUtils.computeDay(data, CalendarData);
            this.holidayAlert = controller.holidayAlert;
        }

        this.modal.open(ModalSize.Large);

        return Observable.create(observer => {
            this.observer = observer;
        });
    }

   public onOk() {
        this.modal.close();
        this.observer.next({action: 'ok'});
        this.observer.complete();
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

}
