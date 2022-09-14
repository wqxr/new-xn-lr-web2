import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {FormGroup} from '@angular/forms';
import { ModalComponent, ModalSize } from '../../../common/modal/components/modal';
import { XnService } from '../../../services/xn.service';

@Component({
    templateUrl: './index.html',
    styles: [
        `.panel { margin-bottom: 0 }`,
    ]
})
export class UserDeleteRelateRightModalComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;
    private observer: any;

    params: any = {} as any;
    steped = 0;
    rows: any[] = [];
    shows: any[] = [];
    mainForm: FormGroup;
    userName = '';

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
        const params = {
            userId: this.params.userId,
            systemId: this.params.systemId,
        };

        this.xn.api.post('/useroperate2/delete_user', params)
          .subscribe(() => {
              this.close(this.params);
          });
    }
}
