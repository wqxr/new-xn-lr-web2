import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { ShowViewModalComponent } from '../../modal/show-view-modal.component';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';

@Component({
    selector: 'xn-bank-scan-file',
    template: `
        <app-xn-mfile-input *ngIf="show && !view;"  [row]="row" [form]="form"></app-xn-mfile-input>
        <span *ngIf="view && !show;" class="form-control xn-input-font xn-input-border-radius" style="display: inline-table">
            <div *ngFor="let item of viewsItems" style="line-height: 24px;">
                <a class="xn-click-a" (click)="onView(item)">{{item.label}}</a>
            </div>
        </span>
        <span *ngIf="!show && !view">无</span>
    `
})
export class ScanFileComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    show = false;
    view = false;

    viewsItems = [];

    constructor(
        private xn: XnService,
        private publicCommunicateService: PublicCommunicateService,
        private vcr: ViewContainerRef
    ) {
        //
    }

    ngOnInit() {
        if (!this.form) {
            // 查看
            this.show = false;
            this.view = true;

            if (this.row.data) {
                this.viewsItems = JSON.parse(this.row.data).map(x => {
                    return {
                        label: x.fileName,
                        url: `/api/attachment/view?key=${x.fileId}`
                    };
                });
            } else {
                // 无文件、线上模式
                this.view = false;
            }

            return;
        }

        this.view = false;
        this.show = true;

        const ctrl = this.form.get(this.row.name);
        ctrl.setValidators(Validators.required);

        // this.form.get('nosignContracts').valueChanges.subscribe(val => {
        //     this.show = JSON.parse(val).type === 'offline';
        //     const ctrl = this.form.get(this.row.name);
        //     ctrl.reset('');
        //     if (!this.show) {
        //         ctrl.clearValidators();
        //         this.form.get(this.row.checkerId).setErrors(null);
        //     } else {
        //         ctrl.setValidators(Validators.required);
        //     }
        // });
    }

    onView(item: any) {
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            ShowViewModalComponent,
            item
        ).subscribe(() => {});
    }
}
