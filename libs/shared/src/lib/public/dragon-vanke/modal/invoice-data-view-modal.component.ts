import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable, of} from 'rxjs';
import { ModalComponent, ModalSize } from '../../../common/modal/components/modal';
import { XnService } from '../../../services/xn.service';


@Component({
    templateUrl: 'invoice-data-view-modal.component.html',
    styles: [
        `.invoice { display:inline-block;min-width:150px;padding:10px;margin:10px; }`,
    ]
})
export class DragonInvoiceDataViewModalComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;
    private observer: any;
    numDataShow = [];

    constructor(private xn: XnService) {
    }

    ngOnInit() {
    }

    open(params: any): Observable<string> {

        this.numDataShow = params;
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
        this.close('ok');
    }

    onSubmit() {

    }
}
