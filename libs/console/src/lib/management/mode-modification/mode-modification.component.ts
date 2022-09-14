import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { FormGroup } from '@angular/forms';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { EnvEnum } from '../../../../../shared/src/lib/config/enum';

// 修改模式组件
@Component({
  selector: 'app-mode-modification',
  templateUrl: './mode-modification.component.html',
})
export class ModeModificationComponent implements OnInit, AfterViewChecked {

  public constructor(
    private xn: XnService,
    private cdr: ChangeDetectorRef,
  ) {
  }
  // 页面标题
  public pageTitle = '模式修改';
  // 输入内容
  public inputValue: string;
  // 初始对象
  public formModel: InputModel = new InputModel();
  mainForm: FormGroup;
  svrConfig = {
    productTree: {}
  };
  shows = [
    {
      checkerId: 'appName',
      memo: '',
      options: {readonly: true},
      required: 1,
      sortOrder: 2,
      title: '企业名称',
      type: 'text',
      validators: ''
    },
    {
      checkerId: 'defaultOrg',
      memo: '',
      options: {ref: 'patternWithAgency', change: 'patternWithAgency', readonly: true},
      required: 1,
      sortOrder: 2,
      title: '该机构的类型',
      type: 'mselect',
      validators: ''
    },
    {
      checkerId: 'orgRightInfo',
      memo: '',
      required: 1,
      sortOrder: 3,
      title: '该机构的权限',
      type: 'orgrightmodal',
      validators: ''
    },
  ];

  /** 是否生成环境 */
  get isProd() {
    return this.xn.user.env === EnvEnum.Production;
  }

  static buildChecker(stepRows) {
    for (const row of stepRows) {
      XnFormUtils.convertChecker(row);
    }
  }

  public ngOnInit() {
  }

  // 点击搜索 - 输入弹出
  public searchResult(val) {
    // 去除空白格
    const value = val.replace(/\s+/g, '');
    if (value === this.formModel.appName) {
      // 输入内容相同，不做任何操作
    } else {
      if (value !== undefined && value.length > 0) {
        this.xn.api.post('/jzn/product/get', {appName: value}).subscribe(x => {
          if (!!x.data) {
            this.formModel = x.data;
            this.shows.forEach((checker: any) => {
              checker.value = x.data[checker.checkerId];
              if (checker.checkerId === 'orgRightInfo') {
                const {orgRightInfo, productTree, defaultOrg} = x.data;
                checker.value = JSON.stringify({orgRightInfo, defaultOrg});
                this.svrConfig.productTree = productTree;
              }
            });
            this.buildForm();
          } else {
            this.mainForm = null;
          }
        });
      }

    }
  }

  //  保存修改模式
  public save() {
    const orgRightInfoFieldValue = this.mainForm.value.orgRightInfo;
    const params = {
      appId: this.formModel.appId,
      defaultOrg: this.formModel.defaultOrg,
      orgRightInfo: orgRightInfoFieldValue.orgRightInfo,
    };
    this.xn.api.post('/jzn/product/set', params).subscribe(() => {
      this.xn.msgBox.open(false, '保存成功',
        () => { // yes-callback
          // this.shows.forEach((checker: any) => { checker.value = '' });
        });
      // this.xn.msgBox.open(false, '保存成功');
    });
  }

  // 构建
  private buildForm() {
    XnFormUtils.buildSelectOptions(this.shows);
    ModeModificationComponent.buildChecker(this.shows);
    this.mainForm = XnFormUtils.buildFormGroup(this.shows);
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  /**
   * 跳转到新版模式修改
   */
  navToNew() {
    this.xn.router.navigate(['/console/manage/mode-edit-relate-right']);
  }
}

// 修改模型组件提交类
export class InputModel {
  // 企业名称
  public appName?: string;
  // 企业id
  public appId?: string;
  // 企业类型
  public orgType?: number;
  /** 同企业类型 */
  public defaultOrg?: string;
  // 产品id
  public custom?: string[];
  public orgright?: string;
}
