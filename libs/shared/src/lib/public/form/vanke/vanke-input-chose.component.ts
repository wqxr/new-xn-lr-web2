import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnInputOptions } from '../xn-input.options';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { HeadquartersTypeEnum } from '../../../config/select-options';

@Component({
    selector: 'vanke-select-input',
    templateUrl: './vanke-input-chose.component.html',
    styles: [
        `.xn-dselect-first { padding-right: 2px; }`,
        `.xn-dselect-second { padding-left: 2px; }`,
        `.mb15 { margin-bottom: 15px }`,
        `.col-md-12 { padding: 0px; }`
    ]
})
export class VankeTypeSelectInputComponent implements OnInit {
    @Input() row: any;
    @Input() factory?: any;
    @Input() form: FormGroup;

    required = false;
    firstClass = '';
    secondClass = '';
    alert = '';

    ctrl: AbstractControl;
    xnOptions: XnInputOptions;

    enterprise = '';
    wkType = '';
    firstOptions: any[] = [];
    secondOptions: any[] = [];

    constructor(private er: ElementRef, private xn: XnService, private localStorageService: LocalStorageService,
                private publicCommunicateService: PublicCommunicateService, ) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.required = (this.row.required === true || this.row.required === 1);
        if (!!this.ctrl.value){
            this.enterprise = this.ctrl.value.includes('{') ? JSON.parse(this.ctrl.value).enterprise : this.ctrl.value;
            this.wkType = this.ctrl.value.includes('{') ? JSON.parse(this.ctrl.value).wkType : '';
        }
        this.ctrl.valueChanges.subscribe(v => {
            this.ctrl.markAsTouched();
        });
        this.firstOptions = this.row.selectOptions;
        if (this.enterprise === '??????') {
            this.secondOptions = this.firstOptions.filter((x: any) => x.value === this.enterprise)[0].children;
        }
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    /**
     * ?????????????????????????????????
     * @param event
     */
    onFirstChange(event) {
        this.enterprise = event.target.value;
        // ???????????????????????????????????????
        this.wkType = '';
        if (this.enterprise === '') {
            this.ctrl.setValue('');
            if (this.required) {
                this.firstClass = 'xn-control-invalid';
                // this.alert = this.row.selectOptions.firstPlaceHolder;
            }
            this.secondOptions = [];
        } else {
            if (this.required) {
                this.firstClass = 'xn-control-valid';
                this.secondClass = '';
                this.alert = '';
            }
            if (this.enterprise === '??????') {
                this.secondOptions = this.firstOptions.filter((x: any) => x.value === this.enterprise)[0].children;
                this.ctrl.setValue(JSON.stringify({ enterprise: this.enterprise, wkType: this.wkType }));
            } else if (this.enterprise === HeadquartersTypeEnum[3]){
                this.secondOptions = [];
                this.ctrl.setValue(this.enterprise);
            }
        }
        this.ctrl.markAsTouched();
    }

    /**
     * ?????????????????????????????????
     * @param event
     */
    onSecondChange(event) {
        this.wkType = event.target.value;
        this.ctrl.setValue(JSON.stringify({ enterprise: this.enterprise, wkType: this.wkType }));
        this.ctrl.markAsTouched();
    }
}
