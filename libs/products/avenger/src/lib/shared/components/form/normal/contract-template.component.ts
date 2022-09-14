/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：radio-input.component.ts
 * @summary：单选框 type = 'radio'
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          新增         2019-04-22
 * **********************************************************************
 */

import { Component, OnInit, ElementRef, Input, ViewContainerRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { PdfSignModalComponent } from 'libs/shared/src/lib/public/modal/pdf-sign-modal.component';

@Component({
    selector: 'xn-avenger-contract-template-component',
    templateUrl: './contract-template.component.html',
    styles: [`
`]
})
@DynamicForm({ type: 'guaranteeTemplate', formModule: 'avenger-input' })
export class AvengercontractTemplateComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;

    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    items: any;
    constructor(private er: ElementRef, private xn: XnService,
                private vcr: ViewContainerRef) {
    }
    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.items = JSON.parse(this.row.value);
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);

    }
    showContract(paramContract) {
        const params = Object.assign({}, paramContract, { readonly: true });
        XnModalUtils.openInViewContainer(this.xn, this.vcr, PdfSignModalComponent, params).subscribe();
    }
    downAll() {
        for (let i = 0; i < this.items.length; i++) {
            const filename = this.items[i].label + '.pdf';
            this.xn.api.download('/contract/pdf', {
                id: this.items[i].id,
                secret: this.items[i].secret,
            }).subscribe((v: any) => {
                this.xn.api.save(v._body, filename);
            });
        }


    }
}
