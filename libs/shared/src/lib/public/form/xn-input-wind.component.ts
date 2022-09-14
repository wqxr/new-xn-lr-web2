import {Component, OnInit, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
    selector: 'app-xn-input-wind',
    templateUrl: './xn-input-wind.component.html',
    styles: []
})
export class XnInputWindComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;

    constructor() {
    }

    ngOnInit() {
    }

}
