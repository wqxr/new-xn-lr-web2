import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';
import {Observable, of} from 'rxjs';
import {XnService} from '../../services/xn.service';
import {Router} from '@angular/router';

@Component({
    templateUrl: './honour-detail-modal.component.html',
    styles: [
        `.panel { margin-bottom: 0 }`,
    ]
})
export class HonourDetailModalComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;
    private observer: any;

    params: any = {} as any;
    data: any = {} as any;

    constructor(private xn: XnService, private router: Router) {
    }

    ngOnInit() {
    }

    open(params: any): Observable<string> {

        this.data = params;
        this.data && this.data.platformSeq ? '' : this.data.platformSeq = '该商票为核心企业手动出票';

        switch (this.data.isUseQuota) {
            case 0:
                this.data.isUseQuota = '不可融资';
                break;
            case 1:
                this.data.isUseQuota = '可融资';
                break;
            case 2:
                this.data.isUseQuota = '已融资';
                break;
        }

        this.modal.open(ModalSize.Large);

        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    close() {
        this.modal.close();
    }

}
