import {Component, OnInit, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
    selector: 'xn-input1',
    templateUrl: './xn-input1.component.html',
    styles: []
})
export class XnInput1Component implements OnInit {

    @Input() row: any;
    @Input() factory: any;
    @Input() form: FormGroup;

    constructor() {
    }

    ngOnInit() {
    }

}
