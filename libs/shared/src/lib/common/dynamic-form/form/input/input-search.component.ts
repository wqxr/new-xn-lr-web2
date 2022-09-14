/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：radio-input.component.ts
 * @summary：文本输入框 搜索调请求
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing           新增         2022-03-23
 * **********************************************************************
 */

import { ChangeDetectionStrategy, Component, OnInit, ElementRef, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from '../../dynamic.decorators';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnModalUtils } from '../../../xn-modal-utils';
import { CertifyGetFileEntryModal } from 'libs/shared/src/lib/public/dragon-vanke/modal/certify-getfile-plat-modal.component';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { TruncatePipe } from '@lr/ngx-shared';
import * as _ from 'lodash';
import { XnUtils } from '../../../xn-utils';

@Component({
    selector: 'xn-text-search-component',
    templateUrl: './input-search.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,

})
@DynamicForm({ type: 'input-search', formModule: 'default-input' })
export class DragonTextInputSearchComponent implements OnInit {


    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    inMemo = '';
    fileList = [];
    hasValue: boolean = false;

    constructor(public localStorageService: LocalStorageService, public publicCommunicateService: PublicCommunicateService, private xn: XnService, private vcr: ViewContainerRef,) {
    }

    ngOnInit() {
        if (!this.row.placeholder) {
            this.row.placeholder = '';
            if (this.row.type === 'text' && this.row.value === 0) {
                this.row.placeholder = 0;
            }
        }

        this.ctrl = this.form.get(this.row.name);
        this.calcAlertClass();
        this.ctrl.valueChanges.subscribe(v => {
        });
    }

    onBlur(event: any): void {
    }
    // 重置
    resetCompany() {
        this.ctrl.setValue('');
        this.hasValue = false;
        this.publicCommunicateService.change.emit({ certifyfileList: [] });
    }

    calcAlertClass(): void {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
    searchCertify() {
        this.hasValue = true;
        this.xn.loading.open();
            this.xn.api.dragon.post('/certify/certity_history_file', { appName: this.ctrl.value.trim() }).subscribe(x => {
                if (x.ret === 0 && x.data.length > 0) {
                    this.fileList = [];
                    x.data.forEach((x: any) => {
                        this.fileList.push(JSON.parse(x)[0]);
                    });
                    this.fileList.forEach(x => {
                        x.checked = false;
                    });
                    if (!!this.form.get('certifyList').value) {
                        let newfiles=[];
                        const files=JSON.parse(this.form.get('certifyList').value);
                        const hasList = files.map(x=>x.certify_file);
                        hasList.forEach(x=>{
                            newfiles.push(JSON.parse(x)[0])
                        })
                        const fileIndex = _.findIndex(this.fileList, ['fileId',newfiles[0].fileId]);
                        if (fileIndex >= 0) {
                            const allList = [...newfiles, ...this.fileList];
                            this.fileList = XnUtils.arrUnique(allList, 'fileId');
                        }
                    }
                    XnModalUtils.openInViewContainer(this.xn, this.vcr, CertifyGetFileEntryModal, { fileList: this.fileList }).subscribe(x => {
                        if (x && !!x.fileList) {
                            this.publicCommunicateService.change.emit({ certifyfileList: x.fileList });
                        }
                    })
                }
                this.xn.loading.close();
            })
    }
}
