/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file
 * @summary:
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                  zigui             银行账号管理          2021-01-14
 * **********************************************************************
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';
import { ModalComponent, ModalSize } from 'libs/shared/src/lib/common/modal/components/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
/**
 *  新增银行账号弹窗
 */
@Component({
  templateUrl: './bank-account-add-modal.component.html',
  styles: [
    `
        @media (min-width: 768px) {
            .modal-wrap .modal-dialog {
                width: 1200px;
            }
        }
    `]
})
export class BankAccountAddModalComponent implements OnInit {
  static type: string;  // 当前操作类型，判断新增、查看还是编辑
  static current: any;  // 查看和编辑操作时，传过来的对象
  // 传入的数据
  params: any;
  shows: any;
  @ViewChild('modal') modal: ModalComponent;
  private observer: any;
  form: FormGroup;
  // 中国省份
  china: any = SelectOptions.get('chinaCity');
  citys: any[];
  bankInfo: any = {

  };
  constructor(private xn: XnService, private fb: FormBuilder, private $message: NzMessageService,) {}
  // 操作
  get operation() {
    const map = {
      add: '新增',
      edit: '编辑',
      view: '查看',
    };
    return map[BankAccountAddModalComponent.type];
  }
  get bankId() {
    return this.form.get('bankId');
  }
  open(): Observable<string> {
    this.modal.open(ModalSize.Large);
    return Observable.create(observer => {
      this.observer = observer;
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      province: ['', Validators.required],
      city: ['', Validators.required],
      bankHead: ['', Validators.required],
      bankName: ['', Validators.required],
      bankId: ['', [Validators.required]],
    });
    this.form.get('province').valueChanges.subscribe(v => {
      this.citys = this.china.second[v];
      this.form.patchValue({city: ''});
    });
    if (BankAccountAddModalComponent.type === 'add') {} else {
      const { province, city, bankHead, bankName, bankId } = BankAccountAddModalComponent.current;
      this.form.setValue({ province, city, bankHead, bankName, bankId });
    }
  }
  onSubmit() {
    const api = BankAccountAddModalComponent.type === 'add' ? '/bank_info_list/add' : '/bank_info_list/update';
    const params = { ...this.form.value };
    if (BankAccountAddModalComponent.type === 'edit') {
      params.id = BankAccountAddModalComponent.current.id;
    }
    this.xn.api.post(api, params)
      .subscribe(x => {
        if (x.ret === 0) {
          this.$message.success(`${this.operation}成功！`);
          this.onCancel(this.form.value);
        }
      });
  }

  onCancel(value) {
    this.modal.close();
    this.observer.next(value);
    this.observer.complete();
  }
  close() {
    this.modal.close();
    this.observer.next(null);
    this.observer.complete();
  }
  // 长度验证器
  lenValidator(len: number): ValidatorFn {
    return (control: AbstractControl): null | { [key: string]: any } => {
      const validator = control.value.length === len;
      return validator ? null : { lengthError: `请输入长度为${len}位的开户行行号` };
    };
  }
}
