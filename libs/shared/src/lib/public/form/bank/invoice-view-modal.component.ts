import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
    ModalComponent,
    ModalSize
} from 'libs/shared/src/lib/common/modal/components/modal';
import { Observable, of } from 'rxjs';
import { CalendarData } from 'libs/shared/src/lib/config/calendar';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';

/**
 * 查看发票信息的模态框
 */
@Component({
    templateUrl: './invoice-view-modal.component.html',
    styles: [
        `
            .flex-row {
                display: flex;
                margin-bottom: 15px;
            }
        `,
        `
            .this-title {
                width: 90px;
                text-align: right;
                padding-top: 7px;
            }
        `,
        `
            .this-padding {
                padding-left: 10px;
                padding-right: 10px;
            }
        `,
        `
            .this-flex-1 {
                flex: 1;
            }
        `,
        `
            .this-flex-2 {
                flex: 2;
            }
        `,
        `
            .this-flex-3 {
                flex: 3;
            }
        `,
        `
            .xn-money-alert {
                color: #8d4bbb;
                font-size: 12px;
            }
        `,
        `
            .xn-holiday-alert {
                color: #8d4bbb;
                font-size: 12px;
            }
        `,
        // `.img-container { padding: 0 20px; max-height: calc(100vh - 360px); overflow-y: scroll; }`,
        `
            .this-img {
                width: 100%;
                border: none;
            }
        `,
        `
            .button-rotate {
                position: absolute;
                top: 10px;
                cursor: pointer;
                z-index: 10;
            }
        `,
        `
            .rotate-left {
                right: 60px;
            }
        `,
        `
            .rotate-right {
                right: 10px;
            }
        `,
        `
            .row {
                padding: 0 20px;
            }
        `,
        `
            .img-container {
                max-height: calc(100vh - 440px);
                overflow-x: hidden;
                text-align: center;
                position: relative;
            }
        `,
        `
            .img-wrapper {
                transition: all 0.5s ease-in-out;
            }
        `
    ]
})
export class BankInvoiceViewModalComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('innerImg') innerImg: ElementRef;
    @ViewChild('outerImg') outerImg: ElementRef;
    @ViewChild('imgContainer') imgContainer: ElementRef;
    @ViewChild('moneyInput') moneyInput: ElementRef;

    private observer: any;

    params: any;
    fileImg: any; // 发票图像
    degree = 0;
    moneyAlert = '';
    holidayAlert = '';
    dateEndAlert = '';

    constructor() {}

    ngOnInit() {}

    /**
     * 打开查看窗口
     * @param params
     * @returns {any}
     */
    open(params: any): Observable<any> {
        this.params = params;

        // 显示商票图像
        if (!!params.files && params.files.length && !!params.files[0].fileId) {
            this.fileImg = `/api/attachment/view?key=${params.files[0].fileId}`;
        } else if (!!params.fileId) {
            this.fileImg = `/api/attachment/view?key=${params.fileId}`;
        }

        this.modal.open(ModalSize.Large);

        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    onOk() {
        this.modal.close();
        this.observer.next({ action: 'ok' });
        this.observer.complete();
    }

    rotateImg(direction: string) {
        this.degree = XnUtils.rotateImg(
            direction,
            this.degree,
            this.innerImg.nativeElement,
            this.outerImg.nativeElement,
            this.imgContainer.nativeElement
        );
    }

    onConsistent(isConsistent: boolean) {
        this.observer.next({ consistent: isConsistent });
        this.observer.complete();
        this.modal.close();
    }
}
