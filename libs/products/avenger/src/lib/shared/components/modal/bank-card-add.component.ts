import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';
import { ModalComponent, ModalSize } from 'libs/shared/src/lib/common/modal/components/modal';


/**
 *  核心企业、供应商、保理商新增银行卡弹窗
 */
@Component({
    templateUrl: './bank-card-add.component.html',
    styles: [
        `
        @media (min-width: 768px) {
            .modal-wrap .modal-dialog {
                width: 1200px;
            }
        }
    `]
})
export class AvengerBankCardAddComponent implements OnInit {
    // 传入的数据
    public params: any;
    public shows: any;
    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('myForm') form: FormGroup;
    @ViewChild('codeInput') codeInput: ElementRef;
    private observer: any;
    // 中国省份
    public china: any = SelectOptions.get('chinaCity');
    public citys: any[];
    public province = '';
    public city = '';
    public bankHead = '';
    public bankName = '';
    public headbanks: any;
    public bankDetail: {};
    public list: any; // 返回的开户行列表
    public bankId = '';
    public add = { // 新增银行卡信息
        value: {
        }
    }; // 新增的银行卡账号信息
    public accountName = '';
    public desc = '';
    public cardCode = '';
    public headBank_search = '';
    public detailBank_search = '';
    public reg = /[^\d]/g;
    public constructor(private xn: XnService) {
    }

    open(): Observable<string> {
        this.modal.open(ModalSize.Large);
        this.accountName = this.xn.user.orgName;
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    public ngOnInit() {
        this.citys = this.china.second[''];
        this.headbanks = [];  // SelectOptions.get('headBank');
    }

    public onInput(){
        this.cardCode = String(this.codeInput.nativeElement.value).replace(/[^(\-||\d)]/g, '');
        this.codeInput.nativeElement.value = this.cardCode;
    }

    // 省份-城市查询
    public changePro(val) {
        this.bankName = '';
        this.bankId = '';
        this.citys = this.china.second[val];
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
        if (!!this.province && !!this.city){
            const params = {
                province: this.province,
                city: this.city,
                bankHead: this.bankHead
            };
            this.bankSearchPost(params);
        } else {
            this.headbanks = [];
        }
    }
    public changeCity(val) {
        this.bankName = '';
        this.bankId = '';
        if (this.bankHead !== '') {
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
        if (!!this.province && !!this.city){
            const params = {
                province: this.province,
                city: this.city,
                bankHead: this.bankHead
            };
            this.bankSearchPost(params);
        } else {
            this.headbanks = [];
        }
    }
    // 银行总行查询
    public bankSearch(bank) {
        if (!!this.province && !!this.city){
            const params = {
                province: this.province,
                city: this.city,
                bankHead: bank    // this.bankHead
            };
            this.bankSearchPost(params);
        } else if (!this.province || !this.city){
            this.headbanks = [];
        }
        // this.headbanks = SelectOptions.get('headBank').filter(item =>
        //     item.label.indexOf(bank) !== -1
        // );
    }


    // 确定银行总行，获得开户行列表
    public changeBankHead(bankHead) {
        this.bankName = '';
        this.bankId = '';
        if (this.province == '') {
            this.xn.msgBox.open(false, '请先选择省份');
        }
        if (this.city == '') {
            this.xn.msgBox.open(false, '请先选择城市');
        }
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

    /**
     *
     * @param params
     */
    bankSearchPost(params: {province: string, city: string, bankHead: string}){
        // 根据省市获取银行
        this.xn.avenger.postOnly('/bank/bankinfolist/search_bank', params).subscribe(x => {
            if (x.ret == 0 && x.data && x.data && x.data.length) {
                // 格式{ label: '鞍山市商业银行股份有限公司', value: '鞍山市商业银行股份有限公司' },
                this.headbanks = x.data;
            }else{
                this.headbanks = [];
            }
        });
    }

    public onSubmit() {
        this.add.value = {
            cardCode: this.cardCode,
            bankName: this.bankName,
            bankCode: this.bankId,
            accountName: this.accountName,
            desc: this.desc
        };
        this.xn.api
            .post('/bank_card?method=post', this.add)
            .subscribe(x => {
                if (x.ret === 0) {
                    this.onCancel(this.add);
                }
            });
    }

    public onCancel(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }



    public close() {
        this.modal.close();
        this.observer.next();
        this.observer.complete();
    }
}
