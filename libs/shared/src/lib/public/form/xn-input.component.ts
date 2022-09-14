import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {InputTableComponent} from './avenger/xn-input-tabel.component';

@Component({
    selector: 'xn-input',
    templateUrl: './xn-input.component.html',
    styles: []
})
export class XnInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig?: any;
    @ViewChild(InputTableComponent)
    private getdatalist: InputTableComponent;
    memo: any;


    constructor() {
    }

    ngOnInit() {
        this.memo = this.initMemo(this.row.options);
    }

    private initMemo(val): string {
        if (!val) {
            return '';
        } else {
            if (typeof val === 'string' && val !== '') {
                return JSON.parse(val).memo;
            }
            return val.memo;
        }
    }

    public gettabledatalist() {
        return this.getdatalist.getDatalist();
    }
}
