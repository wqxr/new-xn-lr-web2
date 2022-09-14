import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalComponent, ModalSize } from '../../common/modal/components/modal';
import { Observable, of } from 'rxjs';
import { XnService } from '../../services/xn.service';
import { FormGroup } from '@angular/forms';
import { XnFormUtils } from '../../common/xn-form-utils';

@Component({
  templateUrl: './user-add-modal.component.html',
  styles: [
    `.panel { margin-bottom: 0 }`,
  ]
})
export class UserAddModalComponent implements OnInit {

  @ViewChild('modal') modal: ModalComponent;
  private observer: any;

  params: any = {} as any;
  steped = 0;
  rows: any[] = [];
  shows: any[] = [];
  mainForm: FormGroup;
  formValid = false;
  newUserRoleList: any[] = [];
  roleArr: any[] = [];
  roleArrTemp: any[] = [];
  memoTemp = '';

  constructor(private xn: XnService) {
  }

  ngOnInit() {
  }

  open(params: any): Observable<string> {

    // 处理数据
    this.shows = [];

    this.shows.push({
      name: 'userName',
      required: true,
      type: 'text',
      title: '用户姓名',
      validators: {
        cnName: true
      }
    });

    let selectOptionsArr = [];

    // 给核心企业也加上
    if (this.xn.user.orgType !== 3 && this.xn.user.orgType !== 99 && this.xn.user.orgType !== 2) {
      selectOptionsArr = [
        { label: '业务经办人', value: 'operator' },
        { label: '业务复核人', value: 'reviewer' },
      ];
      this.memoTemp = '不选任何角色就是只读用户';
    } else if (this.xn.user.orgType === 2) {
      selectOptionsArr = [
        { label: '业务经办人', value: 'operator' },
        { label: '业务复核人', value: 'reviewer' },
        { label: '高管经办人', value: 'windOperator' },
        { label: '高管复核人', value: 'windReviewer' },
      ];
      this.memoTemp = '不选任何角色就是只读用户';
    } else if (this.xn.user.orgType === 99) {
      selectOptionsArr = [
        { label: '业务经办人', value: 'operator' },
        { label: '业务复核人', value: 'reviewer' },
        { label: '客户经理经办人', value: 'customerOperator' },
        { label: '客户经理复核人', value: 'customerReviewer' },
        { label: '风险审查经办人', value: 'riskOperator' },
        { label: '风险审查复核人', value: 'riskReviewer' },
        { label: '财务经办人', value: 'financeOperator' },
        { label: '财务复核人', value: 'financeReviewer' },
        { label: '高管经办人', value: 'windOperator' },
        { label: '高管复核人', value: 'windReviewer' },
        { label: '客服岗', value: 'hotline' },
        { label: '门户管理岗', value: 'portal' },
        { label: '审核任务管理员', value: 'split_reviewer' },

      ];
      this.memoTemp = '不选任何角色就是只读用户';
    } else if (this.xn.user.orgType === 3) {
      selectOptionsArr = [
        { label: '业务经办人', value: 'operator' },
        { label: '业务复核人', value: 'reviewer' },
        { label: '客户经理经办人', value: 'customerOperator' },
        { label: '客户经理复核人', value: 'customerReviewer' },
        { label: '风险审查经办人', value: 'riskOperator' },
        { label: '风险审查复核人', value: 'riskReviewer' },
        { label: '财务经办人', value: 'financeOperator' },
        { label: '财务复核人', value: 'financeReviewer' },
        { label: '高管经办人', value: 'windOperator' },
        { label: '高管复核人', value: 'windReviewer' },
        { label: '查看权限', value: 'checkerLimit' },
        { label: '贷后管理岗 ', value: 'loaned' },

      ];
      this.memoTemp = '不选任何角色就是只读用户';
    }

    this.shows.push({
      name: 'userRoleList',
      required: false,
      type: 'checkbox',
      title: '用户角色',
      selectOptions: selectOptionsArr,
      memo: this.memoTemp
    });

    this.shows.push({
      name: 'cardType',
      required: true,
      type: 'select',
      title: '证件类型',
      value: '身份证',
      selectOptions: [
        { label: '身份证', value: '身份证' },
        { label: '护照', value: '护照' }
      ]
    });

    this.shows.push({
      name: 'cardNo',
      required: true,
      type: 'text',
      title: '证件号码',
      validators: {
        card: {
          name: 'cardType'
        }
      }
    });

    this.shows.push({
      name: 'mobile',
      required: true,
      type: 'text',
      title: '手机号',
      validators: {
        mobile: true
      }
    });

    this.shows.push({
      name: 'email',
      required: true,
      type: 'text',
      title: '邮件',
      validators: {
        email: true
      }
    });


    this.mainForm = XnFormUtils.buildFormGroup(this.shows);
    // console.log("shows: ", this.shows)
    // console.log("formValue: ", this.mainForm.value);

    this.mainForm.valueChanges.subscribe((v) => {
      this.formValid = this.mainForm.valid;
    });

    this.formValid = this.mainForm.valid;

    this.steped = parseInt(this.params.status);
    this.modal.open(ModalSize.XLarge);


    return Observable.create(observer => {
      this.observer = observer;
    });
  }

