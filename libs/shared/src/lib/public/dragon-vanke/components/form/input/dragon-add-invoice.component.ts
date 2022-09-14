/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：profit-table-input.component.ts
 * @summary：龙光供应商提交资料初审发票控件
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                    wq             增加             2019-08-28
 * **********************************************************************
 */

import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewContainerRef,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import * as md5 from 'js-md5';
import { isNullOrUndefined } from 'util';
import { forkJoin } from 'rxjs';
import DragonInfos from '../../bean/checkers.tab';
import { DragonInvoiceVankeEditModalComponent } from '../../../modal/dragon-invoice-vanke-edit-modal.component';
import { VankeInvoiceViewModalComponent } from '../../../modal/invoice-view-modal.component';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { PublicCommunicateService } from '../../../../../services/public-communicate.service';
import { LocalStorageService } from '../../../../../services/local-storage.service';
import { LoadingService } from '../../../../../services/loading.service';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { XnService } from '../../../../../services/xn.service';
import { UploadPicService } from '../../../../../services/upload-pic.service';
import { InvoiceUploadService } from '../../../../../services/invoice-upload.service';
import { LoadingPercentService } from '../../../../../services/loading-percent.service';
import { XnFormUtils } from '../../../../../common/xn-form-utils';
import { XnUtils } from '../../../../../common/xn-utils';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';
import * as _ from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dragon-add-invoice-component',
  templateUrl: './dragon-add-invoice.component.html',
  styles: [
    `
      .plat-table-footer {
        font-size: 14px;
        text-align: right;
        padding-right: 8px;
      }
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
      .a-block {
        display: block;
      }
      .plat-table-footer {
        font-size: 14px;
        text-align: right;
        padding-right: 8px;
      }
      .tdSet{
        position:relative;
        width:100px;
        height:50px;
        overflow-y: scroll;
      }
      .tdSet a{
        position: absolute;
        top: 20%;
        left: 20%;
        z-index: 7;
        word-break: break-all;
      }
      .teach{
        justify-content: center;
        text-decoration: underline;
        text-align: right;
      }
      .btn-file {
        padding: 6px 5px;
        width: 120px
      }
    `,
  ],
})
@DynamicForm({ type: 'invoice-normal', formModule: 'dragon-input' })
export class DragonAddInvoiceComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;
  @ViewChild('tdheight') tdheight: ElementRef;
  @ViewChild('aheight') aheight: ElementRef;
  public alert = ''; // 提示
  public ctrl: AbstractControl;
  public xnOptions: XnInputOptions;
  public items: any[] = [];
  public orgType = this.xn.user.orgType;
  public contractitem: any; // 获取合同信息
  public certificateitem: any; // 履约证明字段
  public Tabconfig: any;
  currentTab: any; // 当前标签页
  private idx = 0;
  arrCache: any[];
  // public transferAmount = 0;
  public filesMap = new Map();
  public checkedAllStatus = false;
  // 批量验证按钮状态
  public btnStatus = false;
  // 全选按钮控制状态
  public SelectedBtnStatus = false;
  public sort = { invoiceDate: 'sorting', invoiceAmount: 'sorting' };
  public unfill = false;
  // 含税
  public amountAll = 0;
  // 不含税金额
  public amount = 0;
  public preInvoiceList: string[] = []; // 预录入发票集合
  // 更新时间
  updateTime: string;
  public invoiceItem = [];//存储重复的发票
  constructor(
    private xn: XnService,
    private er: ElementRef,
    private vcr: ViewContainerRef,
    private loading: LoadingPercentService,
    private invoiceUpload: InvoiceUploadService,
    private loadingService: LoadingService,
    private uploadPicService: UploadPicService,
    private publicCommunicateService: PublicCommunicateService,
    private localstorigeService: LocalStorageService,
    private nzModal: NzModalService,
    private cdr: ChangeDetectorRef,
  ) { }

  public ngOnInit() {
    this.ctrl = this.form.get(this.row.name);
    this.updateTime = this.row.updateTime;
    this.currentTab = DragonInfos.invoice;
    if (this.ctrl && this.ctrl.value && this.ctrl.value.status === 'unfill') {
      this.unfill = true;
    } else {
      this.unfill = false;
    }
    // 获取预录入发票集合
    if (this.form.get('preInvoiceNum')) {
      const preInvoice = JSON.parse(this.form.get('preInvoiceNum').value)?.list;
      this.preInvoiceList = preInvoice.map((x) => x.invoiceNum);
    }
    this.ctrl.statusChanges.subscribe((v) => {
      this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    });
    this.fromValue();
    this.xnOptions = new XnInputOptions(
      this.row,
      this.form,
      this.ctrl,
      this.er
    );
  }

  /**
   *  发票排序
   * @param label label
   */
  public onSort(label: string) {
    if (this.sort[label] === 'sorting' || this.sort[label] === 'sorting_desc') {
      this.sort[label] = 'sorting_asc';
      this.items = this.items.sort((a, b) => a[label] - b[label]);
    } else if (this.sort[label] === 'sorting_asc') {
      this.sort[label] = 'sorting_desc';
      this.items = this.items.sort((a, b) => b[label] - a[label]);
    }
  }

  // 按钮样式变换
  public sortClass() {
    return this.sort;
  }
  /**
   * 手工查验按钮
   * @param item 条目
   * @param i? item 位置
   * @param bool? 是否是手工 artificial
   */
  public onEdit(item: any, i?: number, bool?: boolean) {
    if (bool === true) {
      return;
    }
    const temps = $.extend(true, [], this.items);
    temps.splice(i, 1); // 删除掉本身，可以做过滤用
    item.temps = temps;
    item.flowId = this.row.flowId;
    item.mainFlowId = this.svrConfig.record.mainFlowId;
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      DragonInvoiceVankeEditModalComponent,
      item
    ).subscribe((v: any) => {
      if (item.temps) {
        delete item.temps;
      }
      if (v.action === 'ok') {
        item.invoiceAmount = Number(v.invoiceAmount).toFixed(2);
        item.invoiceCode = v.invoiceCode;
        item.amount = Number(v.amount).toFixed(2);
        item.invoiceNum = v.invoiceNum;
        item.invoiceDate = v.invoiceDate;
        item.invoiceCheckCode = v.invoiceCheckCode || '';
        item.invoiceScreenshot = v.invoiceScreenshot || '';
        item.invoiceType = v.invoiceType || '';
        item.status = v.status;
        item.tag = v.tag || ''; // 人工验证标记
        this.isUploadInvoiceNum({ value: item.invoiceNum.trim(), change: 1 });
        this.toValue();
      }
    });
  }

  /**
   *  删除上传的项
   * @param val val
   */
  public onRemove(val: any) {
    /** 万科汇融文件需弹窗提示供应商 */
    if(this.row?.stepId && this.items.some((file: any) => file?.isVanke)) {
      return this.vankeFileHandle();
    }

    this.xn.file.remove(val.fileId, true).subscribe((json) => {
      // 过滤掉包含此id的文件
      this.items = this.items.filter((x: any) => x.fileId !== val.fileId);
      // 删除掉该键值对
      this.filesMap.delete(val.md5);
      const find = this.items.find((x: any) => x.clicked && x.clicked === true);
      if (this.items.length && !!find) {
        this.checkedAllStatus = true;
        this.btnStatus = true;
      } else {
        this.checkedAllStatus = false;
        this.btnStatus = false;
      }
      this.toValue();
      if (!!val.invoiceNum) {
        this.isUploadInvoiceNum({ value: val.invoiceNum.trim(), change: 0 });
      }
    });
  }

  public onOpenImage(index: number) {
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      VankeInvoiceViewModalComponent,
      { fileList: this.items, paramIndex: index }
    ).subscribe(() => { });
  }

  /**
   *  删除选中项
   */
  public deleteAll(bool: boolean) {
    // 删除选中项
    if (!bool) {
      return;
    }
    /** 万科汇融文件需弹窗提示供应商 */
    if(this.row?.stepId && this.items.some((file: any) => file?.isVanke)) {
      return this.vankeFileHandle();
    }

    const finds = this.items.filter(
      (x: any) => x.clicked && x.clicked === true
    );
    const remove$ = finds.map((x) => {
      return this.xn.file.dragonRemove(x.fileId);
    });

    forkJoin(remove$).subscribe(() => {
      finds.forEach((x) => {
        if (!!x.invoiceNum) {
          this.isUploadInvoiceNum({ value: x.invoiceNum.trim(), change: 0 });
        }
        this.filesMap.delete(x.md5); // 删除键值对
      });

      this.items = this.items.filter(
        (x: any) => x.clicked === undefined || x.clicked === false
      );
      if (this.items.length === 0) {
        this.checkedAllStatus = false;
        this.btnStatus = false;
      }
      this.toValue();
    });
  }

  // 点击选中
  public handleSelect(index) {
    if (this.items[index].clicked && this.items[index].clicked === true) {
      this.items[index].clicked = false;
    } else {
      this.items[index].clicked = true;
    }
    // 当有选中时,可以点击查验按钮
    const find1 = this.items.find((x: any) => x.clicked === true);
    if (find1) {
      this.btnStatus = true;
    } else {
      this.btnStatus = false;
    }
    // 当数组中不具有clicked 且为false。没有找到则表示全选中。
    const find = this.items.find(
      (x: any) => x.clicked === undefined || x.clicked === false
    );
    if (!find) {
      this.checkedAllStatus = true;
    } else {
      this.checkedAllStatus = false;
    }
  }

  // 全选，取消全选
  public handleAllSelect() {
    this.checkedAllStatus = !this.checkedAllStatus;

    if (this.checkedAllStatus) {
      this.items.map((item) => (item.clicked = true));
      this.btnStatus = true;
    } else {
      this.items.map((item) => (item.clicked = false));
      this.btnStatus = false;
    }
  }

  // 单张查验
  public inspection(item: any, i?: number) {
    const params = {
      fileId: item.fileId,
      mainFlowId: this.svrConfig.record.mainFlowId,
    };
    // XnUtils.checkLoading(this);

    const onError = () => {
      // 验证失败
      item.status = 2;
      this.xn.msgBox.open(false, '发票验证失败', () => {
        this.toValue();
      });
    };
    this.loadingService.open();
    this.xn.dragon.postMap('/file/invoice_checkocr', params).subscribe(
      (x) => {
        if (x.ret === 0) {
          item.status = x.data.data.status;
          item.action = 'ok';
          item.invoiceCode = x.data.data.invoiceCode;
          item.invoiceNum = x.data.data.invoiceNum;
          item.invoiceDate = x.data.data.invoiceDate;
          item.invoiceAmount = x.data.data.invoiceAmount;
          item.amount = x.data.data.amount || x.data.data.invoiceAmount;
          item.invoiceCheckCode = x.data.data.checkCode || '';
          item.invoiceScreenshot = x.data.data?.invoiceScreenshot || '';
          item.invoiceType = x.data.data.invoiceType || '';
          this.isUploadInvoiceNum({ value: item.invoiceNum.trim(), change: 1 });
          // this.distinctArray(item);// 判断时候是重复的发票
          this.filterInvoiceNum();
          this.toValue();
        } else {
          // 验证失败
          onError();
        }
        this.loadingService.close();
      },
      (err) => {
        // 验证失败
        onError();
        this.loadingService.close();
      }
    );
  }
  // 批量上传发票图片按钮
  public onUpload(e) {
    if (e.target.files.length === 0) {
      return;
    }
    for (const file of e.target.files) {
      const err = this.validateFileExt(file.name);
      if (!XnUtils.isEmpty(err)) {
        // this.alert = err;
        // 把file input的值置为空，这样下次选择同一个文件还能触发这个请求
        $(e.target).val('');
        this.xn.msgBox.open(false, '请上传图片格式的发票文件');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event: any) => {
        file.md5 = md5(event.target.result);
        this.resolveFiles(e);
      };
      reader.readAsArrayBuffer(file);
    }
  }
  /**
   * 处理本地上传文件数据
   * @param e 文件event
   */
  private resolveFiles(e) {
    const files = e.target.files;
    this.idx++;
    if (this.idx === files.length) {
      this.idx = 0;
      const tempArr = [];
      for (const file of files) {
        tempArr.push(file);
      }
      // 保存数组
      this.arrCache = tempArr;
      // 本次选择重复的，在去重掉已经上传过的；
      const repeatFiles = XnUtils.distinctArray2(tempArr, 'md5').filter(
        (item) => !this.filesMap.has(item.md5)
      );
      if (repeatFiles.length < 1) {
        this.xn.msgBox.open(false, '发票已存在');
      }
      this.uploadImg(repeatFiles, 0);
      $(e.target).val('');
    }
  }
  // 上传图片
  private uploadImg(files: any[], index: number) {
    if (files.length === index) {
      this.items.sort((a: any, b: any): number =>
        a.prevName > b.prevName ? 1 : -1
      );
      this.checkedAllStatus = false;
      this.handleAllSelect();
      // 进行批量验证
      this.handleVerification(this.btnStatus);
      // 已上传完毕关闭
      // this.loading.close();
      // 如果存在重复，并处理过，提示
      if (files.length < this.arrCache.length) {
        this.xn.msgBox.open(false, '已自动过滤重复发票');
      }
      return;
    }
    this.loading.open(files.length, index);
    this.uploadPicService.compressImage(
      files[index],
      this.alert,
      this.row,
      (blob: any, file: any) => {
        const fd = new FormData();
        fd.append('checkerId', this.row.checkerId);
        // FormData.append中如果不带第三个参数，则默认filename属性为blob, file && file.name是为了检测file是否存在
        fd.append('file_data', blob, file && file.name);
        this.xn.file.dragonUpload(fd).subscribe({
          next: (v) => {
            if (v.type === 'progress') {
              this.alert = this.uploadPicService.onProgress(
                v.data.originalEvent
              );
            } else if (v.type === 'complete') {
              if (v.data.ret === 0) {
                const prevFileName = (file && file.name) || (blob && blob.name); // filename不存在则检测blobname
                v.data.data.prevName = prevFileName;
                // 将md5 保定到数据中
                v.data.data.md5 = files[index].md5;
                this.alert = '';
                this.items.push(v.data.data);
                this.filesMap.set(files[index].md5, files[index].md5); // 上传成功后保存
                this.toValue();
              } else {
                this.xn.msgBox.open(false, v.data.msg);
                // 上传失败
              }
              index++;
              setTimeout(() => {
                this.uploadImg(files, index);
              }, 1000);
            } else {
              // 上传失败
              this.xn.msgBox.open(false, v.data.msg);
            }
          },
          error: (errs) => {
            this.xn.msgBox.open(false, errs);
            this.loading.close();
          },
          complete: () => {
            this.ctrl.markAsDirty();
            this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
          },
        });
      }
    );
  }
  /**
   * 批量验证发票 - 验证未验证/失败 （重复验证 3, 验证失败 2, 验证成功 1,作废 4, undefined 未验证);
   * @param bool 状态控制
   */
  public handleVerification(bool: boolean) {
    if (!bool) {
      return;
    }
    const filterItem = this.items.filter(
      (x) =>
        (!x.status || (x.away && x.away !== 'edit')) &&
        x.clicked &&
        x.clicked === true
    );
    // XnUtils.checkLoading(this);
    if (filterItem && filterItem.length > 0) {
      const newMap = new Map();
      const arr = [];
      filterItem.forEach((y) => {
        newMap.set(y.fileId, y.fileId);
      });
      this.items.forEach((z) => {
        if (!newMap.has(z.fileId)) {
          arr.push(z);
        }
      });
      arr.forEach((x) => {
        if (x.clicked && x.clicked === true) {
          x.clicked = false;
        }
      });
      // 上传验证
      this.postInit(filterItem, 0);
    } else {
      this.xn.msgBox.open(true, '无可查验发票', () => {
        this.items.forEach((x) => {
          if (x.clicked && x.clicked === true) {
            x.clicked = false;
          }
          // 取消全选状态
          const find = this.items.find(
            (xx: any) => xx.clicked && xx.clicked === true
          );
          if (find) {
            this.checkedAllStatus = true;
            this.btnStatus = true;
          } else {
            this.checkedAllStatus = false;
            this.btnStatus = false;
          }
        });
      });
    }
    // 取消全选状态
    const find1 = this.items.find(
      (xx: any) => xx.clicked && xx.clicked === true
    );
    if (find1) {
      this.checkedAllStatus = true;
      this.btnStatus = true;
    } else {
      this.checkedAllStatus = false;
      this.btnStatus = false;
    }
  }
  /**
   * checkocr 方法
   * @param filterItem 文件对象
   * @param i 文件长度数据
   */
  private postInit(filterItem: any[], i: number) {
    if (filterItem.length === i) {
      this.filterInvoiceNum();
      this.toValue();
      this.loading.close();
      return;
    }
    const params = {
      fileId: filterItem[i].fileId,
      mainFlowId: this.svrConfig.record.mainFlowId,
    };
    // XnUtils.checkLoading(this);
    this.loading.open(filterItem.length, i);
    this.xn.dragon.postMap('/file/invoice_checkocr', params).subscribe(
      (x) => {
        if (x.ret === 0) {
          filterItem[i].status = x.data.data.status;
          filterItem[i].action = 'ok';
          filterItem[i].invoiceCode = x.data.data.invoiceCode;
          filterItem[i].invoiceNum = x.data.data.invoiceNum;
          filterItem[i].invoiceDate = x.data.data.invoiceDate;
          filterItem[i].invoiceAmount = x.data.data.invoiceAmount;
          filterItem[i].amount =
            x.data.data.amount || x.data.data.invoiceAmount;
          filterItem[i].invoiceCheckCode = x.data.data.checkCode || '';
          filterItem[i].invoiceScreenshot =
            x.data.data?.invoiceScreenshot || '';
          filterItem[i].invoiceType = x.data.data?.invoiceType || '';
          this.isUploadInvoiceNum({
            value: filterItem[i].invoiceNum.trim(),
            change: 1,
          });
          // filterItem[i].clicked = false;
          // this.filterInvoiceNum();// 判断时候是重复的发票
        } else {
          // 验证失败
          filterItem[i].status = 2;
        }
        // 验证完成后取消选择checked选中状态
        if (filterItem[i].clicked && filterItem[i].clicked === true) {
          filterItem[i].clicked = false;
        }
        // 取消全选状态
        const find = this.items.find((xx) => xx.clicked && xx.clicked === true);
        if (find) {
          this.checkedAllStatus = true;
          this.btnStatus = true;
        } else {
          this.checkedAllStatus = false;
          this.btnStatus = false;
        }
        // this.toValue();
        i++;
        this.postInit(filterItem, i);
      },
      () => {
        filterItem[i].status = 2;
      }
    );
  }

  // 根据 invoiceNum的值 来验证是否上传了发票
  private isUploadInvoiceNum(obj: InvoiceChangeModel) {
    this.invoiceUpload.change.emit(obj);
  }

  private fromValue() {
    this.items = XnUtils.parseObject(this.ctrl.value, []);
    this.certificateitem = XnUtils.parseObject(this.ctrl.value, []);
    this.contractitem = XnUtils.parseObject(this.ctrl.value, []);
    this.toValue();
  }

  // 上传完后取回值
  private toValue() {
    if (this.items.length === 0) {
      this.ctrl.setValue('');
      this.amountAll = 0;
      this.amount = 0;
    } else {
       this.items = XnUtils.distinctArrayTwo(
        this.items,
        'invoiceNum',
        'invoiceCode'
      );
      this.ctrl.setValue(JSON.stringify(this.items));
      if (
        this.items.filter((v) => v && v.invoiceAmount && v.invoiceAmount !== '')
          .length > 0
      ) {
        this.amountAll =
          this.computeSum(
            this.items
              .filter((v) => v && v.invoiceAmount)
              .map((v) => Number(v.invoiceAmount))
          ).toFixed(2) || 0;

        this.amount =
          this.computeSum(
            this.items.filter((v) => v && v.amount).map((v) => Number(v.amount))
          ).toFixed(2) || 0;
      } else {
        this.amountAll = 0;
        this.amount = 0;
        // this.transferAmount = 0;
      }
    }
    // 计算完金额后向外抛出的值
    this.publicCommunicateService.change.emit(this.amountAll);
    this.localstorigeService.setCacheValue('invoicedata', this.items);
    this.SelectedBtnStatus = this.items.length > 0;
    this.ctrl.markAsTouched();
    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    this.loading.close();
  }
  // 发票验证完后根据发票号码过滤发票 单选时 不过滤掉未验证的发票
  private filterInvoiceNum() {
    // 过滤后的没有重复的数组
    this.invoiceItem = [];
    const newItems = XnUtils.distinctArrayTwo(
      this.items,
      'invoiceNum',
      'invoiceCode'
    );
    if (newItems.length !== this.items.length) {
      this.items.forEach(x => {
        if (!newItems.includes(x)) {
          this.invoiceItem.push(`${this.invoiceItem.length + 1}、发票${x.invoiceNum},发票代码${x.invoiceCode}重复`);
        }
      })
    }
    if (this.invoiceItem.length > 0) {
      this.xn.msgBox.open(false, this.invoiceItem);
    }
  }

  // 具体到单个数组的求和
  private computeSum(array) {
    return array.reduce((prev, curr) => {
      return prev + curr;
    });
  }

  private validateFileExt(s: string): string {
    if (isNullOrUndefined(this.row.options)) {
      return '';
    }
    if ('fileext' in this.row.options) {
      const exts = this.row.options.fileext
        .replace(/,/g, '|')
        .replace(/\s+/g, ''); // 删除所有空格
      if (s.match(new RegExp('\\.(' + exts + ')$', 'i'))) {
        return '';
      } else {
        return `只支持以下文件格式: ${this.row.options.fileext}`;
      }
    } else {
      return '';
    }
  }

  /**
   * 上传之前校验handle
   * @param row
   */
  onBeforeUpload(row: any) {
    if(row?.stepId && this.items.some((invoice: any) => invoice?.isVanke)) {
      /** 万科汇融文件需弹窗提示供应商 */
      this.vankeFileHandle();
    } else {
      $(`#${row.checkerId}`).trigger('click');
    }
  }

  /**
   * 删除文件之前handle
   * @returns
   */
  vankeFileHandle() {
    this.nzModal.create({
      nzTitle: '提示',
      nzContent: '点击”确定“后，系统上甲方提供的资料将被替换，请确认',
      nzMaskClosable: false,
      nzOnOk: () => {
        this.ctrl.setValue('');
        this.items = [];
        this.amountAll = 0;
        this.amount = 0;
        this.cdr.markForCheck();
        $(`#${this.row.checkerId}`).trigger('click');
      },
      nzOnCancel: ()=> {
        return;
      }
    });
  }

}

// 发票是否上传
export class InvoiceChangeModel {
  value: string; // 发票代码
  change: number; // 1，添加，0 ,删除
}
