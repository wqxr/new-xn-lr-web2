import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';

@Component({
    selector: 'xn-storage-rack-select-input',
    templateUrl: './storage-rack-select-input.component.html'
})
@DynamicForm({ type: 'storage-rack-select', formModule: 'new-agile-input' })
export class StorageRackSelectInputComponent implements OnInit {
    @Input()
    row: any;
    @Input()
    form: FormGroup;

    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    private options = [];
    public selectItems = [];

    private selectOptions = SelectOptions.get('storageRackNewAgile'); // 储架
    constructor(
        private xn: XnService,
    ) {
    }

    ngOnInit() {
        this.row.selectOptions = this.selectOptions;
        this.ctrl = this.form.get(this.row.name);
        this.calcAlertClass();

        this.ctrl.valueChanges.subscribe(() => {
            this.ctrl.markAsTouched();
            this.calcAlertClass();
        });
    }

    onBlur() {
        this.calcAlertClass();
    }

    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    private setOptions(v) {
        const options = this.selectOptions.filter(c => c.headquarters === v);
        this.buildOptions(options);
    }

    private cleanOptions() {
        this.options = [];
        this.buildOptions(this.options);
    }

    private buildOptions(options: Array<any>) {
        this.row.selectOptions = options.map(item => {
            return {
                label: item.label,
                value: item.value
            };
        });
    }
}
