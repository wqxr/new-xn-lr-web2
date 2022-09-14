import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import {
  Component,
  OnInit,
  ViewContainerRef,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { SelectOptions, applyFactoringTtype } from 'libs/shared/src/lib/config/select-options';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { MfilesViewModalComponent } from '../../share/modal/mfiles-view-modal.component';
import { InvoiceDataViewModalComponent } from '../../share/modal/invoice-data-view-modal.component';
import { isNullOrUndefined } from 'util';
import { LoadingPercentService } from 'libs/shared/src/lib/services/loading-percent.service';
import {
  SingleListParamInputModel,
  SingleSearchListModalComponent,
} from 'libs/shared/src/lib/public/dragon-vanke/modal/single-searchList-modal.component';
import { forkJoin } from 'rxjs';
import * as _ from 'lodash';
import { EditNewVankeModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/edit-new-vanke-modal.component';
import { ZdSearchStatusEnum, ZdStatus } from 'libs/shared/src/lib/config/enum';

@Component({
  templateUrl: './zhongdeng-record.component.html',
  styles: [
    `
      .button-group .btn {
        width: 100px;
        margin-right: 20px;
      }
      .clearfix:after {
        content: '.';
        height: 0;
        display: block;
        clear: both;
      }
      .clearfix {
        zoom: 1;
      }
      .desc {
        word-wrap: break-word;
        min-height: 100px;
        max-height: 200px;
        overflow-y: scroll;
      }
      .read-write {
        min-height: 160px;
        padding: 5px;
        overflow-x: hidden;
        overflow-y: scroll;
      }
      .edit-separate {
        -webkit-user-modify: read-write;
      }
      .mask {
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background-color: @g53;
        z-index: 10000;
      }
    `,
  ],
})
export class ZhongdengRecordComponent implements OnInit {
  mainForm: FormGroup;
  info: any = {} as any;

  pageTitle = '';
  flowTitle = '保理商中登登记';
  // 登记业务类型
  public type: any = SelectOptions.get('registerType');
  // 登记期限
  public days: any = SelectOptions.get('registerDays');
  public companyType: any[] = SelectOptions.get('zhongdengCompanyType');
  public registerType = 0;
  public registerDays = 0;
  public show = true;
  public manual = false;

  public handRegister: {};
  public isFinish = false;
  public isJudge = false;
  public registerNum = '';
  public modifiedCode = '';
  public registerFile = [];
  public memo: string;
  // 处理文件传输需要的参数
  public obj: any;
  public afiles: any;
  public rfiles: any[] = []; //  登记证明文件
  public zdAttachmentFile: any[] = [];  // 中登附件

  public checkId: string;
  public assetFileList = [];
  public asset = {} as any;
  public showAlert = '资料已经提交请等待，是否跳转到中登登记列表';

  form1: FormGroup;
  form2: FormGroup;
  public ctrl1: AbstractControl;
  public formModule = 'dragon-input';
  public checker1 = [
    {
      title: '登记证明文件',
      checkerId: 'registerFile',
      type: 'dragonMfile',
      required: 1,
      checked: false,
      options: { fileext: 'jpg, jpeg, png, pdf', picSize: '500' },
      value: '',
    },
    {
      title: '中等附件',
      checkerId: 'zhongdengAttachment',
      type: 'newMfile',
      required: 1,
      checked: false,
      options: { fileext: 'jpg,pdf', picSize: '500' },
      value: '',
    },
  ];
  public options = { fileext: 'pdf' };
  public files = [];
  public flags = []; // 主题一致性
  public debtUnits = []; // 收款单位
  public companyTypesValue = []; //
  public alert = [];

  public registerId = -1;
  public typeLabel: string;
  public daysLabel: string;
  public status = -1;
  public amountTotal: string;
  public contractIdStr: string;
  public zhondengStatus: number;
  public desc: string;
  public maskshow = true;
  selectValue = '';
  public isChangeFile = false;
  public factoringOrgNameList = [];

  public isChangeCheck = false;
  public mainFlowList: any[] = [];
  public collateralDescribe: string;
  public zdStatus: number;
  public zdStatusUrl: string;
  public mainFlowIds: string[] = [];
  public initId: any; // 初始登记序号
  public get cancelCause() {
    return 'cancelCause';
  }
  timed: any;


  constructor(
    private xn: XnService,
    private router: Router,
    private route: ActivatedRoute,
    private publicCommunicateService: PublicCommunicateService,
    private vcr: ViewContainerRef,
    private cdr: ChangeDetectorRef,
    private loading: LoadingPercentService,
  ) { }

  ngOnInit() {
    this.router.events.subscribe((data) => {
      //路由导航结束之后处理
      if (data instanceof NavigationEnd) {
        clearInterval(this.timed);
      }
    });
    this.route.url.subscribe(x => {
      this.registerId = this.route.snapshot.params.id;
      const mainFlowId = this.route.snapshot.queryParams.mainFlowId;
      this.zhondengStatus = this.route.snapshot.params.status;
      this.getZDStatus();
      if (this.route.snapshot.queryParams.accountMask) {
        this.isChangeCheck = true;
      }
      this.xn.dragon
        .post('/zhongdeng/zd/getRegisterInfo', { registerId: this.registerId })
        .subscribe((json) => {
          if (json.ret === 0) {
            this.info = json.data.zdInfo;
            this.checkZDStatus(mainFlowId);
            this.buildTypeAndDays();
            this.status = this.info.status;
            this.amountTotal = '' + this.info.amountTotal;
            this.contractIdStr = this.info.contractIdStr;
            this.desc = this.info.desc;
            this.collateralDescribe = this.info.desc;
            this.registerType = this.info.registerType;
            this.registerDays = this.info.registerDays;
            this.memo = this.info.memo;
            this.modifiedCode = this.info.modifiedCode;
            this.registerNum = this.info.registerNum;
            this.checker1[0].value = this.info.registerFile;
            this.checker1[1].value = this.info.zhongdengAttachment;
            this.form1.get('zhongdengAttachment').setValue(this.info.zhongdengAttachment);
            this.initId = this.info.initId || null;
            if (this.status === ZhongDengStauts.FAIL) {
              const alert = [];
              try {
                const msg = JSON.parse(this.info.failMessage);
                /** 变量名由下划线转驼峰 */
                XnUtils.jsonToHump(msg);
                alert.push(msg.errmsg);
                if (msg.details.length !== 0) {
                  msg.details.forEach((x: any, i: number) => {
                    if (x.status === ZdSearchStatusEnum.CANCEL) {
                      const msgStr = `${i + 1}、<span style='color:red'>${x.name},${x.statusStr
                      },查询用时${x.useTimeStr}</span>`;
                      /** 有查询失败原因的就展示出来 */
                      const errmsg = x.failureCause ?
                      `${msgStr},<span style='color:red'>失败原因：${x.failureCause}</span>` : msgStr;
                      alert.push(errmsg);
                    } else {
                      const msgStr = `${i + 1}、${x.name},${x.statusStr},查询用时${x.useTimeStr}`;
                      /** 有查询失败原因的就展示出来 */
                      const errmsg = x.failureCause ? `${msgStr},失败原因：${x.failureCause}` : msgStr;
                      alert.push(errmsg);
                    }
                  });
                }
              } catch (error) {
                alert.push(this.info.failMessage);
              }

              this.xn.msgBox.open(false, alert);
            }
            for (let i = 0; i < this.info.list.length; i++) {
              this.flags[i] = this.info.list[i].flag;
              this.debtUnits[i] = this.info.list[i].debtUnit;
              this.factoringOrgNameList[i] = this.info.list[i].factoringOrgName;
              this.companyTypesValue[i] = this.info.list[i].companyType;
              this.files[i] = {
                mainFlowId: '',
              };
              this.files[i].mainFlowId = this.info.list[i].mainFlowId;
              // this.files[i].file = this.info.list[i].assetFile;

              this.alert[i] = '';
              // if(this.info)
              // asset1['mainFlowId'] = this.info.list[i].mainFlowId;
              // asset1['assetFile'] = this.info.list[i].assetFile;
              // asset1['flag'] = this.flags[i];
              // asset1['companyType'] = this.companyTypesValue[i];
            }
            this.cdr.markForCheck();
            this.timed = window.setInterval(() => {
              this.getZDStatus()
            }, 5000);
          }
        });

      // 防止服务器挂掉，后台轮循取消
      if (Number(this.zhondengStatus) === ZhongDengStauts.DOING) {
        this.xn.api.avenger
          .post('/sub_system/zd/get_register_status', {
            registerId: this.registerId,
          })
          .subscribe((x) => { });
      }

      XnFormUtils.buildSelectOptions(this.checker1);
      this.buildChecker(this.checker1);
      this.form1 = XnFormUtils.buildFormGroup(this.checker1);
      this.ctrl1 = this.form1.get('registerFile');
      this.form1.get('zhongdengAttachment').valueChanges.subscribe(x => {
        if (x && this.judgeDataType(JSON.parse(x)) && JSON.parse(x).length > 0) {
          this.zdAttachmentFile = JSON.parse(x);
        } else {
          this.zdAttachmentFile = [];
        }
      })
      this.ctrl1.valueChanges.subscribe((x) => {
        if (x && this.judgeDataType(JSON.parse(x)) && JSON.parse(x).length > 0) {
          this.rfiles = JSON.parse(x);
        } else {
          this.rfiles = [];
        }

      });
    });

  }

  /**
  * 开启轮循任务  告知有人正在操作这个界面
  */
  getZDStatus() {
    this.xn.dragon.postMap('/zhongdeng/zd/zd_operate_create_cache', { registerId: this.registerId }).subscribe(x => {
      if (x.ret === 0) {
      } else {
        clearInterval(this.timed);
      }
    })
  }
  ngAfterViewChecked() {
    if (this.isFinish && !this.isJudge) {
      this.judgeValue();
    }
  }

  /***
   * checkZDStatus --检测中登状态
   * 1：登记中，  6：已变更，8 ：已注销
   */
  public checkZDStatus(mainFlowId) {
    this.xn.dragon
      .post2('/zhongdeng/zd/checkZDStatus', { registerId: this.registerId })
      .subscribe((x) => {
        if (x.ret === 0) {
          this.zdStatus = x.data.status;
          if (this.zdStatus === 6) {
            this.zdStatusUrl = `/machine-account/zhongdeng/record/${x.data.lastestId}/${x.data.lastestStatus}`;
          }
          if (
            this.zdStatus === 1 ||
            this.zdStatus === 6 ||
            this.zdStatus === 8
          ) {
            return;
          } else {
            if (mainFlowId) {
              const mainFlowList = [];
              this.info.list.forEach((item, index) => {
                if (mainFlowId === item.mainFlowId) {
                  item.checked = true;
                  mainFlowList.push({
                    index: index + 1,
                    mainFlowId: item.mainFlowId,
                  });
                }
              });
              this.checkBookPre(mainFlowList);
            }
          }
        }
      });
  }
  public zdStatusBtn() {
    this.xn.router.navigate([this.zdStatusUrl]);
    // this.ngOnInit();
  }
  // 跳转到初始登记列表
  public toInitLink() {
    this.xn.router.navigate([`/machine-account/zhongdeng/record/${this.initId}/6`]);
  }
  getCompanytype(e, i: number, paramMainflowId) {
    this.companyTypesValue[i] = Number(e.target.value);
    for (let j = 0; j < this.debtUnits.length; j++) {
      if (this.debtUnits[j] === this.debtUnits[i] && j !== i) {
        this.companyTypesValue[j] = this.companyTypesValue[i];
      }
    }
  }
  public arrayLength(paramFileInfos: any) {
    if (!paramFileInfos) {
      return false;
    }
    const obj =
      typeof paramFileInfos === 'string'
        ? paramFileInfos.split(',')
        : [paramFileInfos];
    return obj;
  }

  public viewMore(param) {
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      InvoiceDataViewModalComponent,
      param
    ).subscribe(() => { });
  }

  private buildChecker(stepRows) {
    for (const row of stepRows) {
      XnFormUtils.convertChecker(row);
    }
  }

  public buildTypeAndDays() {
    const obj1 = []
      .concat(this.type)
      .find(
        (x: any) => x.value.toString() === this.info.registerType.toString()
      );
    this.typeLabel = obj1 ? obj1.label : '';
    this.daysLabel = this.info.registerDays;
  }
  // 登记业务类型查询
  public changeType(val) {
    this.registerType = Number(val);
    this.info.registerType = this.registerType;
  }

  // 登记期限查询
  public changeDays(val) {
    this.registerDays = Number(val);
    this.info.registerDays = this.registerDays;
  }

  public isNotShow() {
    this.show = false;
  }

  public isShow() {
    this.show = !this.show;
  }
  // 修改中登文件  状态重新变成5待登记
  changeFile() {
    this.isChangeFile = true;
    this.info.status = 5;
    this.status = 5;
    this.isFinish = false;
    this.manualRegister();
  }

  public manualRegister() {
    if (!this.isChangeFile) {
      document
        .getElementsByClassName('registerNum')[0]
        .removeAttribute('disabled');
      document
        .getElementsByClassName('modifiedCode')[0]
        .removeAttribute('disabled');
    }

    this.isFinish = true;

    this.manual = true;
    this.ctrl1.setValue(this.info.registerFile);
    this.form1.get('zhongdengAttachment').setValue(this.info.zhongdengAttachment);
    for (let i = 0; i < this.info.list.length; i++) {
      this.flags[i] = this.info.list[i].flag;
      this.debtUnits[i] = this.info.list[i].debtUnit;
      this.companyTypesValue[i] = this.info.list[i].companyType;
      this.files[i] = {
        mainFlowId: '',
      };

      this.files[i].mainFlowId = this.info.list[i].mainFlowId;
      if (!!this.info.list[i].assetFile) {
        this.files[i].file = JSON.parse(this.info.list[i].assetFile)[0];
      }
      // else {
      //     this.files[i].file = '';
      //     this.info.list[i].assetFile = '';
      // }
      this.assetFileList = this.info.list.map((item) => {
        const { flag, mainFlowId, companyType, assetFile } = item;
        return {
          flag,
          mainFlowId,
          companyType,
          assetFile,
        };
      });
      this.alert[i] = '';
    }
  }

  // 显示最下面一排操作按钮  登记失败或者待登记
  showOperatebutton(): boolean {
    return (
      this.status === ZhongDengStauts.READY ||
      this.status === ZhongDengStauts.FAIL
    );
  }
  public manualRegisterFinish() {
    // this.buildAssetFileList();
    this.buildRegisterFile();

    this.info.modifiedCode = this.modifiedCode;
    this.info.registerNum = this.registerNum;
    this.info.memo = this.memo ? this.memo : '';
    this.assetFileList.forEach((asset, index) => {
      asset.companyType = this.companyTypesValue[index];
    });
    this.handRegister = {
      registerId: this.registerId,
      registerType: this.registerType,
      registerDays: this.registerDays,
      contractIdStr: this.contractIdStr,
      amountTotal: parseFloat(this.amountTotal),
      desc: this.desc,
      registerNum: this.registerNum,
      modifiedCode: this.modifiedCode,
      registerFile: JSON.stringify(this.registerFile),
      zhongdengAttachment: JSON.stringify(this.zdAttachmentFile),
      memo: this.memo ? this.memo : '',
      assetFileList: this.assetFileList,
    };
    this.xn.dragon
      .post('/zhongdeng/zd/handRegister', this.handRegister)
      .subscribe((x) => {
        if (x.ret === 0) {
          this.isJudge = true;
          this.info.status = 3;
          this.status = 3;
          this.manual = false;
          this.info.registerType = this.registerType;
          this.info.registerDays = this.registerDays;
          this.assetFileList.forEach((x, i) => {
            this.info.list[i].assetFile = this.assetFileList[i].assetFile;
          });
          // 人工登记完成，人工登记、取消登记按钮不可用
          this.registerFinish();
          this.buildTypeAndDays();
          this.cdr.markForCheck();
          this.xn.msgBox.open(true, '已完成登记,是否跳转到中登登记列表', () => {
            window.history.go(-1);
          });
        }
      });
  }

  public onBeforeUpload(e, i) {
    if (this.files[i].file) {
      e.preventDefault();
      this.xn.msgBox.open(false, '请先删除已上传的文件，才能上传新文件');
      return;
    }
  }

  viewPersonInfo(type: number) {
    let companylist = [];
    if (type === 1) {
      companylist = _.sortedUniq(this.debtUnits);
    } else {
      companylist = _.sortedUniq(this.factoringOrgNameList);
    }
    // this.debtUnits = _.sortedUniq(this.debtUnits);
    const mainFlowIds$ = companylist.map((temp) =>
      this.xn.api.post('/custom/dragon/verify_business_file/get_seller_info', {
        orgName: temp,
      })
    );
    forkJoin(mainFlowIds$).subscribe(async (x: any) => {
      const dataInfo = x.map((x: any) => x.data);
      const params: SingleListParamInputModel = {
        title: `${ModalTitle[type]}`,
        get_url: '',
        get_type: '',
        multiple: null,
        heads: [
          { label: '注册资本', value: 'registCapi', type: 'text' },
          { label: '组织机构代码', value: 'orgNo', type: 'text' },
          { label: '工商注册号', value: 'no', type: 'text' },
          { label: '法定代表人', value: 'operName', type: 'text' },
          { label: '所属行业', value: 'econKind', type: 'text' },
          { label: '注册地址', value: 'address', type: 'text' },
          // { label: '发票文件', value: 'invoiceFile',type: 'file' },
        ],
        searches: [],
        key: '',
        data: dataInfo || [],
        total: dataInfo.length || 0,
        inputParam: {},
        rightButtons: [{ label: '确定', value: 'submit' }],
      };
      if (type === 1) {
        params.heads.unshift({
          label: '收款单位',
          value: 'orgName',
          type: 'text',
        });
      } else {
        params.heads.unshift({ label: '单位', value: 'orgName', type: 'text' });
      }
      XnModalUtils.openInViewContainer(
        this.xn,
        this.vcr,
        SingleSearchListModalComponent,
        params
      ).subscribe((v) => {
        if (v === null) {
          return;
        }
      });
    });
  }

  public onUploadFile(e, id, i, companyType) {
    if (e.target.files.length === 0) {
      return;
    }
    const err = this.validateFileExt(e.target.files[0].name);
    if (err.length > 0) {
      this.alert[i] = err;

      // 把file input的值置为空，这样下次选择同一个文件还能触发这个请求
      $(e.target).val('');
      return;
    } else {
      this.alert[i] = '';
    }
    if (e.target.files[0].size / (1024 * 1024) > 80) {
      this.xn.msgBox.open(false, '很抱歉，您允许上传的图片不能超过80M，谢谢');
      return;
    }

    const fd = new FormData();
    fd.append('file_data', e.target.files[0], e.target.files[0].name);
    this.loading.open(1, 0);
    this.xn.dragon.upload('/file/pdfWk', fd).subscribe((v) => {
      if (v.type === 'complete') {
        if (v.data.ret === 0) {
          this.files[i].file = {
            fileName: v.data.data.fileName,
            fileId: v.data.data.fileId,
            filePath: v.data.data.filePath,
          };
          if (v.data.data.orgName === this.debtUnits[i]) {
            this.flags[i] = 1;
          } else {
            this.flags[i] = 2;
          }
          this.pushAsset(i, id);
          this.showAsset(i);
          this.loading.close();
        }
      }
    });
  }
  // 人工登记和完成人工登记按钮是否可操作
  manualShow() {
    return (
      this.info.status === ZhongDengStauts.DONE ||
      this.info.status === ZhongDengStauts.DOING
    );
  }
  // 系统登记按钮是否可用
  systemShow(): boolean {
    let companyType = false;
    this.info.list.forEach((x, index) => {
      if (!!!this.companyTypesValue[index]) {
        companyType = true;
      }
    });
    return (
      this.info.status === ZhongDengStauts.DONE ||
      this.info.status === ZhongDengStauts.DOING ||
      this.manual ||
      !this.registerType ||
      !this.registerDays ||
      !this.desc ||
      companyType
    );
  }

  systemRegister() {
    const infos = [];
    this.info.list.forEach((x, index) => {
      infos.push({
        mainFlowId: x.mainFlowId,
        companyType: this.companyTypesValue[index],
      });
    });
    this.buildRegisterFile();
    this.info.modifiedCode = this.modifiedCode;
    this.info.registerNum = this.registerNum;

    this.handRegister = {
      registerId: this.registerId,
      registerType: this.registerType,
      registerDays: this.registerDays,
      collateralDescribe: this.desc,
      contractIdStr: this.contractIdStr,
      zhongdengAttachment: JSON.stringify(this.zdAttachmentFile),
      assetFileList: infos,
      amountTotal: this.amountTotal
    };
    // this.xn.loading.open();
    this.xn.avenger
      .post2('/sub_system/zd/system_register', this.handRegister)
      .subscribe((x) => {
        // this.xn.loading.close();
        if (x.ret === 0) {
          this.xn.msgBox.open(
            true,
            this.showAlert,
            () => {
              this.info.status = ZhongDengStauts.DOING;
              this.status = ZhongDengStauts.DOING;
              this.xn.user.navigateBack();
            },
            () => {
              this.info.status = ZhongDengStauts.DOING;
              this.status = ZhongDengStauts.DOING;
            }
          );
          // this.modifiedCode = x.data['modifiedCode'];
          // this.registerNum = x.data['registerNum'];
          // this.info.registerNum = x.data['registerNum'];
          // this.info.modifiedCode = x.data['registerNum'];
          // this.info.status = 3;
          // this.manual = false;
          // this.info['registerType'] = this.registerType;
          // this.info['registerDays'] = this.registerDays;
          // this.buildTypeAndDays();
          // this.info.registerFile = x.data['registerFile'];
          // for (let i = 0; i < x.data.assetList.length; i++) {
          //     this.files[i] = {
          //         mainFlowId: ''
          //     };
          //     this.files[i]['mainFlowId'] = x.data.assetList[i].mainFlowId;
          //     this.alert[i] = '';
          //     this.files[i].file = x.data.assetList[i].assetFile;
          //     this.info.list[i].assetFile = x.data.assetList[i].assetFile;
          // }
          // this.cdr.markForCheck();
          // $('.xn-msgbox-msg span').text('已完成系统中等登记，是否跳转到台账列表');
        } else {
          this.xn.msgBox.open(
            true,
            `${x.msg},是否跳转到中登登记列表`,
            () => {
              this.info.status = ZdStatus.REGISTER_FAIL;
              clearInterval(this.timed);
              window.history.go(-1)
            },
            () => { }
          );
        }
      });
    // this.maskshow = false;
  }

  /**
   * 上传的文件将其放入到assetFileList
   * @param {*} i
   * @param {*} id
   */
  public pushAsset(i, id) {
    const asset1 = {} as any;
    const array = [];
    array.push(this.files[i].file);
    asset1.mainFlowId = id;
    asset1.assetFile = JSON.stringify(array);
    asset1.flag = this.flags[i];
    asset1.companyType = this.companyTypesValue[i];
    // this.assetFileList.push(asset1);
    this.assetFileList.forEach((x) => {
      if (x.mainFlowId === id) {
        x.mainFlowId = id;
        x.assetFile = JSON.stringify(array);
        x.flag = this.flags[i];
        x.companyType = this.companyTypesValue[i];
      }
    });
  }

  /**
   * 如果有相同收款单位那么查询证明文件相同，也同步显示
   * @param {*} i
   */
  public showAsset(i) {
    for (let j = 0; j < this.debtUnits.length; j++) {
      if (this.debtUnits[j] === this.debtUnits[i] && j !== i) {
        this.flags[j] = this.flags[i];
        this.companyTypesValue[j] = this.companyTypesValue[i];
        this.files[j].file = this.files[i].file;
        this.pushAsset(j, this.files[j].mainFlowId);
      }
    }
  }

  public onRemove(id, j) {
    delete this.files[j].file;
    this.flags[j] = 0;
    const div = document.getElementsByClassName('asset')[j];
    const input = div.getElementsByTagName('input')[0];
    input.value = '';
    for (let i = 0; i < this.assetFileList.length; i++) {
      if (this.assetFileList[i].mainFlowId === id) {
        this.assetFileList[i].assetFile = null;
      }
    }
    // 有相同的收款单位时，查询证明文件删除那么其余也同步
    for (let z = 0; z < this.debtUnits.length; z++) {
      if (this.debtUnits[z] === this.debtUnits[j] && z !== j) {
        delete this.files[z].file;
        this.flags[z] = 0;
        const div = document.getElementsByClassName('asset')[z];
        const input = div.getElementsByTagName('input')[0];
        input.value = '';
        for (let i = 0; i < this.assetFileList.length; i++) {
          if (this.assetFileList[i].mainFlowId === this.files[z].mainFlowId) {
            this.assetFileList[i].assetFile = null;
          }
        }
      }
    }
  }

  /**
   *  验证所选文件格式，根据文件后缀
   * @param s 文件全名
   */
  private validateFileExt(s: string) {
    if (isNullOrUndefined(this.options)) {
      return '';
    }
    if ('fileext' in this.options) {
      const exts = this.options.fileext.replace(/,/g, '|').replace(/\s+/g, ''); // 删除所有空格
      if (s.match(new RegExp('\\.(' + exts + ')$', 'i'))) {
        return '';
      } else {
        return `只支持以下文件格式: ${this.options.fileext}`;
      }
    } else {
      return '';
    }
  }

  public buildRegisterFile() {
    this.registerFile = [];
    for (let i = 0; i < this.rfiles.length; i++) {
      const file = {} as any;
      file.fileId = this.rfiles[i].fileId;
      file.fileName = this.rfiles[i].fileName;
      file.filePath = this.rfiles[i].filePath;
      this.registerFile.push(file);
    }
    this.info.registerFile =
      this.registerFile.length > 0 ? JSON.stringify(this.registerFile) : '';
  }

  public cancelRegister() {
    this.xn.dragon
      .post('/zhongdeng/zd/cancelRegister', {
        registerId: this.info.registerId,
      })
      .subscribe((x) => {
        if (x.ret === 0) {
          this.onCancel();
        }
      });
  }

  public registerFinish() {
    if (!this.isChangeFile) {
      document
        .getElementsByClassName('handRe')[0]
        .setAttribute('disabled', 'disabled');
      document
        .getElementsByClassName('cancelRe')[0]
        .setAttribute('disabled', 'disabled');
    }
    // let cancel = document.getElementsByClassName('pull-left')[0];
    // if (!cancel.hasAttribute('disabled')) {
    //     cancel.setAttribute('disabled', 'disabled');
    // }
  }

  /**
   *  取消并返回
   */
  public onCancel() {
    clearInterval(this.timed);
    if (Number(this.zhondengStatus) === ZdStatus.REGISTER_READY) {
      const list = [];
      this.buildRegisterFile();
      this.assetFileList.forEach((asset, index) => {
        asset.companyType = this.companyTypesValue[index];
      });
      this.info.modifiedCode = this.modifiedCode;
      this.info.registerNum = this.registerNum;
      this.info.memo = this.memo ? this.memo : '';
      this.handRegister = {
        registerId: this.registerId,
        registerType: this.registerType,
        registerDays: this.registerDays,
        contractIdStr: this.contractIdStr,
        amountTotal: parseFloat(this.amountTotal),
        desc: this.desc,
        registerNum: this.registerNum,
        modifiedCode: this.modifiedCode,
        registerFile: JSON.stringify(this.registerFile),
        zhongdengAttachment: JSON.stringify(this.zdAttachmentFile),
        memo: this.memo ? this.memo : '',
        assetFileList: this.assetFileList,
      };
      list.push(this.handRegister);
      this.xn.dragon
        .post('/zhongdeng/zd/save_register', { list })
        .subscribe((x) => {
          if (x.ret === 0) {
            this.xn.user.navigateBack();
          }
        });
    } else {
      this.xn.user.navigateBack();
    }
  }

  /**
   *  判断数据类型
   * @param paramValue
   */
  public judgeDataType(paramValue: any): boolean {
    if (typeof Array.isArray === 'function') {
      return Array.isArray(paramValue);
    } else {
      return Object.prototype.toString.call(paramValue) === '[object Array]';
    }
  }

  /**
   * 点击完成跳转到列表页面
   */
  // public onFinish() {
  //     this.xn.router.navigate(['machine-account/zhongdeng-list']);
  // }

  // 判断是否填完人工登记所需要的值
  public judgeValue() {
    if (
      this.registerType !== 0 &&
      this.registerDays !== 0 &&
      this.registerNum.length !== 0 &&
      this.modifiedCode.length !== 0 &&
      this.rfiles &&
      this.rfiles.length !== 0 &&
      this.desc.length !== 0 &&
      this.amountTotal.length !== 0
    ) {
      this.files.every((file) => {
        if (file.file) {
          document
            .getElementsByClassName('handRe')[0]
            .removeAttribute('disabled');
          return true;
        } else {
          document
            .getElementsByClassName('handRe')[0]
            .setAttribute('disabled', 'disabled');
        }
      });
    } else {
      document
        .getElementsByClassName('handRe')[0]
        .setAttribute('disabled', 'disabled');
    }
  }

  /**
   *  查看文件信息
   * @param paramFile
   */
  public viewFiles(paramFile) {
    let array = [];
    if (paramFile !== '' && typeof paramFile === 'string') {
      // 如果是json转为js
      const param = JSON.parse(paramFile);
      // 转换后验证是否为对象，如果是放进数组里
      if (!Array.isArray(param)) {
        array.push(param);
      } else {
        array = param;
      }
    } else {
      array.push(paramFile);
    }
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      MfilesViewModalComponent,
      array
    ).subscribe();
  }

  /**
   * 去变更登记、撤销登记
   * @param status
   */
  public goChange(status: number) {
    if (status === ZdStatus.REGISTER_PROGRESS) {
      if (this.isChangeCheck === false) {
        setTimeout(() => {
          this.form1.get('zhongdengAttachment').setValue(this.info.zhongdengAttachment);
        }, 0);
        return (this.isChangeCheck = true);
      }
      if (this.mainFlowIds.length < 1) {
        return this.xn.msgBox.open(false, '请先勾选选项，再提交变更登记');
      }
      this.xn.avenger
        .post2('/sub_system/zd/amend_register', {
          registerId: this.registerId,
          mainFlowIds: this.mainFlowIds,
          amountTotal: this.amountTotal,
          zhongdengAttachment: JSON.stringify(this.zdAttachmentFile),
          collateralDescribe: $('.edit-separate').text(),
        })
        .subscribe((x) => {
          if (x.ret === 0) {
            return this.xn.msgBox.open(true, '提交成功', () => {
              this.xn.user.navigateBack();
            });
          }
        });
    }
    if (status === ZdStatus.REGISTER_FAIL) {
      const params = {
        title: '注销登记',
        checker: [
          {
            checkerId: 'terminateReason',
            required: 1,
            type: 'select',
            options: { ref: this.cancelCause },
            title: '注销原因',
          },
          {
            title: '描述',
            checkerId: 'terminateReasonDesc',
            type: 'textarea',

            placeholder: '请输入不超过50个字符',
            validators: {
              maxlength: 50,
            },
            required: 1,
            options: {},
            value: '',
          },
        ],
        buttons: ['取消', '提交'],
      };
      XnModalUtils.openInViewContainer(
        this.xn,
        this.vcr,
        EditNewVankeModalComponent,
        params
      ).subscribe((x) => {
        if (x) {
          this.xn.avenger
            .post2('/sub_system/zd/terminate_register', {
              registerId: this.registerId,
              terminateReason: x.terminateReason,
              terminateReasonDesc: x.terminateReasonDesc,
            })
            .subscribe((res) => {
              if (res.ret === 0) {
                return this.xn.msgBox.open(true, '注销成功', () => {
                  this.xn.user.navigateBack();
                });
              }
            });
        }
      });
    }
  }
  // 注销登记 注销登记的显示与隐藏
  public changeOrCancel() {
    return this.isChangeCheck || (this.info.status !== ZhongDengStauts.READY && this.info.status !== ZhongDengStauts.FAIL && this.info.status !== ZhongDengStauts.CHANGED)
  }

  /**
   * 查看更改过的内容
   */
  public checkChangeContent() {
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      MfilesViewModalComponent,
      [1]
    ).subscribe();
  }
  /**
   * 获取业务变更更新信息
   */
  public checkBookPre(mainFlowList) {
    if (mainFlowList.length > 0) {
      this.mainFlowList = mainFlowList;
      this.mainFlowIds.push(this.mainFlowList[0].mainFlowId);
    }
    const regArr = this.desc.match(/\((\d+)[^\(]+/g); // 获取字符串小括号系列分割成数组
    const regContent = this.desc.match(/(\(|（)(\d+)(\)|）)/g); // 获取有无小括号内容
    const regSort = (str) => /(\(|（)(\d+)(\)|）)/g.exec(str)[2]; // 获取数字顺序
    const elementEnd = regArr[regArr.length - 1].substring(
      0,
      regArr[regArr.length - 1].lastIndexOf('发票使用明细以中登附件为准。')
    ); // 去掉尾部文字
    if (elementEnd) {
      regArr.pop();
      regArr.push(elementEnd);
    }
    const originalArr = regArr.map((item: string, index: number) =>
      Object.assign({ text: item, index: index + 1 })
    );
    if (!regContent) {
      return this.xn.msgBox.open(false, '原财产描述序号有问题，请手动修改');
    } else {
      // 当顺序不连续时，无法变更
      const regNumberArr: number[] = regContent.map((item) =>
        Number(regSort(item))
      );
      let mask = false;
      regNumberArr.forEach((item, index) => {
        index + 1 === item ? (mask = false) : (mask = true);
      });
      if (regNumberArr[0] !== 1 || mask) {
        return this.xn.msgBox.open(false, '原财产描述序号有问题，请手动修改');
      }
      this.xn.dragon
        .post2('/zhongdeng/zd/checkBookPre', {
          registerId: this.registerId,
          mainFlowList: this.mainFlowList,
        })
        .subscribe((json) => {
          if (json.ret === 0) {
            const data = json.data;
            this.mainFlowIds = [];
            data.map((item) => {
              item.collateralDescribe = `(${item.index})${item.collateralDescribe}`;
              this.mainFlowIds.push(item.mainFlowId);
            });
            data.forEach((item) => {
              originalArr.filter((val) => {
                if (item.index === val.index) {
                  val.text = `<span style="background: #3390FF;color: #ffffff;">${item.collateralDescribe}</span>`;
                }
              });
            });
            this.collateralDescribe = `${originalArr
                .map((item) => item.text)
                .join('')}以上登记信息到期时间，均以回款时间为准。`
          }
        });
    }
  }
  /**
   *  判断列表项是否全部选中
   */
  public isAllChecked(): boolean {
    if (this.info.list.length > 0) {
      return !(
        this.info.list.some(
          (x) => !x.checked || (x.checked && x.checked === false)
        ) || this.info.list.length === 0
      );
    }
  }
  public generateArr(index, item) {
    this.mainFlowList.push({ index: index + 1, mainFlowId: item.mainFlowId });
    this.mainFlowIds.push(item.mainFlowId);
  }
  /**
   *  全选
   */
  public checkAll() {
    this.mainFlowList = [];
    this.mainFlowIds = [];
    if (!this.isAllChecked()) {
      this.info.list.forEach((item, index) => {
        item.checked = true;
        if (item.checked === true) {
          this.generateArr(index, item);
        }
      });
      this.checkBookPre([]);

    } else {
      this.info.list.forEach((item) => (item.checked = false));
      this.collateralDescribe = this.desc;

    }
  }
  /**
   * 单选
   * @param paramItem
   */
  public singleChecked(paramItem) {
    if (paramItem.checked && paramItem.checked === true) {
      paramItem.checked = false;
      this.mainFlowList = this.mainFlowList.filter(
        (item) => item.mainFlowId !== paramItem.mainFlowId
      );
      this.mainFlowIds = this.mainFlowIds.filter(
        (item) => item !== paramItem.mainFlowId
      );
      if (this.mainFlowIds.length > 0) {
        this.checkBookPre([]);
      }
      if (this.mainFlowIds.length === 0) {
        this.collateralDescribe = this.desc;
      }

    } else {
      this.mainFlowList = [];
      this.mainFlowIds = [];
      paramItem.checked = true;
      this.info.list.forEach((item, index) => {
        if (item.checked === true) {
          this.generateArr(index, item);
        }
      });
      this.checkBookPre([]);

    }
  }
}
export enum ZhongDengStauts {
  /**待登记 */
  READY = 5,
  /** 登记中 */
  DOING = 1,
  /** 登记失败 */
  FAIL = 2,
  /** 登记完成 */
  DONE = 3,
  /**撤销登记 */
  CANCEL = 4,
  /** 已变更 */
  CHANGED = 6
}

enum ModalTitle {
  '出让人信息' = 1,
  '受让人信息' = 2,
}
