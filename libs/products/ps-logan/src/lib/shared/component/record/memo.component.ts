import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'xn-pslogan-memo-component',
    templateUrl: './memo.component.html',
    styles: [
            `.xn-input-border-radius {
            border-style: dashed;
        }

        .xn-show-input-textarea {
            background-color: #ffffff;
            border-style: dashed;
            resize: none
        }`
    ]
})
export class PsLoganMemoComponent implements OnInit {

    @Input() memo: string;
    /**
     *  1=普通字符串 2=是下面的JSON字符串
     *  {
     *         operatorName: '',
     *         operatorTime: '',
     *         operatorMemo: '',
     *         reviewerName: '',
     *         reviewerTime: '',
     *         reviewerMemo: ''
     *     }
     */
    type: number;
    data: any; // 具体的数据

    constructor() {
    }

    ngOnInit() {
        const pos = this.memo.indexOf(';');
        if (pos > 0) {
            const s = this.memo.substring(0, pos).trim();
            const type = parseInt(s, 0);
            if (type >= 1 && type <= 2) {
                this.type = type;
                const data = this.memo.substring(pos + 1).trim();
                if (type === 1) {
                    this.data = data;
                } else if (type === 2) {
                    this.data = JSON.parse(data);
                }
            } else {
                this.type = 1;
                this.data = this.memo;
            }
        } else {
            this.type = 1;
            this.data = this.memo;
        }
    }
}
