import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    templateUrl: './avenger-interest.component.html',
    selector: 'xn-manager-interest-input',

})
export class AvengerInterestComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    public items: any[] = [];
    public Tabconfig: any;
    label: any;

    constructor() {
    }

    ngOnInit() {
        // console.info(this.row.data, 'wqwq');
        // this.label = this.row.data;
    }
}
