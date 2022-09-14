import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnService } from '../../../../../services/xn.service';
@Component({
    template: `
    <div style='width:100%'>
        <div class="form-control xn-input-font xn-input-border-radius">
            <div class="label-line">
                {{label}}
            </div>
        </div>
    </div>
    `
})
@DynamicForm({ type: 'select-file', formModule: 'dragon-show' })
export class DragonSpecialuploadShowComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;

    label = '';
    ref = '';
    fileTypeMatch = {
        深圳市龙光控股有限公司: [
            { label: '《付款确认书(总部致保理商)》', value: 1 },
            { label: '《付款确认书(总部致劵商)》', value: 2 },
        ],
        万科企业股份有限公司: [
            { label: '《付款确认书》', value: 3 },
        ],
        雅居乐集团控股有限公司: [
            { label: '《付款确认书(总部致保理商)》', value: 4 }
        ],
        碧桂园地产集团有限公司: [
            { label: '《付款确认书》', value: 3 },
        ],
        成都轨道交通集团有限公司: [
            { label: '《付款确认书》', value: 3 },
        ],
    };
    fileTypeMatchLgBoshi = {
      深圳市龙光控股有限公司: [
        { label: '《付款确认书(总部致管理人)》', value: 1 },
      ],
      龙光工程建设有限公司: [
        { label: '《付款确认书(总部致管理人)》', value: 1 },
      ],
    };
    constructor(private er: ElementRef, private xn: XnService) {
    }

    ngOnInit() {
        let cur_headquarters = '';

        const headCheckers = this.svrConfig.actions.filter((action) => {
            return action.procedureId === '@begin';
        })[0].checkers;
        const headquartersTemp = headCheckers.filter((hd) => {
            return hd.checkerId === 'headquarters';
        });
        if (headquartersTemp && headquartersTemp.length > 0 && headquartersTemp[0].data) {
            cur_headquarters = headquartersTemp[0].data;
        }

        if (this.xn.router.url.startsWith('/pslogan')) {
          // 龙光-博时资本
          this.label = this.fileTypeMatchLgBoshi[cur_headquarters][0].label;
        } else {
          this.label = this.fileTypeMatch[cur_headquarters][0].label;
        }
    }
}
