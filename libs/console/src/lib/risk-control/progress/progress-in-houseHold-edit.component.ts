import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

/**
 *  客户访谈-编辑页
 */

@Component({
    selector: 'app-progress-in-house-hold-edit',
    templateUrl: './progress-in-houseHold-edit.component.html',
    styles: [
        `
        .title {
            padding: 10px 0px;
            font-weight: bold
        }

        .title .text {
            font-size: 16px;
        }

        .deal {
            margin-bottom: 50px;
        }

        table th, table td {
            text-align: center;
        }

        .info {
            font-size: 16px;
            border: 1px solid #eee;
            background-color: #eee;
            padding: 10px 15px;
            margin-bottom: 15px
        }

        .label-text {
            width: 180px;
            padding-right: 20px;
            line-height:34px;
        }
        .required-star:after{
            content:'*';
            color:red;
        }

        .flex {
            display: flex;
        }

        .label-input {
            flex: 1;
        }
        .span-required{
            color:red;
        }
        `
    ]
})
export class ProgressInHouseHoldEditComponent implements OnInit {

    @Output() onChange: EventEmitter<any> = new EventEmitter(false);
    staff = [
        [10001, '小黑', '有效'],
        [10002, '小白', '有效'],
        [10003, '小红', '无效']
    ];

    followUp = [
        {
            name: '小明',
            number: '011223',
            contract: '13511111111',
        },
        {
            name: '小红',
            number: '011223',
            contract: '13511111111',
        },
        {
            name: '小明黑',
            number: '011223',
            contract: '13511111111',
        },
    ];

    beFollowUp = [
        {
            name: '小明',
            job: '董事长',
            contract: '13511111111',
        },
        {
            name: '小红',
            job: '总裁',
            contract: '13511111111',
        },
        {
            name: '小明黑',
            job: '经理',
            contract: '13511111111',
        },
    ];

    constructor(private xn: XnService) {
    }

    ngOnInit() {

    }

    onBack() {
        this.onChange.emit('home');
    }
}
