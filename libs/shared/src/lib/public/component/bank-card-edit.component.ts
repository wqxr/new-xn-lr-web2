import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ModalComponent, ModalSize } from '../../common/modal/components/modal';
import { FormGroup } from '@angular/forms';
import { XnFormUtils } from '../../common/xn-form-utils';
import { XnService } from '../../services/xn.service';
import { SelectOptions } from '../../config/select-options';

/**
 *  核心企业、供应商、保理商新增银行卡弹窗
 */
@Component({
    templateUrl: './bank-card-edit.component.html',
    styles: [
        `
        @media (min-width: 768px) {
            .modal-wrap .modal-dialog {
                width: 1200px;
            }
        }
    `]
})
export class BankCardEditComponent implements OnInit {
    // 传入的数据
    public params: any;
    public shows: any;
    @ViewChild('modal') modal: ModalComponent;
    private observer: any;
    // 中国省份
    public china: any = SelectOptions.get('chinaCity');
    public citys: any[];
    public province = '';
    public city = '';
    public bankHead = '';
    public bankName = '';
    public headbanks: any; // 总行的选择列表;
    public bankDetail: {};
    public list: any; // 返回的开户行列表
    public bankId = '';
    public edit = { // 更新银行卡信息
        where: {},
        value: {}
    };
    public accountHolder = '';
    public desc = '';
    public cardCode = '';
    public headBank_search = '';
    public count: number; // 判断是否为刚打开弹窗

    public detailBank_search: any;

    public constructor(private xn: XnService) {
    }

    open(row): Observable<string> {
        // 把原先的银行卡信息全部显示出来
        this.cardCode = row.cardCode;
        this.accountHolder  = row.accountHolder ;
        this.bankId = row.bankCode;
        this.desc = row.desc;
        this.province = row.province;
        this.city = row.city;
        this.bankHead = row.bankHead;
        this.bankName = row.bankName;
        this.changePro(this.province);
        this.changeBankHead(this.bankHead);
        this.modal.open(ModalSize.Large);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    public ngOnInit() {
        this.headbanks = SelectOptions.get('headBank');
        this.count = 0;
    }

    // 省份-城市查询
    public changePro(val) {
        // 刚打开弹窗的时候依旧显示原来选择的值，不置为空值
        if (this.count !== 0) {
            this.city = '';
            this.bankName = '';
            this.bankId = '';
            this.list = [];
        }
        this.citys = this.china.second[val];
        if (this.province !== '' && this.city !== '' && this.bankHead !== '') {
            this.bankDetail = {
                province: this.province,
                city: this.city,
                bankHead: this.bankHead,
                bankName: this.bankName
            };
            this.xn.api.post('/bank_info_list/list', this.bankDetail)
                .subscribe(x => {
                    if (x.ret == 0) {
                        this.list = x.data.list;
                    }
                });
        }
    }

    public changeCity(val) {
        if (this.count !== 0) {
            this.bankName = '';
            this.bankId = '';
            this.list = [];
        }
        this.city = val;
        if (this.city !== '' && this.bankHead !== '') {
            this.bankDetail = {
                province: this.province,
                city: this.city,
                bankHead: this.bankHead,
                bankName: this.bankName
            };
            this.xn.api.post('/bank_info_list/list', this.bankDetail)
                .subscribe(x => {
                    if (x.ret == 0) {
                        this.list = x.data.list;
                    }
                });
        }
    }

    // 银行总行查询
    public bankSearch(bank) {
        this.headbanks = SelectOptions.get('headBank').filter(item =>
            item.label.indexOf(bank) !== -1
        );
    }

    // 确定银行总行，获得开户行列表
    public changeBankHead(bankHead) {
        if (this.count !== 0) {
            this.bankName = '';
            this.bankId = '';
            this.list = [];
        }
        if (this.province == '') {
            this.xn.msgBox.open(false, '请先选择省份');
        } else if (this.city == '') {
            this.xn.msgBox.open(false, '请先选择城市');
        } else if (bankHead !== '') {
            this.bankHead = bankHead;
            this.bankDetail = {
                province: this.province,
                city: this.city,
                bankHead,
                bankName: this.bankName
            };
            this.xn.api.post('/bank_info_list/list', this.bankDetail)
            .subscribe(x => {
                if (x.ret == 0) {
                    this.list = x.data.list;
                }
            });
        }
        // 此时判断为刚打开弹窗获取数据结束
        if (this.count === 0) {
            this.count ++;
        }
    }

    // 开户行搜索
    public detailSearch(bank) {
        this.bankDetail = {
            province: this.province,
            city: this.city,
            bankHead: this.bankHead,
            bankName: bank
        };
        this.xn.api.post('/bank_info_list/list', this.bankDetail)
            .subscribe(x => {
                if (x.ret == 0) {
                    this.list = x.data.list;
                }
            });
    }

    // 确定开户行，获得开户行行号
    public changeBankName(bankName) {
        this.bankId = '';
        this.bankName = bankName;
        this.bankDetail = {
            province: this.province,
            city: this.city,
            bankHead: this.bankHead,
            bankName
        };
        for (const item of this.list) {
            if (bankName === item.bankName) {
                this.bankId = item.bankId;
            }
        }
    }

    public onSubmit() {
        this.edit.where = {
            cardCode: this.cardCode
        },
        this.edit.value = {
            cardCode: this.cardCode,
            bankName: this.bankName,
            bankCode: this.bankId,
            accountHolder: this.accountHolder,
            desc: this.desc
        };
        this.xn.api
            .post('/bank_card?method=put', this.edit)
            .subscribe(x => {
                if (x.ret === 0) {
                    this.close('ok');
                }
            });
    }

    public onCancel() {
        this.close('');
    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }
}
