import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalComponent, ModalSize } from '../../common/modal/components/modal';
import { Observable, of } from 'rxjs';
import { XnService } from '../../services/xn.service';
import { FormGroup } from '@angular/forms';

@Component({
    templateUrl: './certInfo-change-model.component.html',
    styles: [
        ` .spanClass{
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #1F2B38;
            letter-spacing: 0;
            padding-left:40px;
        }
        .flex-row {
            display: flex;
        }
        .this-flex-1 {
            flex: 1;
        }

        .this-flex-2 {
            flex: 2;
        }
        `
    ]
})
export class CertInfoChangeModelComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;
    private observer: any;

    params: any = {} as any;
    steped = 0;
    rows: any[] = [];
    shows: any[] = [];
    mainForm: FormGroup;
    userName = '';
    userId: any = {} as any;
    mobelPhone = '';

    constructor(private xn: XnService) {
    }

    ngOnInit() {
    }

    open(params: any): Observable<string> {

        this.params = params;
        this.userName = this.params.certUserName;
        this.mobelPhone = this.params.certUserMobile;
        this.modal.open(ModalSize.Large);

        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }


    changeCert() {
        this.xn.api.post('/user/ca_send_check_sms', {}).subscribe(x => {
            if (x.ret === 0) {
                this.close({ action: 'ok' });
            }
        });
    }
    cancellationCert() {
        this.close({ action: 'no' });
    }
    cancel() {
        this.close({ action: 'cancel' });
    }

}
