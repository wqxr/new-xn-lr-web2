import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';
import {Observable, of} from 'rxjs';
import {XnService} from '../../services/xn.service';
import {FormGroup} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';
import {Router} from '@angular/router';

@Component({
    templateUrl: './log-detail-modal.component.html',
    styles: [
        `.panel { margin-bottom: 0 }`,
        `.xn-input-font { padding-top: 5px; font-weight: normal; color: #353535; margin-right: 20px }`,
        `.panel-body { max-height: 650px; overflow-y: scroll}`,
        `.time { width: 90px }`
    ]
})
export class LogDetailModalComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;
    private observer: any;

    params: any = {} as any;
    steped = 0;
    rows: any[] = [];
    shows: any[] = [];
    powerShows: any[] = [];
    mainForm: FormGroup;

    constructor(private xn: XnService, private router: Router) {
    }

    ngOnInit() {
    }

    open(params: any): Observable<string> {
        this.params = params;

        this.modal.open(ModalSize.XLarge);

        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
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
        this.close('ok');
    }

}
