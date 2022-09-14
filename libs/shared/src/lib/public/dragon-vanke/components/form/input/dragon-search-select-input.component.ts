import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ElementRef,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { XnService } from '../../../../../services/xn.service';
import { PublicCommunicateService } from '../../../../../services/public-communicate.service';
import { LocalStorageService } from '../../../../../services/local-storage.service';
import { HeadquartersTypeEnum } from 'libs/shared/src/lib/config/select-options';

@Component({
  selector: 'dragon-search-select-input',
  template: `
    <div [formGroup]="form">
      <select
        class="form-control xn-input-font"
        [formControlName]="row.name"
        (change)="onSelectChange($event)"
        [ngClass]="myClass"
      >
        <option value="">请选择</option>
        <option
          *ngFor="let option of row.selectOptions"
          value="{{ option.value }}"
        >
          {{ option.label }}
        </option>
      </select>
    </div>
    <span class="xn-input-alert">{{ alert }}</span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@DynamicForm({ type: 'search-select', formModule: 'dragon-input' })
export class DragonSearchSelectInputComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig?: any;

  myClass = '';
  alert = '';
  ctrl: AbstractControl;
  xnOptions: XnInputOptions;
  config: any = {
    post_url: '/contract/first_contract_info/get_org_project',
    vanke_financing_pre: '/contract/first_contract_info/get_wk_project',
    sub_intermediary_add: '/project_manage/agency/get_factor_list', // 万科二期-平台中介机构新增
    post_url_vk: '/contract/first_contract_info/get_project',
    url_sh_fit: '/contract/first_contract_info/get_project', // 上海银行
    url_sh_rule: '/shanghai_bank/sh_company_limit/selectRules',
  };

  constructor(
    private er: ElementRef,
    private xn: XnService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.ctrl = this.form.get(this.row.name);
    this.xnOptions = new XnInputOptions(
      this.row,
      this.form,
      this.ctrl,
      this.er
    );
    this.getParams();
  }

  getParams() {
    if (
      this.svrConfig &&
      this.svrConfig.flowId === 'vanke_financing_pre' &&
      !!this.form.get('headquarters')
    ) {
      this.form.get('headquarters').valueChanges.subscribe((x) => {
        if (x === HeadquartersTypeEnum[7] || x === HeadquartersTypeEnum[5]) {
          if (this.xn.router.url.startsWith('/pslogan')) {
            // isLgBoShi 0=非龙光博时资本 1=龙光博时资本
            this.onInitOptions({ isProxy: 52, isLgBoShi: 1 });
          } else {
            this.onInitOptions({ isProxy: 52 });
          }
        }
      });
      if (this.form.get('headquarters').value === HeadquartersTypeEnum[1]) {
        this.onInitOptions({ isProxy: 53 });
      }
    } else if (
      this.svrConfig &&
      this.svrConfig.flowId === 'bgy_financing_pre'
    ) {
      // 碧桂园发起提单
      this.onInitOptions({ isProxy: 54 });
    } else if (
      this.svrConfig &&
      this.svrConfig.flowId === 'oct_financing_pre'
    ) {
      this.onInitOptions({ isProxy: 55 });
    } else {
      this.onInitOptions({ isProxy: 53 });
    }
  }

  public onInitOptions(param?: any) {
    let url = this.config.post_url;
    if (this.svrConfig && this.svrConfig.flowId === 'vanke_financing_pre') {
      // 万科预录入
      url = this.config.post_url_vk;
    } else if (
      this.svrConfig &&
      ['sh_vanke_financing_pre'].includes(this.svrConfig?.flow?.flowId) &&
      ['fitProject'].includes(this.row.checkerId)
    ) {
      param = { isProxy: 60 };
      url = this.config.url_sh_fit;
    } else if (
      this.svrConfig &&
      ['sh_vanke_platform_verify', 'so_platform_verify'].includes(
        this.svrConfig?.flow?.flowId
      ) &&
      ['ruleId'].includes(this.row.checkerId)
    ) {
      param = {};
      url = this.config.url_sh_rule;
    }
    if (
      this.svrConfig &&
      (this.svrConfig.flowId === 'sub_intermediary_add' ||
        this.svrConfig?.flow?.flowId === 'sub_intermediary_add')
    ) {
      // 万科二期-平台中介机构新增
      url = this.config.sub_intermediary_add;
      param = {};
    }
    if (
      this.svrConfig &&
      (this.svrConfig.flowId === 'bgy_financing_pre' ||
        this.svrConfig.flowId === 'oct_financing_pre')
    ) {
      // 碧桂园发起提单-合同组
      url = this.config.post_url_vk;
    }
    if (
      this.row.name === 'factorName' &&
      this.svrConfig &&
      (this.svrConfig.flowId === 'bgy_financing_pre' ||
        this.svrConfig.flow.flowId === 'bgy_financing_pre')
    ) {
      // 碧桂园发起提单-保理商名称
      url = this.config.sub_intermediary_add;
      param = {};
    }
    this.xn.dragon.post(url, param).subscribe(
      (x) => {
        // if (x.ret === 0 && x.data && x.data.fitProject) {
        if (
          x.ret === 0 &&
          x.data &&
          ['fitDebtUnit'].includes(this.row.checkerId)
        ) {
          const fitArr = x.data.fitDebtUnit || [];
          this.row.selectOptions = fitArr.map((option: any) => {
            return { label: option, value: option };
          });
        } else if (
          x.ret === 0 &&
          x.data &&
          ['fitProject', 'fitProjectEx'].includes(this.row.checkerId)
        ) {
          const fitArr = x.data.fitProject || [];
          this.row.selectOptions = fitArr.map((option: any) => {
            return { label: option, value: option };
          });
        } else if (
          x.ret === 0 &&
          x.data &&
          x.data.data &&
          ['ruleId'].includes(this.row.checkerId)
        ) {
          // 禁入规则
          this.row.selectOptions = x.data.data.map((option) => {
            return { label: option.ruleName, value: option.ruleId };
          });
        } else if (x.ret === 0 && x.data && x.data.data) {
          //中介机构新增
          this.row.selectOptions = x.data.data.map((option) => {
            return { label: option.orgName, value: option.orgName };
          });
        } else {
          this.row.selectOptions = [];
        }
      },
      () => {
        this.row.selectOptions = [];
      },
      () => {
        this.cdr.markForCheck();
      }
    );
  }

  public onSelectChange(e) {
    // console.log(e);
  }
}
