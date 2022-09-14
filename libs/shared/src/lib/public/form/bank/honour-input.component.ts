import {
    Component,
    ViewChild,
    OnInit,
    ViewContainerRef,
    Input
} from '@angular/core';
import { HonourInputComponent } from '../honour-input.component';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { BankHonourNewModalComponent } from './honour-new-modal.component';
import { FormGroup } from '@angular/forms';
import { BankHonourViewModalComponent } from './honour-view-modal.component';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';

@Component({
    selector: 'xn-bank-honour',
    template: '<xn-honour-input></xn-honour-input>'
})
export class BankHonourInputComponent implements OnInit {
    @ViewChild(HonourInputComponent) honourInputComponent: HonourInputComponent;

    @Input() row: any;
    @Input() form: FormGroup;
    mode: string;

    constructor(
        private xn: XnService,
        private vcr: ViewContainerRef,
        private publicCommunicateService: PublicCommunicateService
    ) {}

    ngOnInit() {
        this.mode = this.row.options.mode;

        this.honourInputComponent.row = this.row;
        this.honourInputComponent.form = this.form;
        this.honourInputComponent.onNew = this.onNew.bind(this);
        this.honourInputComponent.onView = this.onView.bind(this);

        if (this.form && this.row && this.row.value) {
            setTimeout(() => {
                const ctrl = this.form.get(this.row.name);
                ctrl.reset();
                ctrl.setValue(JSON.stringify(JSON.parse(this.row.value)));
                ctrl.markAsTouched();
                // alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
            }, 0);
        }

        this.publicCommunicateService.change.subscribe(value => {
            if (value && value.honourInvalid) {
                // “新增商票”时，提交商票有误，则该商票信息不被添加到列表
                const ctrl = this.form.get(this.row.name);
                ctrl.reset();

                this.honourInputComponent.items.splice(
                    this.honourInputComponent.items.length - 1,
                    1
                );
                if (this.honourInputComponent.items.length) {
                    ctrl.setValue(JSON.stringify(this.honourInputComponent.items));
                }
            }
        });
    }

    onNew() {
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            BankHonourNewModalComponent,
            null
        ).subscribe(v => {
            if (v === null) {
                return;
            }

            // 判断商票是否有重复
            for (let i = 0; i < this.honourInputComponent.items.length; ++i) {
                if (
                    this.honourInputComponent.items[i].honourNum === v.honourNum
                ) {
                    this.xn.msgBox.open(
                        false,
                        `商票号码(${v.honourNum})重复了，请您检查`
                    );
                    return;
                }
            }

            this.honourInputComponent.items.push(v);
            this.honourInputComponent.toValue();
        });
    }

    onView(item: any) {
        item.preview = this.row.options.preview;
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            BankHonourViewModalComponent,
            item
        ).subscribe(() => {});
    }
}
