import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';
import {Observable, of} from 'rxjs';
import {XnService} from '../../services/xn.service';
import {FormGroup} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';
import {Router} from '@angular/router';

@Component({
    templateUrl: './register-submit-list-modal.component.html',
    styles: [
        `.panel { margin-bottom: 0 }`,
        `.xn-input-font { padding-top: 5px; font-weight: normal; color: #353535; margin-right: 20px }`,
        `.panel-body { max-height: 650px; overflow-y: auto;font-size: 16px;}`,
        `.time { width: 90px }`
    ]
})
export class RegisterSubmitListModalComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;
    private observer: any;

    invoiceType: string;
    rows: any[] = [];
    mainForm: FormGroup;

    constructor(private xn: XnService, private router: Router) {
    }

    ngOnInit() {
    }

    open(params: any): Observable<string> {
        // this.params = params;
        this.invoiceType = params.taxingType;
        this.modal.open(ModalSize.Small);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    private buildChecker(rows) {
        for (const row of rows) {
            XnFormUtils.convertChecker(row);
        }
    }

    private close(value: string) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }

    onOk() {
        this.close('ok');
    }
    onCancel() {
        this.close('cancel');
    }

}
