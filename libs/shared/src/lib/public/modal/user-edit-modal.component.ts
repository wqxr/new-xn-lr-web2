import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalComponent, ModalSize } from '../../common/modal/components/modal';
import { Observable, of } from 'rxjs';
import { XnService } from '../../services/xn.service';
import { FormGroup } from '@angular/forms';
import { XnFormUtils } from '../../common/xn-form-utils';
import { Router } from '@angular/router';

@Component({
  templateUrl: './user-edit-modal.component.html',
  styles: [
    `.panel { margin-bottom: 0 }`,
    `.xn-input-font { padding-top: 5px; font-weight: normal; color: #353535; margin-right: 20px }`
  ]
})
export class UserEditModalComponent implements OnInit {

  @ViewChild('modal') modal: ModalComponent;
  private observer: any;

  params: any = {} as any;
  steped = 0;
  rows: any[] = [];
  shows: any[] = [];
  powerShows: any[] = [];
  mainForm: FormGroup;
  formValid = false;
  roleNumber = 0;
  roleArr: any[] = [];
  roleString = '';
  roleArrTemp: any[] = [];
  paramsTemp: any = {} as any;
  paramsArrTemp: any[] = [];
  newUserRoleList: any[] = [];
  selectOptionsArrAdmin: any[] = [];
  selectOptionsArrNotAdmin: any[] = [];
  selectOptionsArrAdminFactory: any[] = [];
  selectOptionsArrAdminNotFactory: any[] = [];
  memoTemp = '';
  types: any[] = [];
  power: any = {} as any;

  constructor(private xn: XnService, private router: Router) {
  }

  ngOnInit() {
  }

