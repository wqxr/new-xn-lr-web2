import { Component, OnInit, ElementRef } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

@Component({
    templateUrl: 'index.component.html',
    styles: [
        `.oa-content-wrapper {width: 100%; margin-top: 10px;}`,
        `.oa-content-body {margin-left: 10px;}`
    ]
})
export class IndexComponent implements OnInit {

    constructor(private xn: XnService, private er: ElementRef) {
    }

    ngOnInit() {
    }
}
