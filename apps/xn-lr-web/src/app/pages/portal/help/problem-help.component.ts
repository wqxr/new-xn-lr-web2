/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-lr-web\apps\src\app\pages\portal\help\help.component.ts
 * @summary：init help.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  zigui             init             2020-11-19
 ***************************************************************************/
import {Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { XnUtils } from '../shared/utils';
import { StoreService } from '../shared/services/store.service';
@Component({
  selector: 'problem-help',
  templateUrl: './problem-help.component.html',
  styleUrls: ['./help.component.less']
})
export class ProblemHelpComponent implements OnInit, AfterViewInit {
  @ViewChild('stepBoxWrap') stepBox: ElementRef;
  @ViewChild('slider') slider: ElementRef;
  problemType = {
    0: '所有常见问题',
    1: '账户登录相关问题',
    2: '企业信息相关问题',
    3: '业务资料环节问题',
    4: '付款完结后续问题',
  };
  problemList = [
    // 【账户登入相关问题】
    {
      Q: `使用什么浏览器登录平台？`,
      A: `建议使用360/谷歌/IE11版本浏览器或链融平台应用程序登录【链融科技供应链服务平台】（www.lrscft.com）。`,
      type: 1,
    },
    {
      Q: `收不到登录验证码，怎么办？`,
      A: `① 确认登录账号填写的手机号码准确且无空格；<br>② 确认该手机号码是否存在欠费等异常情况以致无法收取短信；<br>③ 如弹窗为“该账号无相应机构”，则联系系统管理员。系统管理员登录平台-左侧导航栏【管理功能】-【用户管理】查看该手机号有否添加。`,
      type: 1,
    },
    {
      Q: `系统管理员手机号码遗失，无法接收验证码登录平台，怎么办？`,
      A: `请联系链融客服或拨打链融平台服务电话：0755-29966132。`,
      type: 1,
    },
    // 【企业信息相关问题】
    {
      Q: `如何更换系统管理员/添加或删减经办人及复核人权限？`,
      A: `系统管理员登录平台-左侧导航栏【管理功能】-【用户管理】，可操作新增/更改/删除操作人员的用户信息以及权限调整。<br>业务经办人权限：上传资料；<br>业务复核人权限：资料复核及签署合同；<br><span style="color: #e15f63;">*</span>若是更换管理员，则在对应的用户处选择“转移”，如无相应用户，则先新增用户，再点“转移”。`,
      type: 2,
    },
    {
      Q: `为什么已添加的手机账号收不到各环节通知短信？`,
      A: `① 平台设置原因：系统管理员登录平台-左侧导航栏【管理功能】-【用户管理】，在相应手机号后面【勾选】接收短信；<br>② 自主排查原因：确认该手机号码是否存在欠费等异常情况以致无法收取短信，或是否被手机运营商归类为拦截短信。`,
      type: 2,
    },
    {
      Q: `企业名称或其他信息变更，需要进行哪些操作？`,
      A: `① 系统管理员登录平台-左侧导航栏【我的资料】-【企业资料】-【更新】；<br>② 如已申领电子签章工具，请联系链融客服，进行电子签章工具名称变更操作。`,
      type: 2,
    },
    // 【业务资料环节问题】
    {
      Q: `关于上传图片及文件格式？`,
      A: `上传的资料合计包括JPG、PNG、PDF三类格式，具体各项材料格式要求以上传资料界面提示为准。如需PDF转图片，可向链融客服获取格式转换软件或请客服协助转换。另确保上传的图片要素完整。`,
      type: 3,
    },
    {
      Q: `为什么上传资料后无法点击“同意”按钮？`,
      A: `① 确认界面内所有带*号的必填资料均已上传；<br>② 资料上传齐全，请点击【发票】-【查验】按钮，完成系统发票查验；或准确无误输入发票信息，完成手工发票查验。`,
      type: 3,
    },
    {
      Q: `为什么业务到了相应的经办上传/复核同意环节，首页却看不到待办？`,
      A: `① 登录平台-左侧导航栏【我的交易】-【保理通-XX（相应项目）】-【所有交易】-【交易状态】，确认该笔业务为待贵司操作的状态；<br>② 鼠标悬浮在首页右上角的用户名，查看弹窗内该账号权限（例如：业务待复核，若该账号无复核权限，则无法查看到相应待办事项）；<br>③ 如该账号无相应权限，则参考【如何更换系统管理员/添加或删减经办人及复核人权限】，由系统管理员登录平台为相应账号添加权限。`,
      type: 3,
    },
    {
      Q: `如何查看业务进度？`,
      A: `登录平台-左侧导航栏【我的交易】-【保理通-XX（相应项目）】-【所有交易】-【交易状态】，查看业务进展。`,
      type: 3,
    },
    // 【付款完结后续问题】
    {
      Q: `应收账款利息计算方法？`,
      A: `登录平台-左侧导航栏【我的工具】-【利息计算器】计算。附：利息计算公式：实收金额=应收账款金额-应收账款金额*【（保理费率/360）*（到期日-放款日）】。`,
      type: 4,
    },
    {
      Q: `应收账款转让相关业务材料如何下载？`,
      A: `登录平台-左侧导航栏【我的交易】-【保理通-XX（相应项目）】-【所有交易】-点击相应业务最左侧的【交易ID】-左下角【下载附件】，完成下载。`,
      type: 4,
    },
    {
      Q: `如何更新发票开票信息？`,
      A: `系统管理员登录平台-左侧导航栏【我的资料】-【企业资料】-【开票信息】-【更新】。`,
      type: 4,
    },
    {
      Q: `如何获取利息发票？`,
      A: `① 登录平台-左侧导航栏【我的交易】-【保理通-XX（相应项目）】-【台账】-【已开票】；<br>② 或登录系统管理员邮箱查收，发件人为”诺诺网“。`,
      type: 4,
    },
  ];
  tempList = [];
  problemByGroupList = [];
  currentProblemType: any = {};
  currentProblem: any = {};
  keyword = '';
  searchList = [];
  constructor(private store: StoreService) {
  }
  groupArray = (arr, prop) => {
    const typeArr = Array.from(new Set(arr.map(c => c[prop])));
    return typeArr.map(c => {
      const obj = {
        type: c,
        arr: [],
      };
      arr.forEach(d => {
        if (d[prop] === obj.type) { obj.arr.push(d); }
      });
      return obj;
    });
  }
  setSlider() {
    const sliderStyle: any = this.slider.nativeElement.style;
    const index = this.problemByGroupList.findIndex(c => c.type === this.currentProblemType.type);
    sliderStyle.top = 56 * index + 14 + 'px';
  }
  // 问题类型改变
  onChangeType(problem) {
    this.currentProblemType = problem;
    this.setSlider();
    this.currentProblem = this.currentProblemType.arr[0];
  }
  // 关键字搜索
  onSearch() {
    const sliderStyle: any = this.slider.nativeElement.style;
    this.searchList = [];
    const re = new RegExp(this.keyword, 'gi');
    this.currentProblemType = XnUtils.deepClone(this.problemByGroupList)[0];
    this.setSlider();
    const index = this.problemByGroupList.findIndex(c => c.type === this.currentProblemType.type);
    sliderStyle.top = 56 * index + 14 + 'px';
    if (!this.keyword.trim()) {
      this.currentProblemType = XnUtils.deepClone(this.problemByGroupList)[0];
      this.currentProblem = XnUtils.deepClone(this.currentProblemType.arr)[0];
      return;
    }
    const tempList = XnUtils.deepClone(this.tempList);
    tempList.forEach(c => {
      if (re.test(c.Q)) {
        c.Q = XnUtils.replaceKeywords(c.Q, this.keyword);
      }
      if (re.test(c.A)) {
        c.A = XnUtils.replaceKeywords(c.A, this.keyword);
      }
      if (re.test(c.Q) || re.test(c.A)) {
        this.searchList.push(c);
      }
    });
    this.currentProblemType.arr = XnUtils.deepClone(this.searchList);
    if (this.currentProblemType.arr.length) {
      this.currentProblem = XnUtils.deepClone(this.currentProblemType.arr)[0];
    }
  }
  ngOnInit() {
    const isLogin = this.store.getData('isLogin') === 'true';
    if (isLogin) {
      this.tempList = XnUtils.deepClone(this.problemList);
    } else {
      this.tempList = XnUtils.deepClone(this.problemList).filter(c => c.type === 1);
    }
    const obj = {
      type: 0,
      arr: this.tempList,
    };
    this.problemByGroupList = this.groupArray(this.tempList, 'type');
    this.problemByGroupList.unshift(obj);
    this.currentProblemType = XnUtils.deepClone(this.problemByGroupList)[0];
    this.currentProblem = XnUtils.deepClone(this.currentProblemType.arr)[0];
  }
  ngAfterViewInit() {
    const stepBoxStyle: any = this.stepBox.nativeElement.style;
    const sliderStyle: any = this.slider.nativeElement.style;
    XnUtils.addEvent(window, 'scroll', () => {
      const scrollTop: any = document.documentElement.scrollTop  || document.body.scrollTop;
      // // 步骤导航根据当前位置定位
      // 滚动条超过390px时，设置步骤导航为固定定位
      if (scrollTop > 390) {
        stepBoxStyle.position = 'fixed';
        stepBoxStyle.top = '120px';
      } else {
        stepBoxStyle.position = 'relative';
        stepBoxStyle.top = '0';
      }
    });
  }
}
