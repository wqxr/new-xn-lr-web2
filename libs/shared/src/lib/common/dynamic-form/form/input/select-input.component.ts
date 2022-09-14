import { ChangeDetectionStrategy, Component, OnInit, ElementRef, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { DynamicForm } from '../../dynamic.decorators';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { log } from 'util';
import { SelectOptions } from '../../../../config/select-options';


@Component({
    selector: 'dragon-select',
    templateUrl: './select-input.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,

})
@DynamicForm({ type: 'select', formModule: 'default-input' })
export class SelectInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;

    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    ctrl1: AbstractControl;
    ctrl2: AbstractControl;
    xnOptions: XnInputOptions;

    constructor(private xn: XnService, private er: ElementRef,
        private publicCommunicateService: PublicCommunicateService,
        private localStorageService: LocalStorageService) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        if (this.row.name === 'vankeAgency') {
            this.xn.dragon.post('/project_manage/agency/project_agency_list',
                { project_manage_id: this.row.value1 }).subscribe(x => {
                    if (x.ret === 0) {
                        this.row.selectOptions = x.data.rows;
                    }
                });
        } else if (this.row.name === 'disposeStatus' && this.row.flowId === 'sub_special_asset_dispose') {
            this.ctrl2 = this.form.get('isSpecialAsset');
            if (!!this.ctrl2) {
                this.row.selectOptions = String(this.ctrl2.value) === '1' ? SelectOptions.get('disputeDisposalStatus') :
                    String(this.ctrl2.value) === '2' ? SelectOptions.get('unqualifyDisposalStatus') : [];
            }
        }

        this.calcAlertClass();
        this.ctrl.valueChanges.subscribe(v => {
            if (this.form.get('cardNo')) { this.form.get('cardNo').setValue('') }// 新增中介机构-清空证件号码
            this.ctrl.markAsTouched();
            this.calcAlertClass();
            // 改变状态
            this.publicCommunicateService.change.emit(v);
        });
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    onBlur() {
        this.calcAlertClass();
    }

    private calcAlertClass() {
        // this.localStorageService.setCacheValue('headquarters', v);
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}
