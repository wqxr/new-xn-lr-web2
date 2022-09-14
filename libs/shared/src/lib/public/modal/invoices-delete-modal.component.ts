import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';
import {Observable, of} from 'rxjs';
import {XnService} from '../../services/xn.service';
import {FormGroup} from '@angular/forms';

@Component({
    templateUrl: './invoices-delete-modal.component.html',
    styles: [
        `.panel { margin-bottom: 0 }`,
    ]
})
export class InvoicesDeleteModalComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;
    private observer: any;

    params: any = {} as any;
    steped = 0;
    rows: any[] = [];
    shows: any[] = [];
    mainForm: FormGroup;
    taxpayerSegistrationNumber: any;
    id: any = {} as any;

    constructor(private xn: XnService) {
    }

    ngOnInit() {
    }

    open(params: any): Observable<string> {

        this.params = params;
        this.taxpayerSegistrationNumber = this.params.taxpayerSegistrationNumber;
        this.modal.open(ModalSize.Small);

        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    private close(value: string) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }

    cssClass(step): string {
        if (step === this.steped) { return 'current'; }
        if (step > this.steped) { return 'disabled'; }
        else { return 'success'; }
    }

    onOk() {

    }

    onSubmit() {

        this.xn.api.post('/making_invoice_info?method=delete', {
            where: {
                taxpayerSegistrationNumber: this.params.taxpayerSegistrationNumber
            }
        }).subscribe(json => {
            this.close(this.params);
        });
    }
}
