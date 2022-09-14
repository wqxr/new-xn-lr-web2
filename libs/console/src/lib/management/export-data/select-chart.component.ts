import { Component, OnInit, ViewContainerRef, Input } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { FormGroup } from '@angular/forms';


@Component({
    selector: 'app-select-chart',
    templateUrl: './select-chart.component.html',
    styles: [
        `tr { cursor: pointer }
        .chart { padding: 15px 0; border: 1px solid #ccc; overflow: visible;}
        .inchart { height: 400px; overflow-y: scroll }
        .chart-title {position: absolute; left: 13px; top: -9px; width: 60px; padding: 0px 2px; background: #fff; }`
    ]
})
export class SelectChartComponent implements OnInit {

    @Input() fields: any;
    @Input() title: any;

    rows: any[] = [];
    mainForm: FormGroup;
    shows = [];

    constructor() {
    }

    ngOnInit() {
    }

    getClass(i) {
        if (this.fields[i].activated === undefined) {
            return;
        }
        return this.fields[i].activated === true ? 'info' : '';
    }

    // 点击更新
    updateSelection(activated, i) {
        this.fields[i].activated = activated === true ? false : true;
    }
}
