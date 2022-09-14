import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { XnInputOptions } from '../xn-input.options';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { AbstractControl, FormGroup } from '@angular/forms';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'app-calculate-service-fee',
    template: `
    <div class="inMemo" *ngIf="inMemo !== ''">{{inMemo}}</div>
    <ng-container *ngIf="!form; else f;">
        <input class="form-control xn-input-font xn-input-border-radius" [ngClass]="myClass" type="text"
            name="{{row.name}}" value="{{row.data}}" [placeholder]="row.placeholder" readonly>
    </ng-container>
    <ng-template #f>
        <div [formGroup]="form">
            <input class="form-control xn-input-font xn-input-border-radius" [ngClass]="myClass" type="text"
                    [formControlName]="row.name" [placeholder]="row.placeholder" readonly >
        </div>
    </ng-template>
    <span class="xn-input-alert">{{alert}}</span>
    `,
    styles: [
        `
            .inMemo {
                padding: 5px 0px;
                color: #f20000;
            }
            .xn-input-border-radius {
                border-style: dashed;
            }
            .xn-input-font {
                background-color: #ffffff;
                border-style: dashed;
                resize: none;
            }
        `
    ]
})
export class CalculateServiceFeeComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    inMemo = '';

    constructor(
        private er: ElementRef,
        private route: ActivatedRoute,
        private xn: XnService
    ) {}

    ngOnInit() {
        if (!this.row.placeholder) {
            this.row.placeholder = '';
            if (this.row.type === 'text' && this.row.value === 0) {
                this.row.placeholder = 0;
            }
        }

        this.inMemo =
            (!!this.row.options &&
                this.row.options !== '' &&
                this.row.options.inMemo) ||
            '';

        if (this.form) {
            this.initForm();
        }
    }

    onBlur(): void {
        this.calcAlertClass();
    }

    calcAlertClass(): void {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    private initForm() {
        this.ctrl = this.form.get(this.row.name);
        this.calcAlertClass();

        this.xnOptions = new XnInputOptions(
            this.row,
            this.form,
            this.ctrl,
            this.er
        );

        this.ctrl.valueChanges.subscribe(v => {
            this.calcAlertClass();
        });

        this.route.params.subscribe((params: Params) => {
            if (!this.ctrl.value) {
                const recordId = params.id;
                this.calculateServiceFee(recordId);
            }
        });
    }

    private calculateServiceFee(recordId) {
        this.xn.api
            .post('/llz/financing/service_fee', { recordId })
            .subscribe(json => {
                const data = json.data;
                switch (this.row.checkerId) {
                    case 'factoringFWF': {
                        this.form
                            .get('factoringFWF')
                            .setValue(data.factoringFee);
                        break;
                    }
                    case 'platformFWF': {
                        this.form.get('platformFWF').setValue(data.platformFee);
                        break;
                    }
                    default:
                        break;
                }
            });
    }
}
