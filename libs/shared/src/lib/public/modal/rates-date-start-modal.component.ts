import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';

// 付款管理打印时起息日期
@Component({
    templateUrl: './rates-date-start-modal.component.html',
    styles: [`
        .required-label::after {
            content: '*';
            display: inline-block;
            color: #c50000;
        }
    `]
})
export class RatesDateStartModalComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    private observer: any;
    public dataValue: any;

    public constructor() {
    }

    public dateInput(obj: any) {
        this.dataValue = obj.value;
    }

    public ngOnInit() {
    }

    // 确认打印
    public onSubmit() {
        this.close({action: 'ok', value: this.dataValue});
    }

    open(params: any): Observable<any> {
        this.modal.open(ModalSize.Small);
        return Observable.create(observer => {
            this.observer = observer;
        });

    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }
}
