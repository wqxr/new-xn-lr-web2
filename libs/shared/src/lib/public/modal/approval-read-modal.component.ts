import {Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';
import {Observable, of} from 'rxjs';
import {XnService} from '../../services/xn.service';
import {FormGroup} from '@angular/forms';
import {setTimeout} from 'core-js/library/web/timers';

@Component({
    templateUrl: './approval-read-modal.component.html',
    styles: [
        `.xn-content { max-height: 400px; overflow-y: scroll; }`,
        `.inner-content { padding-top: 7px;  } `,
        `.panel { margin-bottom: 0px; }`,

        `@media(max-height: 1000px) { .xn-content { max-height: 400px } }`,
        `@media(max-height: 900px) { .xn-content { max-height: 35px } }`,
        `@media(max-height: 800px) { .xn-content { max-height: 320px } }`,
        `@media(max-height: 700px) { .xn-content { max-height: 300px } }`,
    ]
})
export class ApprovalReadModalComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('editor') editor: ElementRef;
    private observer: any;

    params: any = {} as any;
    steped = 0;
    rows: any[] = [];
    shows: any[] = [];
    mainForm: FormGroup;
    formValid = false;
    title = '';
    content = '';

    constructor(private xn: XnService, private er: ElementRef) {
    }

    ngOnInit() {
    }

    open(params: any): Observable<string> {

        this.params = params;
        this.shows = [];
        const coreValue = {
            label: params.appName,
            value: params.appId
        };
        const key = [
            {
                title: '核心企业',
                name: 'appName'
            }, {
                title: '审批条件',
                name: 'content',
            }];

        for (const param in this.params) {
            if (this.params.hasOwnProperty(param) && key.map(v => v.name).indexOf(param) !== -1) {
                key.map(v => {
                    if (v.name === param) {
                        (v as any).content = this.params[param];
                    }
                    return v;
                });
            }
        }

        this.shows = key;

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

    cssClass(name): string {
        if (name === 'content') {
            return 'xn-content';
        } else {
            return '';
        }
    }

    onOk() {
        this.close('ok');
    }

}
