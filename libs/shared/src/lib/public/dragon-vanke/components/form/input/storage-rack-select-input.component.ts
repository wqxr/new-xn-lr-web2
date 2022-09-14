import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnService } from '../../../../../services/xn.service';
import { SelectOptions } from '../../../../../config/select-options';
import { XnFormUtils } from '../../../../../common/xn-form-utils';


@Component({
    selector: 'xn-storage-rack-select-input',
    templateUrl: './storage-rack-select-input.component.html'
})
@DynamicForm({ type: 'storage-rack-select', formModule: 'dragon-input' })
export class StorageRackSelectInputComponent implements OnInit {
    @Input()
    row: any;
    @Input()
    form: FormGroup;
    ctrl1: AbstractControl;

    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    private options = [];
    public selectItems = [];

    private selectOptions = SelectOptions.get('storageRackDragon'); // 储架
    constructor(
        private er: ElementRef,
        private xn: XnService,
    ) {
    }

    ngOnInit() {
        this.row.selectOptions = [];
        this.ctrl = this.form.get(this.row.name);
        this.ctrl1 = this.form.get('headquarters');
        this.calcAlertClass();
        if (!!this.ctrl1) {
            this.ctrl1.valueChanges.subscribe(x => {
                if (x !== '') {
                    if (this.row.show !== undefined) {
                        this.xn.dragon.post('/project_manage/old_pool/get_project_list',
                            { headquarters: this.ctrl1.value }).subscribe(x => {
                                this.selectItems = [];
                                x.data.forEach(z =>
                                    this.selectItems.push({ label: z.projectName, value: z.storageRack, project_manage_id: z.project_manage_id })
                                );
                                this.row.selectOptions = this.selectItems;
                                this.ctrl.markAsTouched();
                            });
                    }
                }

            });
        }

        this.ctrl.valueChanges.subscribe(v => {

            this.ctrl.markAsTouched();
            this.calcAlertClass();
        });
        if (this.row.show === undefined) {
            this.initOptions();
        }
    }

    onBlur() {
        if (this.row.show !== undefined) {
            const choseProjectInfo = this.selectItems.filter((x: any) => x.value === this.ctrl.value);
            this.ctrl.setValue(choseProjectInfo);
        }
        this.calcAlertClass();
    }

    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    private initOptions() {
        // 若有交易模式控件，则与其联动
        const isProxy = this.form.get('isProxy');
        if (isProxy) {
            isProxy.valueChanges.subscribe(() => {
                this.cleanOptions();
            });
        } else {
            this.row.selectOptions = this.selectOptions;
        }

        // 若有总部公司控件，则与其联动
        const headquarters = this.form.get('headquarters');
        if (headquarters) {
            headquarters.valueChanges.subscribe((v) => {
                this.setOptions(v);
            });
        } else {
            this.row.selectOptions = this.selectOptions;
        }
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