  private close(value) {
    this.modal.close();
    this.observer.next(value);
    this.observer.complete();
  }

  cssClass(step): string {
    if (step === this.steped) { return 'current'; }
    if (step > this.steped) { return 'disabled'; }
    else { return 'success'; }
  }

  onOk() {

  }

  onSubmit() {
    this.newUserRoleList = [];
    // console.log("SubmitformValue: ", this.mainForm.value);
    if (!this.mainForm.value.userRoleList) {
      this.mainForm.value.userRoleList = [];
    }
    const ctrlValueArr = this.mainForm.value.userRoleList
      && this.mainForm.value.userRoleList.length
      && this.mainForm.value.userRoleList.split(',');
    // console.log("ctrlValueArr: ", ctrlValueArr);

    const ctrlValueArrCN = [];

    for (let i = 0; i < ctrlValueArr.length; i++) {
      switch (ctrlValueArr[i]) {
        case 'operator':
          ctrlValueArrCN[i] = '业务经办人';
          break;
        case 'reviewer':
          ctrlValueArrCN[i] = '业务复核人';
          break;
        case 'windOperator':
          ctrlValueArrCN[i] = '高管经办人';
          break;
        case 'windReviewer':
          ctrlValueArrCN[i] = '高管复核人';
          break;
        case 'customerOperator':
          ctrlValueArrCN[i] = '客户经理经办人';
          break;
        case 'customerReviewer':
          ctrlValueArrCN[i] = '客户经理复核人';
          break;
        case 'riskOperator':
          ctrlValueArrCN[i] = '风险审查经办人';
          break;
        case 'riskReviewer':
          ctrlValueArrCN[i] = '风险审查复核人';
          break;
        case 'financeOperator':
          ctrlValueArrCN[i] = '财务经办人';
          break;
        case 'financeReviewer':
          ctrlValueArrCN[i] = '财务复核人';
          break;
        case 'checkerLimit':
          ctrlValueArrCN[i] = '查看权限';
          break;
        case 'hotline':
          ctrlValueArrCN[i] = '客服岗';
          break;
        case 'portal':
          ctrlValueArrCN[i] = '门户管理岗';
          break;
        case 'loaned':
          ctrlValueArrCN[i] = '贷后管理岗';
          break;
        case 'split_reviewer':
          ctrlValueArrCN[i] = '审核任务管理员';
          break;
        default:
          break;
      }
    }

    // console.log("newCtrlArr: ", ctrlValueArrCN);

    for (let i = 0; i < ctrlValueArr.length; i++) {
      this.newUserRoleList.push({
        roleId: ctrlValueArr[i],
        roleName: ctrlValueArrCN[i]
      });
    }
    // console.log("newUserRoleList: ", this.newUserRoleList);

    const postValue = {
      cardNo: this.mainForm.value.cardNo,
      cardType: this.mainForm.value.cardType,
      email: this.mainForm.value.email,
      mobile: this.mainForm.value.mobile,
      userName: this.mainForm.value.userName,
      userRoleList: this.newUserRoleList.filter(x => x.roleId !== '')
    };

    this.xn.api.post('/useroperate/insert_or_update_user', postValue).subscribe(json => {
      this.params.cardNo = this.mainForm.value.cardNo;
      this.params.cardType = this.mainForm.value.cardType;
      this.params.email = this.mainForm.value.email;
      this.params.mobile = this.mainForm.value.mobile;
      this.params.userName = this.mainForm.value.userName;
      this.params.userRoleList = this.newUserRoleList;
      this.params.userId = json.data.userId;

      this.close(this.params);
    });
  }
}
