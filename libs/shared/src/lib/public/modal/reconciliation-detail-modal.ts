import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalComponent, ModalSize } from '../../common/modal/components/modal';
import { XnService } from '../../services/xn.service';

// 付款管理打印时起息日期
@Component({
    templateUrl: './reconciliation-detail-modal.html',
    styles: [`
    td p span:nth-child(1){
        font-weight:bold;
        display:block;
        width:100px;
        float:left;
    }
    td p span:nth-child(2){
        display:block;
        float:left;
    }
    td p{
        border-bottom:1px solid #ccc;
    }

    `]
})
export class ReconciliationDetailModalComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    private observer: any;
    public items: [];
    public constructor(private xn: XnService) {
    }



    public ngOnInit() {

    }
    isDiffer(item: any, name: string) {
        return item.owner[name] === item.jd[name];
    }

    // 确认打印
    public onOk() {
        this.close({ action: 'ok' });
    }

    open(params: any): Observable<any> {
        this.items = params.datainfo;
        this.modal.open(ModalSize.XXLarge);
        return Observable.create(observer => {
            this.observer = observer;
        });


    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }
}
