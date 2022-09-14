import { ChangeDetectionStrategy, Component, OnInit, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { applyFactoringTtype, HeadquartersTypeEnum } from 'libs/shared/src/lib/config/select-options';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';


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
@DynamicForm({ type: 'search-select-jd', formModule: 'dragon-input' })
export class NewGemdaleSearchSelectInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig?: any;

    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    config: any = {
        post_url: '/contract/first_contract_info/get_project',
        project_url: '/contract/first_contract_info/get_org_project', // 雅居乐一次转让合同 适用项目/适用收款单位
    };
    private ctrlFactor: AbstractControl; // 保理商


    constructor(private er: ElementRef, private xn: XnService,
        private cdr: ChangeDetectorRef,) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);

        this.ctrlFactor = this.form.get('factorName');
        // 金地一次转让合同 适用项目/适用收款单位
        if (['fitProject', 'fitDebtUnit'].includes(this.row.checkerId) && !this.ctrlFactor) {
            this.onInitOptions({ isProxy: 56 }, this.config.project_url);
        }
        // 金地提单 监听保理商值 获取对应合同组
        if (this.ctrlFactor) {
            if (this.ctrlFactor?.value) {
                this.onInitOptions({ isProxy: 56, factoringAppId: applyFactoringTtype[this.ctrlFactor.value] }, this.config.post_url);
            }
            this.ctrlFactor.valueChanges.subscribe(v => {
                this.row.selectOptions = [];
                this.ctrl.setValue('')
                if (v) {
                    this.onInitOptions({ isProxy: 56, factoringAppId: applyFactoringTtype[v] }, this.config.post_url);
                }
            })
        }

    }
    public onInitOptions(param?: any, url?: string) {
        this.xn.dragon.post(url, param).subscribe(x => {
            if (x.ret === 0 && x.data && ['fitDebtUnit'].includes(this.row.checkerId)) {
                const fitArr = x.data.fitDebtUnit || [];
                this.row.selectOptions = fitArr.map((option: any) => {
                    return { label: option, value: option };
                });
            } else if (x.ret === 0 && x.data && x.data.fitProject) {
                const fitArr = x.data.fitProject || [];
                this.row.selectOptions = fitArr.map((option: any) => {
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