  open(params: any): Observable<string> {
    this.params = params;
    this.types = params.types;

    // 处理数据
    console.log('editParams: ', this.params);
    for (let i = 0; i < this.params.userRoleList.length; i++) {
      if (this.params.userRoleList[i].roleId === 'operator') {
        this.roleArr.push('operator');
      } else if (this.params.userRoleList[i].roleId === 'reviewer') {
        this.roleArr.push('reviewer');
      } else if (this.params.userRoleList[i].roleId === 'admin') {
        this.roleArr.push('admin');
      } else if (this.params.userRoleList[i].roleId === 'windOperator') {
        this.roleArr.push('windOperator');
      } else if (this.params.userRoleList[i].roleId === 'windReviewer') {
        this.roleArr.push('windReviewer');
      } else if (this.params.userRoleList[i].roleId === 'customerOperator') {
        this.roleArr.push('customerOperator');
      } else if (this.params.userRoleList[i].roleId === 'riskOperator') {
        this.roleArr.push('riskOperator');
      } else if (this.params.userRoleList[i].roleId === 'riskReviewer') {
        this.roleArr.push('riskReviewer');
      } else if (this.params.userRoleList[i].roleId === 'financeOperator') {
        this.roleArr.push('financeOperator');
      } else if (this.params.userRoleList[i].roleId === 'financeReviewer') {
        this.roleArr.push('financeReviewer');
      } else if (this.params.userRoleList[i].roleId === 'windOperator') {
        this.roleArr.push('financeReviewer');
      } else if (this.params.userRoleList[i].roleId === 'windReviewer') {
        this.roleArr.push('windReviewer');
      } else if (this.params.userRoleList[i].roleId === 'customerReviewer') {
        this.roleArr.push('customerReviewer');
      } else if (this.params.userRoleList[i].roleId === 'checkerLimit') {
        this.roleArr.push('checkerLimit');
      } else if (this.params.userRoleList[i].roleId === 'loaned') {
        this.roleArr.push('loaned');
      } else if (this.params.userRoleList[i].roleId === 'hotline') {
        this.roleArr.push('hotline');
      } else if (this.params.userRoleList[i].roleId === 'portal') {
        this.roleArr.push('portal');
      } else if (this.params.userRoleList[i].roleId === 'split_reviewer') {
        this.roleArr.push('split_reviewer');
      } else if (this.params.userRoleList[i].roleId === '') {
        this.roleArr.push('');
      }
    }
    console.log('roleArr: ', this.roleArr);
    this.roleString = this.roleArr.join(',');

    this.shows = [];

    this.shows.push({
      name: 'userName',
      required: true,
      type: 'text',
      title: '用户姓名',
      validators: {
        cnName: true
      },
      value: this.params.userName
    });

    // console.log("orgType: ", this.xn.user.orgType)

    let selectOptionsArr = [];

    if ((this.roleArr.indexOf('admin') === -1) && this.xn.user.orgType !== 3 && this.xn.user.orgType !== 99
      && this.xn.user.orgType !== 2 && this.xn.user.orgType !== 201 && this.xn.user.orgType !== 202) {
      selectOptionsArr = [
        { label: '业务经办人', value: 'operator' },
        { label: '业务复核人', value: 'reviewer' },
      ];
      this.memoTemp = '不选任何角色就是只读用户';
    } else if ((this.roleArr.indexOf('admin') !== -1) && this.xn.user.orgType !== 3 && this.xn.user.orgType !== 99
      && this.xn.user.orgType !== 2 && this.xn.user.orgType !== 201 && this.xn.user.orgType !== 202) {
      selectOptionsArr = [
        { label: '管理员', value: 'admin', disabled: true },
        { label: '业务经办人', value: 'operator' },
        { label: '业务复核人', value: 'reviewer' },
      ];
    }
    // 给保理商和平台开放风控，核心企业也加上
    else if ((this.roleArr.indexOf('admin') === -1) && (this.xn.user.orgType === 2 || this.xn.user.orgType === 201
      || this.xn.user.orgType === 202)) {
      selectOptionsArr = [
        { label: '业务经办人', value: 'operator' },
        { label: '业务复核人', value: 'reviewer' },
        { label: '高管经办人', value: 'windOperator' },
        { label: '高管复核人', value: 'windReviewer' },
      ];
      this.memoTemp = '不选任何角色就是只读用户';
    } else if ((this.roleArr.indexOf('admin') !== -1) && (this.xn.user.orgType === 2 || this.xn.user.orgType === 201
      || this.xn.user.orgType === 202)) {
      selectOptionsArr = [
        { label: '管理员', value: 'admin', disabled: true },
        { label: '业务经办人', value: 'operator' },
        { label: '业务复核人', value: 'reviewer' },
        { label: '高管经办人', value: 'windOperator' },
        { label: '高管复核人', value: 'windReviewer' },
      ];
    } else if ((this.roleArr.indexOf('admin') === -1) && (this.xn.user.orgType === 99)) {
      selectOptionsArr = [
        { label: '管理员', value: 'admin', disabled: true },
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
    } else if ((this.roleArr.indexOf('admin') !== -1) && (this.xn.user.orgType === 99)) {
      selectOptionsArr = [
        { label: '管理员', value: 'admin', disabled: true },
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
        { label: '客服岗', value: 'hotline' },
        { label: '门户管理岗', value: 'portal' },
        { label: '审核任务管理员', value: 'split_reviewer' },];
    } else if ((this.roleArr.indexOf('admin') === -1) && (this.xn.user.orgType === 3)) {
      selectOptionsArr = [
        { label: '管理员', value: 'admin', disabled: true },
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
    } else if ((this.roleArr.indexOf('admin') !== -1) && (this.xn.user.orgType === 3)) {
      selectOptionsArr = [
        { label: '管理员', value: 'admin', disabled: true },
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
    }


    this.shows.push({
      name: 'userRoleList',
      required: false,
      type: 'checkbox',
      title: '用户角色',
      selectOptions: selectOptionsArr,
      value: this.roleString,
      memo: this.memoTemp
    });

    this.shows.push({
      name: 'cardType',
      required: true,
      type: 'select',
      title: '证件类型',
      selectOptions: [
        { label: '身份证', value: '身份证' },
        { label: '护照', value: '护照' }
      ],
      value: this.params.cardType,
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
      },
      value: this.params.cardNo
    });

    this.shows.push({
      name: 'mobile',
      required: true,
      type: 'text',
      title: '手机号',
      validators: {
        mobile: true
      },
      value: this.params.mobile
    });

    this.shows.push({
      name: 'email',
      required: true,
      type: 'text',
      title: '邮件',
      validators: {
        email: true
      },
      value: this.params.email
    });
    this.mainForm = XnFormUtils.buildFormGroup(this.shows);
    this.mainForm.valueChanges.subscribe((v) => {
      this.formValid = this.mainForm.valid;
    });

    this.formValid = this.mainForm.valid;

    this.modal.open(ModalSize.XLarge);

    return Observable.create(observer => {
      this.observer = observer;
    });
  }

  private close(value: string) {
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
    console.log('SubmitformValue: ', this.mainForm.value);
    if (!this.mainForm.value.userRoleList) {
      this.mainForm.value.userRoleList = [];
    }
    const ctrlValueArr = this.mainForm.value.userRoleList
      && this.mainForm.value.userRoleList.length
      && this.mainForm.value.userRoleList.split(',');
    console.log('ctrlValueArr: ', ctrlValueArr);

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
        case 'admin':
          ctrlValueArrCN[i] = '管理员';
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
        default:
          break;
      }
    }

    console.log('newCtrlArr: ', ctrlValueArrCN);

    for (let i = 0; i < ctrlValueArr.length; i++) {
      // if(ctrlValueArr[i] !== ''){
      this.newUserRoleList.push({
        roleId: ctrlValueArr[i],
        roleName: ctrlValueArrCN[i]
      });
      // }
    }
    console.log('newUserRoleList: ', this.newUserRoleList);
    if (parseInt(this.mainForm.value.mobile) !== parseInt(this.params.mobile) && (this.roleArr.indexOf('admin') !== -1)) {

      this.xn.msgBox.open(true, '系统检测到您修改了管理员手机号，确定修改手机号并重新登录？', () => {
        // 选择了是
        this.postEdit();
        // this.onLogout();
        // this.router.navigate(['/console']);
      }, () => {
        // 选择了否
        return;
      });

    }
    else {
      this.postEdit();
    }
  }

