import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';
import {OrgNametypeEnum} from '../../enum/risk-control-enum';
import {EnterpriseListOutputModel, EnterpriseTransferInput} from '../../model/amount-control';

/**
 *  交易控制-额度控制企业列表
 */
@Component({
    selector: 'app-contract-control-enterprise-list-component',
    templateUrl: './amount-control-enterprise-list.component.html',
    styles: [`
        .content-p {
            padding: 10px;
        }

        .flex {
            display: flex;
        }

        .flex-g {
            flex-grow: 1;
        }

        .search-title {
            min-width: 8rem;
        }
    `]
})
export class AmountControlEnterpriseListComponent implements OnInit {
    @Input() enterprise: EnterpriseTransferInput;
    @Input() data: EnterpriseListOutputModel[];
    @Output() pageChange: EventEmitter<any> = new EventEmitter(false);
    @Output() searchValue: EventEmitter<any> = new EventEmitter(false);
    shows = [];
    mainForm: FormGroup;
    searches = [];
    orgNameTypeEnum = OrgNametypeEnum;

    constructor(private xn: XnService) {
    }

    ngOnInit() {
        setTimeout(() => {
            this.buildForm();
        });
    }

    // 向父级组件传递页码
    onPage(page: number) {
        this.pageChange.emit(page);
    }

    // 重置
    reset() {
        if (this.enterprise.pageTitle === 'core') {
            this.mainForm.setValue({momName: '', enterpriseName: ''});
        } else {
            this.mainForm.setValue({supplierName: '', enterpriseName: ''});
        }
        // 清空
        this.searchValue.emit(this.searches);
    }

    // 搜索
    searchMsg() {
        this.searchValue.emit(this.searches); // 传递搜索值
    }

    // 额度更改流程
    changeAmount(label: string) {
        const paramId = label === 'core' ? 'financing_enterprise_m' : 'financing_supplier_enterprise';
        this.xn.router.navigate([`/console/record/new/${paramId}`]);
    }

    private buildForm() {
        if (this.enterprise.pageTitle === 'core') {
            this.shows = [
                {
                    title: '母公司',
                    checkerId: 'momName',
                    type: 'text',
                    required: false
                },
                {
                    title: '核心企业',
                    checkerId: 'enterpriseName',
                    type: 'text',
                    required: false
                }
            ];
        } else {
            this.shows = [
                {
                    title: '供应商',
                    checkerId: 'supplierName',
                    type: 'text',
                    required: false
                },
                {
                    title: '对应核心企业',
                    checkerId: 'enterpriseName',
                    type: 'text',
                    required: false
                }
            ];
        }


        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.mainForm = XnFormUtils.buildFormGroup(this.shows);
        this.mainForm.valueChanges.subscribe(v => {
            const search = [];
            for (const key in this.mainForm.value) {
                if (this.mainForm.value.hasOwnProperty(key)) {
                    if (this.mainForm.value[key] !== '') {
                        const obj = {} as any;
                        obj.key = key;
                        obj.value = this.mainForm.value[key];
                        search.push(obj);
                    }
                }
            }
            this.searches = search;
        });
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }
}
