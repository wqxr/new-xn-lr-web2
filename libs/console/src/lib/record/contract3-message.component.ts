import {Component, OnInit, Input, ViewContainerRef} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';

@Component({
    selector: 'xn-contract3-message',
    templateUrl: './contract3-message.component.html',
    styles: [
        `.text p { margin: 0; }`
    ]
})
export class Contract3MessageComponent implements OnInit {


    rows: any[] = [];

    constructor(private xn: XnService, private vcr: ViewContainerRef) {
    }

    ngOnInit() {

    }

}
