import { Component, OnInit, ElementRef, Input, ViewChild } from '@angular/core';
import { ModalComponent, ModalSize } from '../../common/modal/components/modal';
import { XnService } from '../../services/xn.service';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { XnUtils } from '../../common/xn-utils';
import { XnInputOptions } from '../form/xn-input.options';
import { XnFormUtils } from '../../common/xn-form-utils';
import XnFlowUtils from '../../common/xn-flow-utils';
import { CalendarData } from '../../config/calendar';

@Component({
    templateUrl: './qrcode-view-modal.component.html',
    styles: [
        `
            .qr {
                width: 100%;
                height: 400px;
                position: relative;
            }
            .inqr {
                display: flex;
                position: absolute;
                width: 200px;
                height: 200px;
                left: 50%;
                margin-top: -100px;
                top: 50%;
                margin-left: -100px;
            }
            .box {
                width: 200px;
                height: 200px;
                overflow: hidden;
                flex: 1;
                border: 0;
                margin: 0;
                padding: 0;
                border-radius: 0;
            }
            .box img {
                width: 100%;
            }
            .box-atten {
                padding: 15px;
            }
        `
    ]
})
export class QrcodeViewModalComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;

    fileSrc = '';

    private observer: any;
    params: any;

    constructor(private xn: XnService, private er: ElementRef) {}

    ngOnInit() {}

    /**
     * 打开查看窗口
     * @param params
     * @returns {any}
     */
    open(params: any): Observable<any> {
        this.params = params;

        this.toValue();
        this.getQrcode(this.params);
        this.modal.open(ModalSize.XLarge);

        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }

    onOk() {
        this.toValue();

        this.params.action = 'ok';
        this.close(this.params);
    }

    onCancel() {
        this.close({
            action: 'cancel'
        });
    }

    toValue() {
        // if (!this.amount || this.amount === '') {
        //     return;
        // } else {
        //     this.params['amount'] = this.amount;
        //     this.params['factoryDate'] = this.factoryDate;
        //     this.params['num'] = this.num;
        // }
    }

    getQrcode(post) {
        this.xn.api.post('/ljx/qr_imge', post).subscribe(v => {
            this.fileSrc = `/api/attachment/view?key=${v.data.fileId}`;
        });
    }
}
