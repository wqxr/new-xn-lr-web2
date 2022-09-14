import { Component, OnInit, Input } from '@angular/core';
import { FlowCustom } from './config/flow.custom';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

@Component({
    selector: 'new-agile-flow-process',
    templateUrl: './flow-process.component.html',
    styles: [
        `.tc-15-step {margin: 0 0;border: none;color: #00b9a3;padding: 5px 0 10px;`,
        `.tc-15-step {margin: 0 0; border: none; color: #00b9a3}`,
        `.tc-15-step-name {max-width: 85px; line-height: 1.3; margin: 0 auto; }`,
        `.tc-15-step-arrow {top: 5px;}`,
        `.tc-15-step.col8 li { width: 19.5% }`
    ]
})
export class FlowProcessComponent implements OnInit {

    @Input() steped: number;

    steps = FlowCustom.flowProcessSteps;

    constructor(private xn: XnService) {
    }

    ngOnInit() {
    }

    cssClass(step): string {
        if (step === this.steped) {
            return 'current';
        }
        if (step > this.steped) {
            return 'disabled';
        } else {
            return 'success';
        }
    }

    trackById(item) {
        return item.id;
    }
}
