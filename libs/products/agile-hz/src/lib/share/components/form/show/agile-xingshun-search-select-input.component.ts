import { ChangeDetectionStrategy, Component, OnInit, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';


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
@DynamicForm({ type: 'search-select-yjl', formModule: 'dragon-show' })
export class SearchSelectInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig?: any;
    label: any;

    constructor(private er: ElementRef, private xn: XnService,
        private cdr: ChangeDetectorRef,) {
    }

    ngOnInit() {
        if (!!this.row.data) {
            this.label = this.row.data;
        }
    }
}
