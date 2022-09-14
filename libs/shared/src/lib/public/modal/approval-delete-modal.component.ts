import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';
import {Observable, of} from 'rxjs';
import {XnService} from '../../services/xn.service';
import {FormGroup} from '@angular/forms';

@Component({
    templateUrl: './approval-delete-modal.component.html',
    styles: [
            `.xn-content {
            padding-top: 7px;
            max-height: 400px;
            overflow-y: scroll;
        }

        .panel {
            margin-bottom: 0px;
        }

        @media (max-height: 1000px) {
            .xn-content {
                max-height: 400px
            }
        }

        @media (max-height: 900px) {
            .xn-content {
                max-height: 350px
            }
        }

        @media (max-height: 800px) {
            .xn-content {
                max-height: 320px
            }
        }

        @media (max-height: 700px) {
            .xn-content {
                max-height: 300px
            }
        }`,
    ]
})
export class ApprovalDeleteModalComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;
    private observer: any;

    params: any = {} as any;
    steped = 0;
    rows: any[] = [];
    shows: any[] = [];
    mainForm: FormGroup;
    cardCode: any;
    id: any = {} as any;
    content: string;

    constructor(private xn: XnService) {
    }

    ngOnInit() {
    }

    open(params: any): Observable<string> {

        this.params = params;
        this.content = this.params.content;
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

    onOk() {

    }

    onSubmit() {

        this.xn.api.post('/tool/condition_del', {
            id: this.params.id,
        }).subscribe(json => {
            this.close(this.params);
        });
    }
}
