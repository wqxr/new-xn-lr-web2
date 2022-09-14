import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable, of} from 'rxjs';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {ModalComponent, ModalSize} from 'libs/shared/src/lib/common/modal/components/modal';

/**
 * 查看发票信息的模态框
 */
@Component({
    templateUrl: './invoice-replace-view-modal.component.html',
    styles: [
            `
            @media screen and (min-height: 1000px) {
                .xn-content {
                    max-height: 600px
                }
            }

            @media (max-height: 1000px) {
                .xn-content {
                    max-height: 600px
                }
            }

            @media (max-height: 900px) {
                .xn-content {
                    max-height: 350px
                }
            }

            @media (max-height: 800px) {
                .xn-content {
                    max-height: 320px
                }
            }

            @media (max-height: 700px) {
                .xn-content {
                    max-height: 300px
                }
            }

            .xn-content {
                overflow-y: auto
            }`,
    ]
})
export class InvoiceReplaceViewModalComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;

    public items: any = [];
    private observer: any;

    constructor(private xn: XnService) {
    }

    ngOnInit() {
    }

    /**
     * 打开窗口
     * @param params
     * @returns {any}
     */
    open(params: any): Observable<any> {
        this.xn.api.post(`/custom/direct_v3/project/check_invoice_info`, params)
            .subscribe(v => {
                this.items = v.data;
            });
        this.modal.open(ModalSize.Large);
        return Observable.create(observer => {
            this.observer = observer;
        });

    }

    onOk() {
        this.modal.close();
        this.observer.next({action: 'ok'});
        this.observer.complete();
    }
}
