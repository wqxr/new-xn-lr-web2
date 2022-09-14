import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'xn-show-label',
    template: `
<div class='xn-control-desc'>
    <span class='infoclass'>
    {{row.value}}
    </span>
    </div>


    `,
    styles: [
        `
          .infoclass{
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #1F2B38;
          }
          .textclass{
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #4C5560;
          }
        `
    ]
})
export class LabelInfoComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    public ngOnInit() {

    }

}
