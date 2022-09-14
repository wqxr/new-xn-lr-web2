import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';
import {Observable, of} from 'rxjs';
import {XnService} from '../../services/xn.service';

@Component({
    templateUrl: './data-view-modal.component.html',
    styles: [
        `.panel { margin-bottom: 0 }`,
    ]
})
export class DataViewModalComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;
    private observer: any;
    numDataShow = [];

    constructor(private xn: XnService) {
    }

    ngOnInit() {
    }

    open(params: any): Observable<string> {

        this.numDataShow = params;
        // 处理数据
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
