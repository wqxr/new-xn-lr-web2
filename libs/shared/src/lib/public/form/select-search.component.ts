import { ChangeDetectionStrategy, Component, OnInit, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnInputOptions } from './xn-input.options';
import { XnService } from '../../services/xn.service';


@Component({
    selector: 'search-select-input',
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
export class SearchSelectInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig?: any;

    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    config: any = {
        post_url: '/contract/first_contract_info/get_org_project',
        post_url_jd: '/contract/first_contract_info/get_project'
    };
    constructor(private er: ElementRef, private xn: XnService,
        private cdr: ChangeDetectorRef,
    ) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.onInitOptions();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    public onInitOptions() {
        const params: any = { isProxy: 14 };
        const url = this.config.post_url_jd;
        this.xn.dragon.post(url, params).subscribe(x => {
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
