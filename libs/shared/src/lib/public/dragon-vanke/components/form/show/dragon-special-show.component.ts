import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { HwModeService } from '../../../../../services/hw-mode.service';

@Component({
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
@DynamicForm({ type: 'special-text', formModule: 'dragon-show' })
export class DragonSpecialTextShowComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    label = '';
    constructor() {
    }

    ngOnInit() {
        const data = this.row.data;
        if (data) {
            this.label = data;
        }
    }
}
