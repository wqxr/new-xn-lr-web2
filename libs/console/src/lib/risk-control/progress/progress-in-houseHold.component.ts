import {Component, Input, OnInit} from '@angular/core';
import {BigDataListModel} from '../risk-control.service';

@Component({
    selector: 'app-progress-in-house-hold',
    templateUrl: './progress-in-houseHold.component.html',
    styles: []
})
export class ProgressInHouseHoldComponent implements OnInit {
    @Input() customerInfo: BigDataListModel;
    show = '';
    item: any;

    constructor() {
    }

    ngOnInit() {
        this.show = 'home';
    }

    choose(event) {
        this.show = event.type;
        this.item = event.item;
    }
}
