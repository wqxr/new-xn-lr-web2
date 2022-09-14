import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {LocalStorageService} from 'libs/shared/src/lib/services/local-storage.service';

/**
 *  abs 会计下载 【金地abs,万科abs】
 */
@Component({
    templateUrl: './accounting-load.component.html',
})
export class AccountingLoadComponent implements OnInit {
    pageTitle = '发起心流程-会计下载表格';
    panelTile = '会计下载表格';
    pageDesc = '';
    rows: any[];
    mainForm: FormGroup;
    data: any;
    mainFlowIds: string[];
    absType: string;

    constructor(public xn: XnService, private localStorageService: LocalStorageService) {
    }

    ngOnInit(): void {
        this.buildRows();
    }

    // 下载财务报表
    onSubmit(): void {
        const loadApi = {
            download_url: '/custom/jindi_v3/down_file/accounting_load', // 万科/金地 会计下载
            download_times_url: '/custom/jindi_v3/pay_manage/accounting_load_times', // 万科/金地 会计下载次数
        };
        this.xn.api.download(loadApi[`download_url`], {mainFlowIds: this.mainFlowIds, dcType: DctypeEnum[this.absType]})
            .subscribe((v: any) => {
                this.xn.api.save(v._body, '会计下载表格.xlsx');
                this.xn.api.post(loadApi[`download_times_url`], {mainFlowIds: this.mainFlowIds, dcType: DctypeEnum[this.absType]})
                    .subscribe(() => {
                        // 下载完后删除缓存数据
                        this.localStorageService.caCheMap.delete('accounting_load_mainFlowIds');
                        this.localStorageService.caCheMap.delete('absType');
                        this.xn.user.navigateBack();
                    });
            });
    }

    private buildRows(): void {
        this.absType = this.localStorageService.caCheMap.get('absType');
        this.mainFlowIds = this.localStorageService.caCheMap.get('accounting_load_mainFlowIds');
        this.xn.api.post('/custom/jindi_v3/down_file/submit_accounting', {
            mainFlowIds: this.mainFlowIds,
            dcType: DctypeEnum[this.absType]
        }).subscribe(val => {
            this.rows = [
                {
                    checkerId: 'downInfo_accounting',
                    required: true,
                    type: 'file-table',
                    title: '下载信息',
                    value: JSON.stringify(val.data.data), // 获取选中的交易id mainFlowId
                },
                {
                    checkerId: 'memo',
                    required: false,
                    type: 'textarea',
                    title: '经办意见'
                }
            ];
            XnFormUtils.buildSelectOptions(this.rows);
            this.buildChecker(this.rows);
            this.mainForm = XnFormUtils.buildFormGroup(this.rows);
        });
    }

    private buildChecker(stepRows): void {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }
}

// dcType 对应枚举
export enum DctypeEnum {
    vanke = 4,
    gemdale = 5
}
