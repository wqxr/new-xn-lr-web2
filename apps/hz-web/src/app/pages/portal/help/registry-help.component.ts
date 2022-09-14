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
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { XnUtils } from '../shared/utils';
import { Router, NavigationEnd  } from '@angular/router';
@Component({
  selector: 'registry-help',
  templateUrl: './registry-help.component.html',
  styleUrls: ['./help.component.less']
})
export class RegistryHelpComponent implements OnInit, AfterViewInit {
  @ViewChild('stepBoxWrap') stepBox: ElementRef;
  @ViewChild('slider') slider: ElementRef;
  @ViewChild('contentBox') contentBox: ElementRef;
  stepList: any[] = [
    {
      level: '第一步',
      name: '填写管理员信息',
      // desc: '（管理员具有新增用户/设置权限/移交管理员/申请数字证书等权限）',
      contentList: [
        {
          serial: 1,
          desc: `为方便您先期完成内部法审、授权等流程，您可在 此先行下载《授权确认函》(空白)，并准备《营业执照》，《授权确认函》在<a style="text-decoration: underline;color:#1D67C7;" href="/portal/help#3">【注册流程第四步--填写对公信息】</a>可下载已填写版本，只需打印并盖章。《营业执照》需提供<b style="color: rgba(31, 43, 56, 1)">彩色扫描件</b>或<b style="color: rgba(31, 43, 56, 1)">复印件加盖公章</b>（若需备注用途，可备注为“用于链融科技平台使用”）。<a style="text-decoration: underline;color:#1D67C7;" href="/portal/help#7">查看《授权确认函》文件填写要求</a>。`,
          tipStyle: { width: '200px', height: '55px', left: '290px', top: '200px' },
        },
        {
          serial: 2,
          desc: `根据提示准确填写信息并获取手机验证码。`,
          tipStyle: { width: '544px', height: '288px', left: '155px', top: '267px' },
        },
        {
          serial: 3,
          desc: `点击协议并阅读，完成阅读后点击【我已阅读并同意】。`,
          tipStyle: { width: '419px', height: '55px', left: '222px', top: '568px' },
        },
      ],
      tip: '后续若需更换系统管理员，则需要系统管理员登录链融平台，点击左侧导航【管理功能】-【用户管理】进入用户管理页面，选择需转移的用户，点击表格右侧操作列的【转移】即可。',
      order: {
        // 顺序，数值越大对应的html结合越靠后
        stepTip: 2,
        stepSubTip: 0,
        stepContent: 1,
      },
      imgStyle: {
        width: '960px',
        height: '761px',
      },
    },
    {
      level: '第二步',
      name: '填写企业信息',
      desc: '',
      contentList: [
        {
          serial: 4,
          desc: `法定代表人的证件类型可选择：身份证/港澳通行证/护照。`,
          tipStyle: { width: '505px', height: '48px', left: '180px', top: '366px' },
        },
        {
          serial: 5,
          desc: `请确保填写贵司实际经营地址，在平台签署各类协议时会提取该信息。`,
          tipStyle: { width: '505px', height: '48px', left: '180px', top: '471px' },
        },
      ],
      tip: '',
      subTip: '',
      order: {
        stepTip: 0,
        stepSubTip: 1,
        stepContent: 2,
      },
      imgStyle: {
        width: '960px',
        height: '665px',
      },
    },
    {
      level: '第三步',
      name: '创建CA数字证书管理员',
      // desc: '（CA数字证书管理员经企业授权，通过手机验证码代表企业签署电子合同）',
      contentList: [
        {
          serial: 6,
          desc: `若数字证书管理员为系统管理员，可勾选后直接获取第一步填写的信息，若不一致请根据提示填写信息。`,
          tipStyle: { width: '294px', height: '48px', left: '264px', top: '200px' },
        },
      ],
      tip: '注册流程从第三步（当前步骤）开始，即使关闭了页面，也能通过【登录】重新进入到当前注册流程中，无需重复操作前面的步骤。',
      subTip: '',
      order: {
        stepTip: 1,
        stepSubTip: 0,
        stepContent: 2,
      },
      imgStyle: {
        width: '960px',
        height: '582px',
      },
    },
    {
      level: '第四步',
      name: '填写对公信息',
      desc: '',
      contentList: [
        {
          serial: 7,
          desc: `请准确填写贵司银行账号信息，该账号将用于随机金额打款验证；开户银行无需填写支行信息。`,
          tipStyle: { width: '505px', height: '98px', left: '194px', top: '317px' },
        },
        {
          serial: 8,
          desc: `点击下载《授权确认函》，打印下来<b style="color: rgba(31, 43, 56, 1)">每页加盖公章+ 尾页法定代表人签字或加盖私章</b>，<a style="text-decoration: underline;color:#1D67C7;" href="/portal/help#7">查看《授权确认函》文件填写要求。</a>`,
          tipStyle: { width: '200px', height: '40px', left: '194px', top: '425px' },
        },
      ],
      tip: `如果贵司有平账需求，需要把打款验证的随机金额退回，可以打到以下账户，该账户专项用于接收打款验证的款项 （其他账户一律不可）：<b style="color: #EB4E54;">【需要注意：不可直接原路退回】</b>。
            <div>账号：0200003219068169009</div>
            <div>分支行：工商银行北京鼓楼支行</div>
            <div>户名：中金支付有限公司</div>`,
      subTip: '',
      order: {
        stepTip: 1,
        stepSubTip: 0,
        stepContent: 0,
      },
      imgStyle: {
        width: '960px',
        height: '632px',
      },
    },
    {
      level: '第五步',
      name: '小额打款验证',
      desc: '',
      contentList: [
        {
          serial: 9,
          desc: `请与贵司财务确认验证金额并准确填写。`,
          tipStyle: { width: '522px', height: '48px', left: '192px', top: '402px' },
        },
        {
          serial: 10,
          desc: `如需修改银行账户信息，可点击【修改对公账号信息】返回上一步进行修改。`,
          tipStyle: { width: '221px', height: '48px', left: '262px', top: '486px' },
        },
      ],
      tip: '',
      subTip: '',
      order: {
        stepTip: 0,
        stepSubTip: 0,
        stepContent: 0,
      },
      imgStyle: {
        width: '960px',
        height: '573px',
      },
    },
    {
      level: '第六步',
      name: '上传资料',
      desc: '',
      contentList: [
        {
          serial: 11,
          desc: `根据提示上传：《营业执照》、《授权确认函》;《营业执照》需提供<b style="color: rgba(31, 43, 56, 1)">彩色扫描件</b>或<b style="color: rgba(31, 43, 56, 1)">复印件加盖公章</b>（若需备注用途，可备注为“用于链融科技平台使用”）。《授权确认函》需上传彩色扫描件。`,
          tipStyle: { width: '530px', height: '216px', left: '167px', top: '206px' },
        },
        {
          serial: 12,
          desc: `请准确填写寄出授权确认函的快递单号。`,
          tipStyle: { width: '504px', height: '48px', left: '172px', top: '542px' },
        },
      ],
      tip: `注册流程会在T +1 个工作日内完成审核，审核结果将会通过短信通知， 若审核不通过，会有对接人反馈驳回原因，届时需点击平台右上角 <b style="color: #EB4E54;">【登录】</b> 进入到注册流程的最后一步，根据驳回原因修改并重新提交资料。`,
      subTip: '',
      order: {
        stepTip: 1,
        stepSubTip: 0,
        stepContent: 0,
      },
      imgStyle: {
        width: '960px',
        height: '715px',
      },
    },
    {
      level: '',
      name: '注册完成，完善开票信息',
      desc: '',
      contentList: [
        {
          serial: 13,
          desc: `根据提示准确填写弹窗内各项信息，若不清楚贵司开票信息可联系贵司财务获取。`,
          tipStyle: { width: '560px', height: '184px', left: '142px', top: '118px' },
        },
        {
          serial: 14,
          desc: `收件人信息仅为信息完善，不体现在开票中，可填写系统管理员信息。`,
          tipStyle: { width: '560px', height: '89px', left: '142px', top: '311px' },
        },
        {
          serial: 15,
          desc: `因购进的贷款服务进项税额不得抵扣，故融资利息开出的发票，均只能开具普票。`,
          tipStyle: { width: '560px', height: '30px', left: '142px', top: '436px' },
        },
        {
          serial: 16,
          desc: `该邮箱地址用于统一接收利息发票。`,
          tipStyle: { width: '560px', height: '40px', left: '142px', top: '473px' },
        },
        {
          serial: 17,
          desc: `填写完信息后点击【确定】按钮，并在相关沟通群里告知平台业务对接人。(<b style="color: rgba(31, 43, 56, 1)">后续如开票信息有更新，请及时登陆更新信息！</b>)`,
          tipStyle: { width: '86px', height: '44px', right: '44px', bottom: '23px' },
        },
      ],
      tip: '此功能用于贵司在平台发生业务后接收对应发票，请务必保证所填信息的准确性！',
      subTip: '收到链融科技发送的注册成功短信后，登录进入平台，通过左侧导航栏【我的资料】-【企业资料】进入企业资料页面，找到开票信息栏并点击【更新】按钮，完善开票信息。',
      order: {
        stepTip: 2,
        stepSubTip: 1,
        stepContent: 3,
      },
      imgStyle: {
        width: '960px',
        height: '625px',
      },
    },
    {
      level: '',
      name: '《授权确认函》文件要求',
      desc: '',
      contentList: [
        {
          serial: 18,
          desc: `填写系统管理员的姓名、手机号、证件号码、电子邮箱。`,
          tipStyle: { width: '373px', height: '160px', left: '172px', top: '446px' },
        },
        {
          serial: 19,
          desc: `填写数字证书管理员的姓名、手机号、证件号码。`,
          tipStyle: { width: '685px', height: '91px', left: '143px', top: '722px' },
        },
        {
          serial: 20,
          desc: `填写日期。`,
          tipStyle: { width: '318px', height: '46px', left: '526px', top: '1097px' },
        },
      ],
      tip: '',
      subTip: '',
      order: {
        stepTip: 0,
        stepSubTip: 0,
        stepContent: 0,
      },
      imgStyle: {
        width: '960px',
        height: '1205px',
      },
    },
  ];
  current: any = {};
  constructor(private router: Router) {}
  ngOnInit(): void {}
  ngAfterViewInit() {
    this.current = this.stepList[0];
    const stepBoxStyle: any = this.stepBox.nativeElement.style;
    const stepContent: any = this.contentBox.nativeElement.children;
    const sliderStyle: any = this.slider.nativeElement.style;
    XnUtils.addEvent(window, 'scroll', () => {
      const scrollTop: any = document.documentElement.scrollTop  || document.body.scrollTop;
      const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      // 步骤导航根据当前位置定位
      Array.from(stepContent).forEach((c: any, i: number) => {
        if (scrollTop >= c.offsetTop) {
          // 当前步骤
          this.current = this.stepList[i];
          // 滑块位置
          sliderStyle.top = (([6, 7].includes(i) ? 9 : 15) + 58 * i) + 'px';
        }
      });
      const space = clientHeight - (300 - ((scrollHeight - scrollTop) - clientHeight)) - 360;
      // 滚动条超过390px时，设置步骤导航为固定定位
      if (scrollTop > 390) {
        stepBoxStyle.position = 'fixed';
        if (scrollHeight > clientHeight && scrollTop + clientHeight >= scrollHeight - 300) {
          if (space > 175) {
            stepBoxStyle.top = '90px';
            stepBoxStyle.bottom = 'unset';
          } else {
            stepBoxStyle.top = 90 - ( 175 - space) + 'px';
            stepBoxStyle.bottom = 'unset';
          }
        } else {
          stepBoxStyle.top = '110px';
          stepBoxStyle.bottom = 'unset';
        }
        if (/#/.test(window.location.href)) {
          sliderStyle.right = '7px';
        } else {}
      } else {
        stepBoxStyle.position = 'relative';
        stepBoxStyle.top = 'unset';
        stepBoxStyle.bottom = 'unset';
        sliderStyle.right = '-1px';
      }
    });

    this.router.events
      .subscribe((data: NavigationEnd) => {
        if (data instanceof NavigationEnd) {
          if (/portal\/help#/.test(data.url)) {
            const num = +data.url.split('#')[1];
            if (num > 0) {
              sliderStyle.right = '7px';
            } else {
              sliderStyle.right = '-1px';
            }
          }
        }
      });
  }
}
