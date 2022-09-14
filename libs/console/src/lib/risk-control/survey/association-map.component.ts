import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';


/**
 *  企业关联图谱
 */
@Component({
    selector: 'app-association-map-component',
    template: `
        <div #chart class="chart-height-600"></div>
    `
})
export class AssociationMapComponent implements OnInit {
    @ViewChild('chart') chart: ElementRef;

    constructor() {
    }

    ngOnInit() {
    }


    //  企业族谱
    initChart() {
        const myChart = echarts.init(this.chart.nativeElement);
    }
}
