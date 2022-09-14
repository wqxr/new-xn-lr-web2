import {Component, OnInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import {ModalComponent} from '../../common/modal/components/modal';
import {Observable, of} from 'rxjs';

@Component({
    templateUrl: './html-modal.component.html',
    styles: [
        `.htmlDataRow {max-height: 450px; overflow: auto}`,
    ]
})
export class HtmlModalComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;

    showOk = true;
    showYesno = false;
    title: string;

    private observer: any;
    private observable: any;

    constructor(private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.observable = Observable.create(observer => {
            this.observer = observer;
        });
    }

    open(params: any): Observable<string> {
        if (params.type === 'yesno') {
            this.showOk = false;
            this.showYesno = true;
        } else {
            this.showOk = true;
            this.showYesno = false;
        }
        this.title = params.title;
        $('.htmlData', this.modal.element.nativeElement).html(params.html);
        this.cdr.markForCheck();

        if (params.size) {
            this.modal.open(params.size);
        } else {
            this.modal.open();
        }

        return this.observable;
    }

    private close(value: string) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }

    onOk() {
        this.close('ok');
    }

    onYes() {
        this.close('yes');
    }

    onNo() {
        this.close('no');
    }
}
