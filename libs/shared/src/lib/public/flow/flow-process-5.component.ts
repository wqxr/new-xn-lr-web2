import {Component, OnInit, Input} from '@angular/core';

/**
 *  保准-金地模式流程记录
 */
@Component({
    selector: 'app-flow-process-5',
    templateUrl: './flow-process-5.component.html',
    styles: [
            `.tc-15-step {
            margin: 0 0;
            border: none;
            color: #00b9a3
        }`,
            `.tc-15-step-name {
            max-width: 85px;
            line-height: 1.3;
            margin: 0 auto;
        }`,
            `.tc-15-step-arrow {
            top: 5px;
        }`,
            `ol > li {
            /*padding-bottom: 20px;*/
            font-size: 12px;
            width: 8%;
        }`
    ]
})
export class FlowProcess5Component implements OnInit {

    @Input() steped: number;

    constructor() {
    }

    ngOnInit() {
    }

    cssClass(step): string {
        step = step - 1;
        if (step === this.steped) {
            return 'current';
        }
        if (step > this.steped) {
            return 'disabled';
        } else {
            return 'success';
        }
    }
}