  onLogout() {
    this.xn.user.logoutNoRedirect();
  }

  // 将方法进行抽离
  postEdit() {
    this.roleArrTemp = this.params.userRoleList;

    // this.mainForm.value.userId = this.params.userId;
    const postValue = {
      cardNo: this.mainForm.value.cardNo,
      cardType: this.mainForm.value.cardType,
      email: this.mainForm.value.email,
      mobile: this.mainForm.value.mobile,
      userName: this.mainForm.value.userName,
      userRoleList: this.newUserRoleList,
      userId: this.params.userId
    };
    this.xn.api.post('/useroperate/insert_or_update_user', postValue).subscribe(json => {

      if (parseInt(this.mainForm.value.mobile) !== parseInt(this.params.mobile) && (this.roleArr.indexOf('admin') !== -1)) {
        this.xn.msgBox.open(false, '您的登录已经超时，请重新登录!', () => {
          this.router.navigate(['/login']);
        });
      } else {
        this.params.cardNo = this.mainForm.value.cardNo;
        this.params.cardType = this.mainForm.value.cardType;
        this.params.email = this.mainForm.value.email;
        this.params.mobile = this.mainForm.value.mobile;
        this.params.userName = this.mainForm.value.userName;
        this.params.userRoleList = this.newUserRoleList;

        this.close(this.params);
        if (this.roleArr.indexOf('admin') !== -1) {
          if (this.roleArrTemp.toString() !== this.mainForm.value.userRoleList.toString()) {
            this.xn.user.updateSession().subscribe(logined => {
              window.location.reload();
            });
          }
        }
      }

    });


  }
}
