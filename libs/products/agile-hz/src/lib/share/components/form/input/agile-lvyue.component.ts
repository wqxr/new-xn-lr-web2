import { Component, OnInit, ElementRef, Input, ChangeDetectionStrategy, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import ContractAndPerformanceSupply from 'libs/shared/src/lib/public/dragon-vanke/components/bean/supplement-checkers.tab';
import { DragonViewContractModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/dragon-mfile-detail.modal';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { DragonConfigMfilesViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/config-mfiles-view-modal.component';
@Component({
    templateUrl: './agile-lvyue.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: [],

})

@DynamicForm({ type: 'platAgile-performance', formModule: 'dragon-input' })
export class AgilelvyueComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    public alert = '';
    public ctrl: AbstractControl;
    public payablesCtrl: AbstractControl; // 应收帐款金额
    public headquartersCtrl: AbstractControl; // 总部公司
    public xnOptions: XnInputOptions;
    public ctrl1: AbstractControl;
    public copyItems: any[] = [];
    public items: any[] = [];
    public datainfo = {
        contractId: '',
        contractMoney: '',
        contractName: '',
        contractType: '',
        debtUnit: '',
        debtUnitAccount: '',
        debtUnitBank: '',
        debtUnitName: '',
        projectCompany: '',
        receive: '',
        signTime: '',
        totalReceive: '',
        payRate: '',
        contractJia: '',
        contractYi: '',
        percentOutputValue: '',
        payType: '',

        feeTypeName: '',
        type: '',
        wkType: '',
        index: 0,
    };
    public constructor(private xn: XnService,
        private er: ElementRef,
        private vcr: ViewContainerRef, private cdr: ChangeDetectorRef) {
    }

    public ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.items = !!this.row.value ? JSON.parse(this.row.value) : [];
        this.items.forEach(y => {
            if (!!y.percentOutputValue) {
                y.percentOutputValue = Number(y.percentOutputValue);
            } else {
                y.percentOutputValue = ''
            }
            if (y.totalReceive !== '') {
                y.totalReceive = Number(y.totalReceive);
            }
        });
        this.ctrl1 = this.form.get('dealContract');
        this.ctrl1.valueChanges.subscribe(x => {
            if (x !== '') {
                this.copyItems = JSON.parse(x);
                delete this.copyItems[0].contractFile;
                delete this.copyItems[0].inutFile;
                delete this.copyItems[0].performanceFile;
                const objKey = Object.keys(this.datainfo);
                for (let i = 0; i < objKey.length; i++) {
                    if (this.copyItems[0][objKey[i]] !== this.items[0][objKey[i]]) {
                        this.copyItems.forEach(y => {
                            this.items[0] = Object.assign({}, this.items[0], y);
                        });
                        this.toValue();
                    }
                }
            }
            this.cdr.markForCheck();
        });
        this.toValue();
    }

    /**
     *  补充履约证明信息
     * @param sub
     */
    onEdit(sub: any, type: number, index?: number) {
        const componentType = ['dragon_platform_verify', 'dragon_supplier_sign'].includes(this.row.flowId) ? 'dragonLvYue' : 'vankeLvYue';
        this.xn.dragon.post('/contract_temporary/view', { mainFlowId: this.svrConfig.record.mainFlowId }).subscribe(x => {
            if (x.ret === 0) {
                if (x.data.data.contractName === undefined) {
                    this.datainfo = sub;
                    this.datainfo.feeTypeName = x.data.data.feeTypeName;
                    this.datainfo.type = x.data.data.type;
                    this.datainfo.wkType = x.data.data.wkType;
                } else {
                    this.datainfo = x.data.data;
                }
                if (!this.datainfo.totalReceive ) {
                    this.datainfo.totalReceive = '';
                } else {
                    this.datainfo.totalReceive = this.ReceiveData(this.datainfo.totalReceive.toString()).toFixed(2);
                }
                if (!this.datainfo.percentOutputValue) {
                    this.datainfo.percentOutputValue = '';
                } else {
                    this.datainfo.percentOutputValue = this.ReceiveData(this.datainfo.percentOutputValue.toString()).toFixed(2);
                }
                this.datainfo.index = index + 1;
                const params = {
                    title: '履约证明',
                    type: this.row?.options?.readonly ? 1 : type,
                    mainFlowId: this.svrConfig.record.mainFlowId,
                    debtUnit: this.datainfo.debtUnit || '',
                    projectCompany: this.datainfo.projectCompany || '',
                    receive: this.datainfo.receive || '',
                    contractFile: sub.performanceFile,
                    checker: ContractAndPerformanceSupply.getConfig(componentType, this.row?.options?.readonly ? 1 : type, this.datainfo, this.row)
                };
                XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonViewContractModalComponent, params).subscribe(v => {
                    if (v.action === 'cancel') {
                        return;
                    } else {
                        sub.contractId = v.contractInfo.contractId;
                        sub.contractMoney = v.contractInfo.contractMoney;
                        sub.contractName = v.contractInfo.contractName;
                        sub.contractType = Number(v.contractInfo.contractType);
                        sub.debtUnitAccount = v.contractInfo.debtUnitAccount;
                        sub.debtUnitName = v.contractInfo.debtUnitName;
                        sub.debtUnitBank = v.contractInfo.debtUnitBank;
                        sub.signTime = v.contractInfo.signTime;
                        sub.payType = v.contractInfo.payType;
                        sub.percentOutputValue = v.contractInfo.percentOutputValue;
                        sub.contractYi = v.contractInfo.contractYi;
                        sub.contractJia = v.contractInfo.contractJia;
                        sub.payRate = v.contractInfo.payRate;
                        sub.flag = v.flag;
                        sub.owner = 'contract';
                        sub.totalReceive = v.contractInfo.totalReceive;
                        this.toValue();
                        this.cdr.markForCheck();

                    }
                });
            }
        });


    }

    /**
     * 保存修改值并格式化
     */
    private toValue() {
        // let contractInfo = JSON.parse(this.form.value.dealContract);
        // contractInfo.forEach(y => {
        //   this.items[0] = Object.assign({}, this.items[0], y);
        // });
        if (this.items.length === 0) {
            this.ctrl.setValue('');
        } else {
            let isOk = true;
            this.items.forEach(x => {
                if (!!!x.performanceFile) {
                    isOk = false;
                }
                x.owner = 'contract';
            });
            if (!isOk) {
                this.ctrl.setValue('');
            } else {
                this.items.forEach(y => {
                    if (!!y.percentOutputValue) {
                        y.percentOutputValue = Number(y.percentOutputValue);
                    } else {
                        y.percentOutputValue = ''
                    }
                    if (y.totalReceive !== '') {
                        y.totalReceive = Number(y.totalReceive);
                    }
                });
                this.ctrl.setValue(JSON.stringify(this.items));

            }
        }
        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
    // 计算应收账款转让金额
    public ReceiveData(item: any) {
        let tempValue = item.replace(/,/g, '');
        tempValue = parseFloat(tempValue).toFixed(2);
        return Number(tempValue);
    }

    /**
        *  查看文件
        * @param paramFile file
        * @param index 下标
        */
    public onView(paramFile: any, index: number): void {
        let paramFiles = [];
        paramFiles = [...JSON.parse(this.items[0]['performanceFile'])];
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonConfigMfilesViewModalComponent,
            {
                paramFiles,
                index,
                leftButtons: [{ label: '下载当前文件', operate: 'downloadNow' }],
                rightButtons: []
            }).subscribe(x => { });

    }

    /**
     *  下载文件
     * @param file: { fileId: string, filePath: string} 文件信息
     */
    downloadFile(file: { fileId: string, fileName: string, filePath: string }) {
        this.xn.file.saveFile(file, file.fileName, 'dragon');
    }
}
