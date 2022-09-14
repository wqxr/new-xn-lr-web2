import { ChangeDetectionStrategy, Component, OnInit, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { applyFactoringTtype } from 'libs/shared/src/lib/config/select-options';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

// 碧桂园提单-合同组
@Component({
    selector: 'new-gemdale-search-select-input',
    template: `
    <div [formGroup]="form">
        <select class="form-control xn-input-font"  [formControlName]="row.name"
            (change)="onSelectChange($event)" [ngClass]="myClass">
            <option value="">请选择</option>
            <option *ngFor="let option of row.selectOptions" value="{{option.value}}">{{option.label}}</option>
        </select>
    </div>
    <span class="xn-input-alert">{{alert}}</span>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,

})
@DynamicForm({ type: 'search-select-bgy', formModule: 'dragon-input' })
export class BgySearchSelectInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig?: any;

    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    config: any = {
        post_url: '/contract/first_contract_info/get_project',
    };
    private ctrlFactor: AbstractControl; // 保理商

    constructor(private er: ElementRef, private xn: XnService,
        private cdr: ChangeDetectorRef,) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
        // 监听保理商值 获取对应合同组
        this.ctrlFactor = this.form.get('factorName');
        this.ctrlFactor.valueChanges.subscribe(v => {
            this.row.selectOptions = [];
            this.ctrl.setValue('')
            if (v) {
                this.onInitOptions({ isProxy: 54, factoringAppId: applyFactoringTtype[v] });
            }
        })
    }

    public onInitOptions(param?: any) {
        let url = this.config.post_url;
        this.xn.dragon.post(url, param).subscribe(x => {
            if (x.ret === 0 && x.data && x.data.fitProject) {
                this.row.selectOptions = x.data.fitProject.map((option) => {
                    return { label: option, value: option };
                });
            } else {
                this.row.selectOptions = [];
            }
        }, () => {
            this.row.selectOptions = [];
        }, () => {
            this.cdr.markForCheck();
        });
    }

    public onSelectChange(e) {
        // console.log(e);
    }
}
