import { Component, OnInit, Input } from '@angular/core';

/**
 *  定向收款托管协议变更、终止流程
 */
@Component({
    selector: 'app-flow-process-12',
    templateUrl: './flow-process-12.component.html',
    styles: [
        `.tc-15-step {margin: 0 0; border: none; color: #00b9a3}`,
        `.tc-15-step-name {max-width: 85px; line-height: 1.3; margin: 0 auto; }`,
        `.tc-15-step-arrow {top: 5px;}`,
        `.tc-15-step.col8 li { width: 19.5% }`
    ]
})
export class FlowProcess12Component implements OnInit {

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
