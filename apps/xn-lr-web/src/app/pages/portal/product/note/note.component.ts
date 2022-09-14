/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：apps\xn-lr-web\src\app\pages\portal\product\note\note.component.ts
 * @summary：note.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-12-23
 ***************************************************************************/
import { Component, OnInit, ViewChild } from '@angular/core';
import { StoreService } from '../../shared/services/store.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UploadFileStatus } from 'ng-zorro-antd/upload/interface';
import * as md5 from 'js-md5';
import { NzUploadChangeParam, NzUploadComponent } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BillFileInfo, BillInfo } from './note.interface';
import { BillFace, Identify, UploadStatus } from './note.enum';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../../../../../../../../libs/shared/src/lib/services/user.service';

@Component({
  selector: 'app-product-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.less']
})
export class ProductNoteComponent implements OnInit {
  @ViewChild('uploadComp') uploadComp: NzUploadComponent;
  form!: FormGroup;
  /** 文件上传信息配置 */
  uploadReq = {
    nzAction: '/bill/file/upload',
    nzName: 'file_data',
    nzData: () => this.tAndSign(),
  };
  UploadStatus = Object.assign({}, UploadStatus, Identify);
  /** 文件的上传状态 */
  fileStatus: UploadFileStatus | Identify | undefined;
  /** 识别成功的信息 */
  billInfo: BillInfo;
  /** 票据文件 */
  files: BillFileInfo[];
  /** 上传错误提示信息 */
  errorTip = '';

  /** 上传失败、识别失败 */
  get FileStatusFail() {
    return this.fileStatus === UploadStatus.Error || this.fileStatus === Identify.Fail;
  }

  /** 上传中、识别中 */
  get FileUploadIdentify() {
    return this.fileStatus === UploadStatus.Uploading || this.fileStatus === Identify.Identifying;
  }

  get viewFiles() {
    return this.files.map((c) => ({name: c.fileName, url: c.key}));
  }

  constructor(
    public store: StoreService,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private http: HttpClient,
    private router: Router,
    private user: UserService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      code: [null, [Validators.required]],
      money: [null, [Validators.required]],
      acceptorName: [null, [Validators.required]],
      dulDate: [null, [Validators.required]],
      date: [null, [Validators.required]],
      endorseTimes: [null, [Validators.required]],
    });
  }

  /** 文件上传 */
  handleChange({file}: NzUploadChangeParam) {
    this.fileStatus = file.status;

    if (this.fileStatus === UploadStatus.Done) {
      /** 数据返回成功 */
      if (file.response.ret === 0) {
        const data = this.resToCamelCase(file.response.data);
        this.files = [{...data, ...{type: BillFace.Front}}];
        console.log(this.files);
        this.billIdentify(data.fileId);
      } else {
        this.fileStatus = UploadStatus.Error;
        this.errorTip = file.response.msg;
      }
    } else if (this.fileStatus === UploadStatus.Error) {
      this.msg.error(`${file.name}文件上传失败`);
    }
  }

  /** 票据识别 */
  billIdentify(fileId: number) {
    this.fileStatus = Identify.Identifying;
    this.http.post('/bill/trade/trade_bill/bill_recognize', {file_id: fileId, ...this.tAndSign()})
      .subscribe({
        next: (res: any) => {
          this.fileStatus = Identify.Recognized;
          this.billInfo = this.billInfoTrans(res.data);
          const {code, money, acceptorName, date, dulDate, endorseTimes} = this.billInfo;
          this.form.setValue({code, money, acceptorName, date, dulDate, endorseTimes});
        },
        error: err => {
          this.fileStatus = Identify.Fail;
          this.errorTip = err.msg || '票据识别失败';
        },
      });
  }

  /** 整理票据信息 */
  billInfoTrans(data: BillInfo): BillInfo {
    data = this.resToCamelCase(data);
    data.money = Number(data.money);
    /** 识别出的票据初始背书次数为 0 */
    data.endorseTimes = 0;
    return data;
  }

  handleFileView(ev: Event) {
    ev.stopPropagation();
  }

  handleReUpload(ev: Event) {
    ev.stopPropagation();
    this.uploadComp.uploadComp.onClick();
  }

  submitForm() {
    this.router.navigate(['login']);
  }

  tAndSign() {
    return {
      t: Math.floor(new Date().getTime() / 1000),
      sign: md5(Math.random().toString(36).substring(2)),
    };
  }

  parser(value: string): string {
    return value.replace(/,/g, '');
  }

  format(value: number): string {
    return value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';
  }

  resToCamelCase(obj: any) {
    if (!obj) { return obj; }

    let isObj: boolean;
    let isArr: boolean;

    try {
      const res = this.checkParams(obj);
      isObj = res.isObj;
      isArr = res.isArr;
    } catch (e) {
      return obj;
    }

    let result = isObj && isArr ? ([] as any) : ({} as any);

    if (isObj) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {

          if (typeof obj[key] === 'object') {
            obj[key] = this.resToCamelCase(obj[key]);
          }

          result[this.toCamelCase(key)] = obj[key];
        }
      }
    }

    if (isArr) {
      result = obj.reduce((prev: any[], curr: any) => {
        if (typeof curr === 'object') {
          return prev.concat(this.resToCamelCase(curr));
        }
        return prev.concat(curr);
      }, []);
    }

    return result;
  }

  /** a_b_c -> aBC */
  toCamelCase(name: string) {
    return name.replace(/_(\w)/g, (str, letter) => letter.toUpperCase());
  }

  checkParams(obj: any) {
    const isObj = typeof obj === 'object' && !Array.isArray(obj);
    const isArr = Array.isArray(obj);
    const isNumber = typeof obj === 'number';
    const isString = typeof obj === 'string';

    if (!isObj && !isArr && !isNumber && !isString) {
      throw new Error('待转换的参数类型有误，支持 object, array, string, number');
    }

    return {isObj, isArr};
  }

}
