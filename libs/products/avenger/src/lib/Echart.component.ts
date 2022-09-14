
import { ElementRef } from '@angular/core';

export default class Echartstyle {
    private chart: any;
    private options: any;

    constructor(chart: any, options: any) {
        this.chart = chart;
        this.options = options;
    }
    getPic(option, elementRef) {
        const div = elementRef.nativeElement.querySelector('.charts');
        this.chart = echarts.init(div);
        this.chart.setOption(option);
    }
}


interface yAxis {
    id?: string;
    show: boolean;
    name?: string;
    gridLndex: number;
    position: string;
    nameGap: number;
    min: number;
    splitNumber: number;
    data: Object;
}
interface tooltip {
    show: string;
    axisPointer: Object;
}
