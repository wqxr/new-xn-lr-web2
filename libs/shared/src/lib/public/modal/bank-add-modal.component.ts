import {Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';
import {Observable, of} from 'rxjs';
import {XnService} from '../../services/xn.service';
import {FormGroup} from '@angular/forms';

@Component({
    templateUrl: './bank-add-modal.component.html',
    styles: [
        `.panel { margin-bottom: 0 }`,
        `.form-group .input { height: 28px; line-height: normal }`,
        `.button-list { margin-bottom: 10px }`,
        `.editor { height: 300px; border: 1px solid #ddd; border-radius: 5px; overflow-y: scroll}`,
        `@media (min-width: 768px){ .col-sm-3 {width: 20%;} }`,
        `.btn-file { position: relative }`,
        `.photo-input { position: absolute; left: 0; top: 0; width: 100%; height: 100%; cursor: pointer}`,
        `.title { width: 100%; outline: none; background: none;}`,
        // 滚动条改造
        `.editor::-webkit-scrollbar {width: 10px; height: 10px;}`,
        `.editor::-webkit-scrollbar-track,.editor::-webkit-scrollbar-thumb {border-right: 1px solid transparent; border-left: 1px solid transparent; }`,
        `.editor::-webkit-scrollbar-button:start:hover{background-color:#eee;}`,
        `.editor::-webkit-scrollbar-button:end{background-color:#eee;}`,
        `.editor::-webkit-scrollbar-thumb {-webkit-border-radius: 8px; border-radius: 8px; background-color: rgba(0, 0, 0, 0.2);}`,
        `.editor::-webkit-scrollbar-corner {display: block;}`,
        `.editor::-webkit-scrollbar-track:hover {background-color: rgba(0, 0, 0, 0.15);}`,
        `.editor::-webkit-scrollbar-thumb:hover { -webkit-border-radius: 8px; border-radius: 8px; background-color: rgba(0, 0, 0, 0.5);}`

    ]
})
export class BankAddModalComponent implements OnInit {

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
    files: any[];
    articalParams: any = {} as any;
    title = '';
    content = '';
    tempInput: any = {} as any;
    bank: any = {} as any;

    constructor(private xn: XnService) {
    }

    ngOnInit() {
    }

    open(params: any): Observable<string> {

        console.log(params);

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

    onOk() {

    }

    onSubmit() {
        this.xn.api.post('/bank_card?method=post', {
            value: this.bank
        }).subscribe(json => {

            this.params.cardCode = this.bank.cardCode;
            this.params.bankName = this.bank.bankName;
            this.params.accountHolder = this.bank.accountHolder;
            this.params.bankCode = this.bank.bankCode;

            this.close(this.params);
        });
    }


}
