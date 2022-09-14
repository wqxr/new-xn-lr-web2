import { ChangeDetectionStrategy, Component, OnInit, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnService } from '../../../../../services/xn.service';


@Component({
    selector: 'qrs-select-file-show',
    template: `
    <div style='width:100%'>
        <div class="form-control xn-input-font xn-input-border-radius">
            <div class="label-line">
                {{label}}
            </div>
        </div>
    </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,

})
@DynamicForm({ type: 'qrs-select-file', formModule: 'dragon-show' })
export class QrsSelectFileShowComponent implements OnInit {
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
    };
    constructor(private er: ElementRef, private xn: XnService) {
    }

    ngOnInit() {
        this.label = QrsFileTypeEnum[this.row.data];
    }
}
enum QrsFileTypeEnum {
    /** 万科 */
    '《付款确认书》' = 3,
    /** 雅居乐 */
    // '《付款确认书(总部致保理商)》' = 4,
    /** 龙光 */
    '《付款确认书(总部致保理商)》' = 1,
    '《付款确认书(总部致劵商)》' = 2,
}
