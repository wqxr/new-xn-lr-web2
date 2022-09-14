import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';
import {Observable, of} from 'rxjs';
import {XnService} from '../../services/xn.service';
import {FormGroup} from '@angular/forms';

@Component({
    templateUrl: './white-list-delete-modal.component.html',
    styles: [
        `.panel { margin-bottom: 0 }`,
    ]
})
export class WhiteListDeleteModalComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;
    private observer: any;

    params: any = {} as any;
    steped = 0;
    rows: any[] = [];
    shows: any[] = [];
    mainForm: FormGroup;
    userName = '';
    id: any = {} as any;

    constructor(private xn: XnService) {
    }

    ngOnInit() {
    }

    open(params: any): Observable<string> {

        this.params = params;
        this.userName = this.params.userName;
        this.modal.open(ModalSize.Large);

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

        this.id = {
            id: this.params.id
        };

        this.xn.api.post('/white_list/delete', this.id).subscribe(json => {
            this.close(this.params);
        });
        // this.close('ok');
    }
}
