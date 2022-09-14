import { Component, OnInit, Input } from '@angular/core';
import { XnService } from '../../services/xn.service';

@Component({
    selector: 'app-flow-process-6',
    templateUrl: './flow-process-6.component.html',
    styles: [
        `.tc-15-step {margin: 0 0; border: none; color: #00b9a3}`,
        `.tc-15-step-name {max-width: 85px; line-height: 1.3; margin: 0 auto; }`,
        `.tc-15-step-arrow {top: 5px;}`,
        `.tc-15-step.col8 li { width: 19.5% }`
    ]
})
export class FlowProcess6Component implements OnInit {

    @Input() steped: number;

    steps = [
        { id: 1, name: '保理商预录入' },
        { id: 2, name: '供应商上传资料并签署合同' },
        { id: 3, name: '保理商审核并签署合同' },
        { id: 4, name: '交易完成' },
        { id: 8, name: '终止' },
    ];

    constructor(private xn: XnService) {
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

    trackById(item) {
        return item.id;
    }
}
