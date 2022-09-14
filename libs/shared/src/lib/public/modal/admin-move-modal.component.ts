import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalComponent, ModalSize } from '../../common/modal/components/modal';
import { Observable, of } from 'rxjs';
import { XnService } from '../../services/xn.service';
import { FormGroup } from '@angular/forms';
import { XnFormUtils } from '../../common/xn-form-utils';

@Component({
    templateUrl: './admin-move-modal.component.html',
    styles: [
        `.panel { margin-bottom: 0 }`,
    ]
})
export class AdminMoveModalComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;
    private observer: any;

    params: any = {} as any;
    steped = 0;
    rows: any[] = [];
    shows: any[] = [];
    mainForm: FormGroup;
    userName = '';
    userId: any = {} as any;

    constructor(private xn: XnService) {
    }

    ngOnInit() {
    }

    open(params: any): Observable<string> {

        this.rows = params;
        // this.userName = this.params.userName;
        XnFormUtils.buildSelectOptions(this.rows);
        this.buildChecker(this.rows);
        this.mainForm = XnFormUtils.buildFormGroup(this.rows);
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

    cssClass(step): string {
        if (step === this.steped) { return 'current'; }
        if (step > this.steped) { return 'disabled'; }
        else { return 'success'; }
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }
    onOk() {

    }

    onSubmit() {
        this.close({ action: 'ok' });
    }
}
