import { Component, OnInit, ViewContainerRef, Input } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { SignContractsModalComponent } from './sign-contracts-modal.component';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'xn-sign-contracts',
    template: `
    <ng-container *ngFor="let info of contracts">
    <div class="form-group" *ngIf="!info.hide">
        <div class="col-sm-6">
        <a class="xn-click-a" (click)="showContract(info.id, info.secret)">{{info.label}}</a>
        </div>
        <div class="col-sm-3 control-desc"></div>
    </div>
    </ng-container>
    `
})
export class SignContractsComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    contracts: Array<any>;

    constructor(
        private route: ActivatedRoute,
        private xn: XnService,
        private vcr: ViewContainerRef
    ) {
        //
    }

    ngOnInit() {
        if (!this.form) {
            // 查看
            this.contracts = JSON.parse(this.row.data).contracts;
            return;
        }

        this.form.get(this.row.checkerId).reset();
        this.route.params.subscribe((params: Params) => {
            const recordId = params.id;

            this.xn.api
                .post('/llz/financing/get_contracts', {
                    recordId,
                    flowId: this.row.flowId,
                    procedureId: '@begin'
                })
                .subscribe(json => {
                    const data = json.data;
                    this.contracts = []
                        .concat(JSON.parse(data.contracts))
                        .filter(x => !x.hide);
                });
        });
    }

    showContract(id, secret) {
        const data = this.contracts.map(item => {
            return Object.assign(
                {},
                item,
                { flowId: this.row.flowId },
                { isReadonly: !!this.form }
            );
        });

        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            SignContractsModalComponent,
            data
        ).subscribe(v => {
            if (!this.form || v.action === 'cancel') {
                return;
            }

            this.form.get(this.row.checkerId).setValue(
                JSON.stringify(
                    Object.assign(
                        {},
                        { contracts: [...this.contracts] },
                        {
                            type: v.action
                        }
                    )
                )
            );
        });
    }
}
