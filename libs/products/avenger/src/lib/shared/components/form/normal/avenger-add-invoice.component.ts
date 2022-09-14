/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：profit-table-input.component.ts
 * @summary：供应商首页经办
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                    wq             增加             2019-06-10
 * **********************************************************************
 */

import { Component, OnInit, Input, ElementRef, ViewContainerRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import AvengerFormTable from './avenger-table';
import * as md5 from 'js-md5';
import { isNullOrUndefined } from 'util';
import { UploadPicService } from 'libs/shared/src/lib/services/upload-pic.service';
import { LoadingPercentService } from 'libs/shared/src/lib/services/loading-percent.service';
import { InvoiceUploadService } from 'libs/shared/src/lib/services/invoice-upload.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { InvoiceViewModalComponent } from 'libs/shared/src/lib/public/modal/invoice-view-modal.component';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { forkJoin } from 'rxjs';
import { AvengerInvoiceVankeEditModalComponent } from '../../modal/avenger-invoice-vanke-edit-modal.component';


@Component({
  selector: 'avenger-add-invoice-component',
  templateUrl: './avenger-add-invoice.component.html',
  styles: [
    `
            .button-reset-style {
                font-size: 12px;
                padding: 5px 35px;
                color: #3c8dbc;
            }

            .tip-memo {
                color: #9A9A9A;
            }
            .tag-color {
                color: #f20000;;
            }
        `
  ]
})
@DynamicForm({ type: 'invoice', formModule: 'avenger-input' })
export class AvengerAddInvoiceComponent implements OnInit {

  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;
  public alert = ''; // 提示
  public ctrl: AbstractControl;
  // private ctrl1: AbstractControl;
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


  constructor(private xn: XnService,
    private er: ElementRef,
    private vcr: ViewContainerRef,
    private loading: LoadingPercentService,
    private invoiceUpload: InvoiceUploadService,
    private loadingService: LoadingService,
    private uploadPicService: UploadPicService,
    private publicCommunicateService: PublicCommunicateService,
    private localstorigeService: LocalStorageService) {
  }



  public ngOnInit() {
    this.ctrl = this.form.get(this.row.name);
    // this.ctrl1 = this.form.get('receive');
    this.Tabconfig = AvengerFormTable.tableFormlist;
    this.currentTab = this.Tabconfig.tabList[0]; // 当前标签页
    if (this.ctrl && this.ctrl.value && this.ctrl.value.status === 'unfill') {
      this.unfill = true;
    } else {
      this.unfill = false;
    }

    this.ctrl.statusChanges.subscribe(v => {
      this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    });
    this.fromValue();
    this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
  }

  /**
   *  发票排序
   * @param {string} label
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
   * 单选
   * @param e
   * @param item
   * @param index
   */
  public singelChecked(e, item, index) {
    if (item.clicked && item.clicked === true) {
      item.clicked = false;
      this.items = this.items.filter((x: any) => x.fileId !== item.fileId);
    } else {
      item.clicked = true;
      this.items.push(item);
      this.items = XnUtils.distinctArray2(this.items, 'fileId'); // 去除相同的项
    }

  }

  public onEdit(item: any, i?: number, bool?: boolean) {
    if (bool === true) {
      return;
    }
    const temps = $.extend(true, [], this.items);
    temps.splice(i, 1); // 删除掉本身，可以做过滤用
    item.temps = temps;
    item.flowId = this.row.flowId;
    item.mainFlowId = this.svrConfig.record.mainFlowId;

    XnModalUtils.openInViewContainer(this.xn, this.vcr, AvengerInvoiceVankeEditModalComponent, item).subscribe((v: any) => {
      if (item.temps) {
        delete item.temps;
      }
      if (v.action === 'ok') {
        item.invoiceAmount = v.invoiceAmount;
        item.invoiceCode = v.invoiceCode;
        item.invoiceNum = v.invoiceNum;
        item.invoiceDate = v.invoiceDate;
        item.invoiceCheckCode = v.invoiceCheckCode || '';
        item.status = v.status;
        item.tag = v.tag || ''; // 人工验证标记
        this.isUploadInvoiceNum({ value: item.invoiceNum, change: 1 });
        this.filterInvoiceNum();
        this.toValue();
      }
    });
  }

  // 删除上传的项
  public onRemove(val: any) {
    this.xn.file.remove(val.fileId, true).subscribe(json => {
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
      this.isUploadInvoiceNum({ value: val.invoiceNum, change: 0 });
    });
  }

  public onView(fileId: string, itemData?) {

    let item;
    if (fileId && fileId !== '') {
      for (const i of this.items) {
        if (i.fileId === fileId) {
          item = i;
        }
      }
    } else {
      item = itemData;
    }
    XnModalUtils.openInViewContainer(this.xn, this.vcr, InvoiceViewModalComponent, {
      fileId,
      invoiceCode: item.invoiceCode,
      invoiceNum: item.invoiceNum,
      invoiceDate: item.invoiceDate,
      invoiceAmount: item.invoiceAmount,
      amount: item.amount || item.invoiceAmount
    }).subscribe(() => {
    });
  }

  public onOpenImage(item: any) {
    XnModalUtils.openInViewContainer(this.xn, this.vcr, InvoiceViewModalComponent, item).subscribe(() => {
    });
  }

  /**
   *  删除选中项
   */
  public deleteAll(bool: boolean) {
    // 删除选中项
    if (!bool) {
      return;
    }
    const finds = this.items.filter((x: any) => x.clicked && x.clicked === true);
    const remove$ = finds.map(x => {
      return this.xn.file.remove(x.fileId, true);
    });

    forkJoin(remove$).subscribe(() => {
      finds.forEach(x => {
        this.isUploadInvoiceNum({ value: x.invoiceNum, change: 0 });
        this.filesMap.delete(x.md5); // 删除键值对
      });

      this.items = this.items.filter((x: any) => x.clicked === undefined || x.clicked === false);
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
    const find = this.items.find((x: any) => x.clicked === undefined || x.clicked === false);
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
      this.items.map(item => item.clicked = true);
      this.btnStatus = true;
    } else {

      this.items.map(item => item.clicked = false);
      this.btnStatus = false;
    }
  }

  // 单张查验
  public inspection(item: any, i?: number) {
    const params = {
      fileId: item.fileId, mainFlowId: this.svrConfig.record.mainFlowId
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
    this.xn.avenger.postMap('/file/invoice_checkocr', params).subscribe(x => {
      if (x.ret === 0) {
        item.status = x.data.data.status;
        item.action = 'ok';
        item.invoiceCode = x.data.data.invoiceCode;
        item.invoiceNum = x.data.data.invoiceNum;
        item.invoiceDate = x.data.data.invoiceDate;
        item.invoiceAmount = x.data.data.invoiceAmount;
        item.amount = x.data.data.amount || x.data.data.invoiceAmount;
        item.invoiceCheckCode = x.data.data?.invoiceCheckCode || '';
        item.invoiceScreenshot = x.data.data?.invoiceScreenshot || '';
        item.invoiceType = x.data.data.invoiceType || '';
        this.isUploadInvoiceNum({ value: item.invoiceNum, change: 1 });
        this.filterInvoiceNum();
        this.toValue();
      } else {
        // 验证失败
        onError();
      }
      this.loadingService.close();
    },
      err => {
        // 验证失败
        onError();
        this.loadingService.close();
      });
  }

  // 批量验证发票 - 验证未验证/失败 （重复验证 3, 验证失败 2, 验证成功 1,作废 4, undefined 未验证);
  public handleVerification(bool: boolean) {
    if (!bool) {
      return;
    }
    const filterItem = this.items.filter(x => (!x.status || x.away && x.away !== 'edit') &&
      x.clicked && x.clicked === true);
    // XnUtils.checkLoading(this);
    if (filterItem && filterItem.length > 0) {
      const newMap = new Map();
      const arr = [];
      filterItem.forEach(y => {
        newMap.set(y.fileId, y.fileId);
      });
      this.items.forEach(z => {
        if (!newMap.has(z.fileId)) {
          arr.push(z);
        }
      });
      arr.forEach(x => {
        if (x.clicked && x.clicked === true) {
          x.clicked = false;
        }
      });
      this.postInit(filterItem, 0);
    } else {
      this.xn.msgBox.open(true, '无可查验发票', () => {
        this.items.forEach((x: any) => {
          if (x.clicked && x.clicked === true) {
            x.clicked = false;
          }
          // 取消全选状态
          const find = this.items.find((xx: any) => xx.clicked && xx.clicked === true);
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
    const find1 = this.items.find((xx: any) => xx.clicked && xx.clicked === true);
    if (find1) {
      this.checkedAllStatus = true;
      this.btnStatus = true;
    } else {
      this.checkedAllStatus = false;
      this.btnStatus = false;
    }
  }

  public onUpload(e) {
    if (e.target.files.length === 0) {
      return;
    }
    for (const file of e.target.files) {
      const err = this.validateFileExt(file.name);
      if (!XnUtils.isEmpty(err)) {
        this.alert = err;

        // 把file input的值置为空，这样下次选择同一个文件还能触发这个请求
        $(e.target).val('');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event: any) => {
        file.md5 = md5(event.target.result);
        this.callBack(e);
      };
      reader.readAsArrayBuffer(file);
    }
  }



  private callBack(e) {
    const files = e.target.files;
    this.idx++;
    if (this.idx === files.length) {
      this.idx = 0;
      const arr1 = [];
      for (const file of files) {
        arr1.push(file);
      }
      // 保存数组
      this.arrCache = arr1;
      // 本次选择重复的，在去重掉已经上传过的；
      const data = [];
      const repeatFiles = XnUtils.distinctArray2(arr1, 'md5');
      // 保存本次已上传发票
      repeatFiles.map(val => {
        if (!this.filesMap.has(val.md5)) {
          data.push(val);
        }
      });
      if (data.length < 1) {
        this.xn.msgBox.open(false, '发票已存在');
      }
      this.uploadImg(data, 0);
      $(e.target).val('');
    }
  }

  // 上传图片
  private uploadImg(files: any[], index: number) {
    if (files.length === index) {
      this.items.sort(function (a: any, b: any): number {
        if (a.prevName > b.prevName) {
          return 1;
        } else {
          return -1;
        }
      });
      // 已上传完毕关闭
      this.loading.close();
      // 如果存在重复，并处理过，提示
      if (files.length < this.arrCache.length) {
        this.xn.msgBox.open(false, '已自动过滤重复发票');
      }
      return;
    }
    // 打开loading,传入上传的总数，和当前上传的图片
    this.loading.open(files.length, index);
    this.uploadPicService.compressImage(files[index], this.alert, this.row, (blob, file) => {
      const fd = new FormData();
      fd.append('checkerId', this.row.checkerId);
      // FormData.append中如果不带第三个参数，则默认filename属性为blob, file && file.name是为了检测file是否存在
      fd.append('file_data', blob, file && file.name);
      this.xn.file.upload(fd, true).subscribe({
        next: v => {
          if (v.type === 'progress') {
            this.alert = this.uploadPicService.onProgress(v.data.originalEvent);
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
        error: errs => {
          this.xn.msgBox.open(false, errs);
        },
        complete: () => {
          this.ctrl.markAsDirty();
          this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
        }
      });
    });
  }

  private postInit(filterItem: any[], i: number) {
    if (filterItem.length === i) {
      this.filterInvoiceNum();
      this.toValue();
      this.loading.close();
      return;
    }
    const params = {
      fileId: filterItem[i].fileId, mainFlowId: this.svrConfig.record.mainFlowId
    };
    // XnUtils.checkLoading(this);
    this.loading.open(filterItem.length, i);
    this.xn.avenger.postMap('/file/invoice_checkocr', params).subscribe(x => {
      if (x.ret === 0) {
        filterItem[i].status = x.data.data.status;
        filterItem[i].action = 'ok';
        filterItem[i].invoiceCode = x.data.data.invoiceCode;
        filterItem[i].invoiceNum = x.data.data.invoiceNum;
        filterItem[i].invoiceDate = x.data.data.invoiceDate;
        filterItem[i].invoiceAmount = x.data.data.invoiceAmount;
        filterItem[i].amount = x.data.data.amount || x.data.data.invoiceAmount;
        filterItem[i].invoiceCheckCode = x.data.data?.invoiceCheckCode || '';
        filterItem[i].invoiceScreenshot = x.data.data?.invoiceScreenshot || '';
        filterItem[i].invoiceType = x.data.data.invoiceType || '';
        this.isUploadInvoiceNum({ value: filterItem[i].invoiceNum, change: 1 });

        // filterItem[i].clicked = false;
      } else {
        // 验证失败
        filterItem[i].status = 2;
      }
      // 验证完成后取消选择checked选中状态
      if (filterItem[i].clicked && filterItem[i].clicked === true) {
        filterItem[i].clicked = false;
      }
      // 取消全选状态
      const find = this.items.find((xx: any) => xx.clicked && xx.clicked === true);
      if (find) {
        this.checkedAllStatus = true;
        this.btnStatus = true;
      } else {
        this.checkedAllStatus = false;
        this.btnStatus = false;
      }
      this.toValue();
      i++;
      this.postInit(filterItem, i);
    },
      () => {
        filterItem[i].status = 2;
        this.loading.close();
      });
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
    } else {
      const contractTypeBool = []; // 必须每张发票都包含发票号，金额，开票日期
      for (const item of this.items) {
        contractTypeBool.push(!!(item.invoiceAmount) && !!(item.invoiceNum && !!item.invoiceDate));
      }
      contractTypeBool.indexOf(false) > -1 ? this.ctrl.setValue('') : this.ctrl.setValue(JSON.stringify(this.items));
      if (this.items.filter(v => v && v.invoiceAmount).length > 0) {
        this.amountAll = this.computeSum(this.items.filter(v =>
          v && v.invoiceAmount).map(v => Number(v.invoiceAmount))).toFixed(2) || 0;
        // this.transferAmount = this.computeSum(this.items.filter(v =>
        //     v && v.transferMoney).map(v => Number(v.transferMoney))).toFixed(2) || 0;
      } else {
        this.amountAll = 0;
        // this.transferAmount = 0;

      }
    }
    // 计算完金额后向外抛出的值
    this.publicCommunicateService.change.emit(this.amountAll);
    this.localstorigeService.setCacheValue('invoicedata', this.items);
    this.SelectedBtnStatus = this.items.length > 0;
    this.ctrl.markAsTouched();
    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
  }

  // 发票验证完后根据发票号码过滤发票 单选时 不过滤掉未验证的发票
  private filterInvoiceNum() {
    const repeats = XnUtils.findArrayRepeat(this.items, 'invoiceNum').reps; // 重复的发票号码
    if (XnUtils.distinctArray(repeats) && XnUtils.distinctArray(repeats).length) {
      this.xn.msgBox.open(false, `发票${repeats.join(',')}重复`);
    }
    this.items = XnUtils.distinctArray3(this.items, 'invoiceNum'); // 根据发票号码过滤并找出重复的发票号码
  }

  // 具体到单个数组的求和
  private computeSum(array) {
    return array.reduce((prev, curr, idx, arr) => {
      return prev + curr;
    });
  }

  private validateFileExt(s: string): string {
    if (isNullOrUndefined(this.row.options)) {
      return '';
    }
    if ('fileext' in this.row.options) {
      const exts = this.row.options.fileext.replace(/,/g, '|').replace(/\s+/g, ''); // 删除所有空格
      if (s.match(new RegExp('\\.(' + exts + ')$', 'i'))) {
        return '';
      } else {
        return `只支持以下文件格式: ${this.row.options.fileext}`;
      }
    } else {
      return '';
    }
  }
  // // 计算单个转让金额
  // firstcaclate(item: any) {
  //     let totalinvoiceAmount = 0;
  //     let previnvoiceAmount = 0;
  //     let bcontinue = false;
  //     for (let i = 0; i < item.length; i++) {
  //         if (bcontinue) {
  //             item[i].transferMoney = 0;
  //         } else {
  //             if (this.calculateData(this.ctrl1.value) > this.calculateData(item[i].invoiceAmount) &&
  //                 totalinvoiceAmount < this.calculateData(this.ctrl1.value)) {
  //                 previnvoiceAmount = totalinvoiceAmount;
  //                 totalinvoiceAmount += this.calculateData(item[i].invoiceAmount);
  //                 if (totalinvoiceAmount > this.calculateData(this.ctrl1.value)) {
  //                     item[i].transferMoney = this.calculateData(this.ctrl1.value) - previnvoiceAmount;
  //                     bcontinue = true;
  //                 } else {
  //                     item[i].transferMoney = this.calculateData(item[i].invoiceAmount);

  //                 }

  //             } else {
  //                 if (this.calculateData(this.ctrl1.value) < this.calculateData(item[i].invoiceAmount) && i === 0) {
  //                     item[i].transferMoney = this.calculateData(this.ctrl1.value);
  //                     bcontinue = true;
  //                 } else {
  //                     item[i].transferMoney = this.calculateData(this.ctrl1.value) - totalinvoiceAmount;
  //                     bcontinue = true;

  //                 }
  //             }
  //         }
  //     }

  // }

  // public calculateData(item: any) {
  //     return Number(parseFloat(item).toFixed(2));
  //     }
  // // 修改转让金额
  // changeTransferMoney(item) {
  //     let params = {
  //         title: '发票转让金额',
  //         checker: [
  //             {
  //                 checkerId: 'transferMoney',
  //                 required: 1,
  //                 type: 'text',
  //                 options: {},
  //                 title: '发票转让金额',
  //             },
  //         ]
  //     };
  //     XnModalUtils.openInViewContainer(this.xn, this.vcr, EditInfoModalComponent, params).subscribe(x => {
  //         if (x === null) {
  //             return;
  //         } else if (x.transferMoney < 0) {
  //             this.xn.msgBox.open(false, '转让金额不可以为负数');
  //             return;
  //         } else if (x.transferMoney > parseFloat(item.invoiceAmount)) {
  //             this.xn.msgBox.open(false, '转让金额不可以大于税收金额');
  //             return;

  //         } else {
  //             item['transferMoney'] = x.transferMoney;
  //             this.toValue();
  //         }

  //     });

  // }

}

// 发票是否上传
export class InvoiceChangeModel {
  value: string; // 发票代码
  change: number; // 1，添加，0 ,删除
}
