/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：profit-table-input.component.ts
 * @summary：龙光供应商上传资料初审交易合同控件
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing            增加             2019-08-28
 * **********************************************************************
 */

import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewContainerRef,
  ChangeDetectorRef,
  TemplateRef,
  ContentChild,
} from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import DragonInfos from '../../bean/checkers.tab';
import { JsonTransForm } from '../../../../pipe/xn-json.pipe';
import { DragonMfilesViewModalComponent } from '../../../modal/mfiles-view-modal.component';
import {
  EditParamInputModel,
  EditModalComponent,
} from '../../../modal/edit-modal.component';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { XnService } from '../../../../../services/xn.service';
import { UploadPicService } from '../../../../../services/upload-pic.service';
import { LoadingPercentService } from '../../../../../services/loading-percent.service';
import { XnFormUtils } from '../../../../../common/xn-form-utils';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';

@Component({
  selector: 'dragon-add-contract',
  templateUrl: './dragon-contract-upload.component.html',
  styles: [
    `
      .button-reset-style {
        font-size: 12px;
        padding: 5px 35px;
        color: #3c8dbc;
      }

      .tip-memo {
        color: #9a9a9a;
      }
      .tag-color {
        color: #f20000;
      }
      .tdSet {
        position: relative;
        overflow-y: scroll;
      }
      .tdSet a {
        position: absolute;
        word-break: break-all;
        top: 20%;
        left: 20%;
        z-index: 7;
      }
      .teach {
        justify-content: center;
        text-decoration: underline;
        text-align: right;
      }
    `,
  ],
})
@DynamicForm({ type: 'deal-contract', formModule: 'dragon-input' })
export class DragonAddContractComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;
  @Input() step?: any;
  // @Input() step?:any;

  public alert = ''; // 提示
  public ctrl: AbstractControl;
  public xnOptions: XnInputOptions;
  public contractitem: any; // 获取合同信息
  public Tabconfig: any;
  datalist: any[] = [];
  arrCache: any[];
  public items: any[] = [];
  mainForm: FormGroup;
  public filesMap = new Map();
  public checkedAllStatus = false;
  // 批量验证按钮状态
  public btnStatus = false;
  // 批量验证按钮状态
  // 全选按钮控制状态
  public unfill = false;
  private idx = 0;
  public itemFile: any[] = [];
  public fileUpload = [
    {
      name: '',
      checkerId: 'contractUpload',
      type: 'dragonMfile',
      required: 1,
      stepId:'',
      value: '',
      options:
        '{"filename": "交易合同","fileext": "jpg, jpeg, png,pdf", "picSize": "500"}',
    },
  ];
  constructor(
    private xn: XnService,
    private er: ElementRef,
    private vcr: ViewContainerRef,
    private uploadPicService: UploadPicService,
    private loading: LoadingPercentService,
    private cdr: ChangeDetectorRef
  ) { }
  public ngOnInit() {
    this.ctrl = this.form.get(this.row.name);
    if (this.ctrl && this.ctrl.value && this.ctrl.value.status === 'unfill') {
      this.unfill = true;
    } else {
      this.unfill = false;
    }
    if (
      ['vanke_financing', 'oct_financing'].includes(this.row.flowId)
    ) {
      this.fileUpload[0].options =
        '{"filename": "交易合同","fileext": "jpg, jpeg, png", "picSize": "500"}';
    }
    this.fileUpload[0].stepId = this.row.stepId;
    XnFormUtils.convertChecker(this.fileUpload[0]);
    this.mainForm = XnFormUtils.buildFormGroup(this.fileUpload);
    this.ctrl.statusChanges.subscribe(() => {
      this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    });
    this.fromValue();
    this.xnOptions = new XnInputOptions(
      this.row,
      this.form,
      this.ctrl,
      this.er
    );
    this.mainForm.valueChanges.subscribe((x) => {
      this.items.push(x.contractUpload);
      this.toValue();
    });
  }
  private fromValue() {
    if (this.ctrl.value !== '') {
      // const arr = JSON.parse()
      try {
        this.items = JSON.parse(this.row.value);
        this.items = this.items.filter((x) => x !== '');
      } catch (e) {
        this.items = [];
      }
    }
    this.toValue();
  }

  // 上传完后取回值
  private toValue() {
    if (this.items.length === 0) {
      this.ctrl.setValue('');
    } else {
      this.items = this.items.filter((x) => x !== '');
      let isOk = true;
      this.items.forEach((x) => {
        if (!!x.contractFile) {
          isOk = false;
        }
      });
      if (!isOk) {
        this.ctrl.setValue('');
      } else {
        this.ctrl.setValue(JSON.stringify(this.items));
      }
    }

    this.ctrl.markAsTouched();
    this.cdr.markForCheck();
    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
  }
  public fileView(paramFiles) {
    // console.log('打开的文件', paramFiles);
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      DragonMfilesViewModalComponent,
      JsonTransForm(paramFiles)
    ).subscribe(() => { });
  }
  // 删除文件
  deleteFile(paramFiles, index) {
    this.items.splice(index, 1);
    this.toValue();
  }
  // 修改文件
  changeFile(paramFiles, paramIndex: number) {
    const params = {
      title: '合同修改弹窗',
      checker: [
        {
          title: '合同文件序号',
          checkerId: 'fileId',
          type: 'text',
          options: { readonly: true },
          value: paramIndex,
          required: false,
        },
        {
          title: '合同文件图片',
          checkerId: 'paramFile',
          type: 'dragonMfile',
          options:
            this.row.flowId === 'vanke_financing' ||
              this.row.flowId === 'oct_financing'
              ? { fileext: 'jpg, jpeg, png', picSize: '500' }
              : { fileext: 'jpg, jpeg, png,pdf', picSize: '500' },
          required: true,
          value: paramFiles,
        },
      ],
    };
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      EditModalComponent,
      params
    ).subscribe((x) => {
      if (x !== null) {
        paramFiles = x.paramFile;
        this.items[paramIndex - 1] = paramFiles;
        this.cdr.markForCheck();
        this.toValue();
      }
    });
  }
}
