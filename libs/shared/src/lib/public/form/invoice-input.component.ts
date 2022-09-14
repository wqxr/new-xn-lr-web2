import { Component, OnInit, Input, ElementRef, ViewContainerRef } from '@angular/core';
import { XnService } from '../../services/xn.service';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnFormUtils } from '../../common/xn-form-utils';
import { XnInputOptions } from './xn-input.options';
import { InvoiceEditModalComponent } from '../modal/invoice-edit-modal.component';
import { XnModalUtils } from '../../common/xn-modal-utils';
import { isNullOrUndefined } from 'util';
import { XnUtils } from '../../common/xn-utils';
import { InvoiceViewModalComponent } from '../modal/invoice-view-modal.component';
import { InvoiceUtils } from '../../common/invoice-utils';
import { setTimeout } from 'core-js/library/web/timers';
import { LoadingPercentService } from '../../services/loading-percent.service';
import { InvoiceUploadService } from '../../services/invoice-upload.service';
import { LoadingService } from '../../services/loading.service';
import { UploadPicService } from '../../services/upload-pic.service';

declare let $: any;
import * as md5 from 'js-md5';

@Component({
    selector: 'xn-invoice-input',
    templateUrl: './invoice-input.component.html',
    styles: [
        `
            .file-row-table {
                margin-bottom: 0
            }

            .file-row-table td {
                padding: 6px;
                border-color: #d2d6de;
                font-size: 12px;
            }

            .file-row-table th {
                font-weight: normal;
                border-color: #d2d6de;
                border-bottom-width: 1px;
                line-height: 100%;
                font-size: 12px;
            }

            .table-bordered {
                border-color: #d2d6de;
            }

            .table > thead > tr > th {
                padding-top: 7px;
                padding-bottom: 7px;
            }

            .widthMax {
                width: 120px;
            }

            .widthMiddle {
                width: 80px;
            }

            .gray {
                color: #666;
            }

            .fr {
                float: right
            }

            .xn-table-upload {
                padding-top: 5px;
            }

            .checkbox-select {
                width: 1.5rem;
                height: 1.5rem;
            }

            .tag-color {
                color: #f20000;;
            }
        `
    ]
})
export class InvoiceInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    // 全选框选择状态
    public checkedAllStatus = false;
    // 选中的项
    public selectedItems: any[] = [];
    // 上传的数据- 初始状态
    public items: any[] = [];
    public mode: string;

    public alert = '';
    // 判断是否是excel格式
    public isExcel = false;
    // 总数
    public amountAll = 0;
    public sentItems: any[] = [];
    public unfill = false;
    // 公司类型 1:供应商,2:核心企业, 3:保理商 , 4:金融机构,99:平台
    public orgType: number;
    private ctrl: AbstractControl;
    private xnOptions: XnInputOptions;
    // 计算reader onload
    private idx = 0;
    // 上传的图片
    public filesMap = new Map();
    arrCache: any[];

    constructor(private xn: XnService,
        private er: ElementRef,
        private vcr: ViewContainerRef,
        private loading: LoadingPercentService,
        private invoiceUpload: InvoiceUploadService,
        private loadingService: LoadingService,
        private uploadPicService: UploadPicService) {
    }

    public ngOnInit() {
        // 获取登录公司类型
        this.orgType = this.xn.user.orgType;
        this.mode = this.row.options.mode || 'upload';
        this.ctrl = this.form.get(this.row.name);
        console.log('发票数据', this.ctrl, this.row);
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


    onEdit(item: any, i?: number) {
        const fileId = item.fileId;
        const temps = $.extend(true, [], this.items);
        temps.splice(i, 1); // 删除掉本身，可以做过滤用
        item.temps = temps;
        item.mainFlowId = this.svrConfig.record.mainFlowId;
        XnModalUtils.openInViewContainer(this.xn, this.vcr, InvoiceEditModalComponent, item).subscribe((v: any) => {
            console.log('验证返回值', v);
            if (item.temps) {
                delete item.temps;
            }

            console.log('v: ', v);
            if (v.action !== 'ok') {
                this.toValue();
                return;
            }
            for (const item1 of this.items) {
                if (item1.invoiceNum === v.invoiceNum && (!fileId || fileId === '')) {
                    item1.status = v.status;
                    item1.tag = v.tag || '';
                    this.toValue();
                    break;
                }
            }
            for (const item2 of this.items) {
                if (item2.invoiceNum === v.invoiceNum && fileId && fileId !== '') {
                    console.log('here');
                    item2.status = 3;
                    item2.tag = v.tag || '';
                    this.xn.msgBox.open(false, `发票号码(${v.invoiceNum})重复了，请您检查`);
                    return;
                }
            }
            // 把填写的内容补充到这里
            if (v.fileId) {
                for (const item3 of this.items) {
                    if (item3.fileId === v.fileId) {
                        item3.invoiceCode = v.invoiceCode;
                        item3.invoiceNum = v.invoiceNum;
                        item3.invoiceDate = v.invoiceDate;
                        item3.invoiceAmount = v.invoiceAmount;
                        item3.invoiceCheckCode = v.invoiceCheckCode || '',
                        item3.status = v.status;
                        item3.tag = v.tag || '';
                        this.toValue();
                        break;
                    }
                }
            }
            if (!v.fileId && v.invoiceCode) {
                for (const item4 of this.items) {
                    if (item4.invoiceNum === v.invoiceNum) {
                        item4.invoiceAmount = v.invoiceAmount;
                        item4.status = v.status;
                        item4.tag = v.tag || '';
                        console.log('item: ***', item);
                        this.toValue();
                        break;
                    }
                }
            }
        });
    }

    // 具体到单个数组的求和
    computeSum(array) {
        return array.reduce((prev, curr, idx, arr) => {
            return prev + curr;
        });
    }

    onBeforeUpload(e) {
        // if (this.items.length >= 10) {
        //     e.preventDefault();
        //     this.alert = '若发票数量大于10张，请下载Excel模板，填写并上传。';
        //     $(e.target).val('');  // 把file input的值置为空，这样下次选择同一个文件还能触发这个请求
        //     return;
        // }
        // // 不是多选时
        // if (!this.row.options.multi && this.items.length > 0) {
        //     e.preventDefault();
        //     this.alert = '只允许上传一张发票。请先删除已上传的发票，才能上传新发票。';
        //     $(e.target).val('');  // 把file input的值置为空，这样下次选择同一个文件还能触发这个请求
        //     return;
        // }
        return;
    }

    // 删除上传的项
    onRemove(fileId: string) {
        console.log(fileId);
        this.xn.api.post(`/attachment/delete`, { key: fileId }).subscribe(json => {
            // 从this.files里删除fileId
            for (let i = 0; i < this.items.length; ++i) {
                if (this.items[i].fileId === fileId) {
                    this.items.splice(i, 1);
                    const find = this.items.find((x: any) => x.clicked === undefined || x.clicked === false);
                    if (!find) {
                        this.checkedAllStatus = true;
                    } else {
                        this.checkedAllStatus = false;
                    }
                    this.toValue();
                    return;
                }
            }
        });
    }

    onRemoveExcel(invoiceNum: string) {
        // 从this.files里删除invoiceNum
        for (let i = 0; i < this.items.length; ++i) {
            if (this.items[i].invoiceNum === invoiceNum) {
                this.items.splice(i, 1);
                this.sentItems = this.sentItems.filter(v => v !== invoiceNum); // 删除已经上传过的
                // 删除未选中的，剩下视为全选状态
                const find = this.items.find((x: any) => x.clicked === undefined || x.clicked === false);
                if (!find && this.items.length > 0) {
                    this.checkedAllStatus = true;
                } else {
                    this.checkedAllStatus = false;
                }
                this.toValue();
                return;
            }
        }
    }

    onView(fileId: string, itemData?) {

        let item;
        if (fileId && fileId !== '') {
            for (let i = 0; i < this.items.length; ++i) {
                if (this.items[i].fileId === fileId) {
                    item = this.items[i];
                }
            }
        } else {
            item = itemData;
        }

        console.log('item: ', item);

        XnModalUtils.openInViewContainer(this.xn, this.vcr, InvoiceViewModalComponent, {
            fileId,
            invoiceCode: item.invoiceCode,
            invoiceNum: item.invoiceNum,
            invoiceDate: item.invoiceDate,
            invoiceAmount: item.invoiceAmount,
        }).subscribe(() => {
        });
    }

    onOpenImage(item: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, InvoiceViewModalComponent, item).subscribe(() => {
        });
    }

    onCssClass(mode) {
        if (mode === 'upload_lack') {
            return 'widthMax';
        } else {
            return 'widthMiddle';
        }
    }

    // 上传excel
    onUploadExcel(e) {
        if (e.target.files.length === 0) {
            return;
        }
        const err = this.validateExcelExt(e.target.files[0].name);
        if (!XnUtils.isEmpty(err)) {
            this.alert = err;

            // 把file input的值置为空，这样下次选择同一个文件还能触发这个请求
            $(e.target).val('');
            return;
        }

        const fd = new FormData();
        fd.append('checkerId', this.row.checkerId);
        fd.append('file_data', e.target.files[0], e.target.files[0].name);
        this.loadingService.open();
        // 上传excel发票
        this.xn.api.upload('/ljx/invoice/invoices_upload', fd).subscribe(json => {
            console.log('excel: ', json);
            if (json.type === 'complete') {
                if (json.data.ret === 0) {
                    if (json.data.data.data.length > 0) {
                        let repeats = [];
                        console.log('repeats: ', repeats);
                        const preNumbers = this.items.map(n => n.invoiceNum);
                        console.log('preNumbers: ', preNumbers);
                        json.data.data.data.map(v => {
                            if (this.items.map(n => n.invoiceNum).indexOf(v.invoiceNum) >= 0) {
                                repeats.push(v.invoiceNum);
                                repeats = this.arrUnique(repeats);
                            } else {
                                this.items.push(v);
                            }
                        });
                        if (repeats.length > 0) {
                            this.xn.msgBox.open(false, '以下发票号码重复：' + repeats.join(', '));
                        }
                    }
                    this.isExcel = true;
                    console.log(this.items);
                    // 上传完excel，马上计算发票金额
                    for (let i = 0; i < this.items.length; i++) {
                        if (this.sentItems.indexOf(this.items[i].invoiceNum) !== -1) { // sentItems为计算过的发票
                            console.log('invoiceNum: ', this.items[i].invoiceNum);
                            continue;
                        }
                        if (this.items[i].invoiceNum && !this.items[i].invoiceAmount && this.items[i].status === 3) {
                            this.xn.api.post('/ljx/invoice/invoice_info', {
                                invoiceNum: this.items[i].invoiceNum,
                                invoiceCode: this.items[i].invoiceCode
                            }).subscribe(keyData => {
                                this.sentItems.push(this.items[i].invoiceNum);
                                if ($.isEmptyObject(keyData.data)) {
                                    return;
                                }
                                if (keyData.data.type && keyData.data.type === 'jindie') {
                                    this.items[i].invoiceAmount = keyData.data.data.invoiceAmount;
                                } else {
                                    const invoiceResult = InvoiceUtils.handleInvoideResponse(keyData.data);
                                    this.items[i].invoiceAmount = invoiceResult.invoiceAmount;
                                }
                                this.toValue();
                            });
                        }
                    }

                    this.toValue();
                } else {
                    // this.isExcel = false;
                    this.xn.msgBox.open(false, '发票参数错误');
                }
                $(e.target).val('');
                this.ctrl.markAsDirty();
                this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
                this.loadingService.close();
            }
        });
        // }
    }

    onUpload(e) {
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
            // reader.readAsDataURL(file);
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
            console.log('准备上传的发票', data);
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
            this.xn.api.upload('/attachment/upload', fd).subscribe({
                next: v => {
                    if (v.type === 'progress') {
                        this.alert = this.uploadPicService.onProgress(v.data.originalEvent);
                    } else if (v.type === 'complete') {
                        if (v.data.ret === 0) {
                            const prevFileName = (file && file.name) || (blob && blob.name); // filename不存在则检测blobname
                            v.data.data.prevName = prevFileName;
                            console.log(files[index]);
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

    // 数组去重
    private arrUnique(arrs) {
        if (!arrs || arrs.length === 0) {
            return;
        }
        const hash = {} as any;
        arrs = arrs.reduce(function (item, next) {
            hash[next] ? '' : hash[next] = true && item.push(next);
            return item;
        }, []);
        return arrs;
    }

    /**
     *  删除选中项
     */
    deleteAll() {
        // 删除选中项
        this.items = this.items.filter((x: any) => x.clicked === undefined || x.clicked === false);
        if (this.items.length === 0) {
            this.checkedAllStatus = false;
        }
        this.toValue();
    }

    // 点击选中
    public handleSelect(index) {
        if (this.items[index].clicked && this.items[index].clicked === true) {
            this.items[index].clicked = false;
        } else {
            this.items[index].clicked = true;
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
        } else {
            this.items.map(item => item.clicked = false);
        }
    }

    // excel批量验证发票 - 验证未验证/失败 （重复验证 3, 验证失败 2, 验证成功 1,作废 4, undefined 未验证);
    public handleVerification() {
        console.log('所有的：', this.items);
        // 未验证的excel
        const filterItem = this.items.filter((x: any) => x.fileId === undefined && x.clicked && x.clicked === true);
        console.log('选中的未验证的', filterItem);
        if (filterItem.length > 0) {
            const paramArr = [];
            filterItem.map(x => {
                paramArr.push(
                    {
                        invoiceCode: x.invoiceCode === 'undefined' ? '' : x.invoiceCode,
                        invoiceNum: x.invoiceNum === 'undefined' ? '' : x.invoiceNum,
                        invoiceDate: x.invoiceDate === 'undefined' ? '' : x.invoiceDate,
                        invoiceAmount: x.invoicePretaxAmount === 'undefined' ? '' : x.invoicePretaxAmount,
                        invoiceTypeString: x.invoiceTypeString === 'undefined' ? '' : x.invoiceTypeString
                    });
            });
            // 多张验证参数
            this.postInit(paramArr, 0); // 多张逐个验证
        } else {
            this.xn.msgBox.open(false, '无未验证Excel发票', () => {
                this.items.forEach(x => {
                    if (x.clicked && x.clicked === true) {
                        x.clicked = false;
                    }
                    // 取消全选状态
                    const find = this.items.find((xx: any) => xx.clicked && xx.clicked === true);
                    if (find) {
                        this.checkedAllStatus = true;
                    } else {
                        this.checkedAllStatus = false;
                    }
                });
            });
        }
    }

    // 图片批量验证
    public handleVerificationPic() {
        // 未验证的
        const filterItem = this.items.filter(x => (!x.status || x.away && x.away !== 'edit') &&
            x.clicked && x.clicked === true && !!x.fileId && x.fileId !== '');
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
            this.postInitPic(filterItem, 0);
        } else {
            this.xn.msgBox.open(true, '无可查验发票', () => {
                this.items.forEach(x => {
                    if (x.clicked && x.clicked === true) {
                        x.clicked = false;
                    }
                    // 取消全选状态
                    const find = this.items.find((xx: any) => xx.clicked && xx.clicked === true);
                    if (find) {
                        this.checkedAllStatus = true;
                    } else {
                        this.checkedAllStatus = false;
                    }
                });

            });
        }
        // 取消全选状态
        const find1 = this.items.find((xx: any) => xx.clicked && xx.clicked === true);
        if (find1) {
            this.checkedAllStatus = true;
        } else {
            this.checkedAllStatus = false;
        }
    }

    // excel
    private postInit(filterItem: any[], i: number) {
        if (filterItem.length === i) {
            this.toValue();
            this.loading.close();
            return;
        }
        const params = { invoices: [filterItem[i]] };
        this.loading.open(filterItem.length, i);
        this.xn.api.postMap('/ljx/invoice/invoices_check', params).subscribe(val => {
            if (val.ret === 0) {
                const verData = val.data;
                console.log('批量验证后返回的数据', verData);
                verData.map((item) => {
                    const find = this.items.find(fis => fis.invoiceNum === item.data.invoiceNum);
                    if (item.code === 0 && this.items && this.items.length) {
                        // const find = this.items.find(fis => fis.invoiceNum === item.data.invoiceNum);
                        if (find) {
                            find.status = item.data.status;
                            find.invoiceAmount = item.data.invoiceAmount;
                        }
                    } else {
                        if (find) {
                            find.status = 2;
                        }
                    }
                    // 验证完成后取消选择checked选中状态
                    if (find.clicked && find.clicked === true) {
                        find.clicked = false;
                    }
                    // 取消全选状态
                    const find2 = this.items.find(xx => !xx.clicked || !!xx.clicked && xx.clicked === false);
                    if (!!find2) {
                        this.checkedAllStatus = false;
                    } else {
                        this.checkedAllStatus = true;
                    }
                });
            }
            this.toValue();
            i++;
            this.postInit(filterItem, i);
        });
    }

    // 图片
    private postInitPic(filterItem: any[], i: number) {
        if (filterItem.length === i) {
            this.toValue();
            this.loading.close();
            return;
        }
        const params = { fileId: filterItem[i].fileId, mainFlowId: this.svrConfig.record.mainFlowId };
        this.loading.open(filterItem.length, i);
        this.xn.api.postMap('/ljx/invoice/invoice_checkocr', params).subscribe(x => {
            if (x.ret === 0) {
                filterItem[i].status = x.data.data.status;
                filterItem[i].action = 'ok';
                filterItem[i].invoiceCode = x.data.data.invoiceCode;
                filterItem[i].invoiceNum = x.data.data.invoiceNum;
                filterItem[i].invoiceDate = x.data.data.invoiceDate;
                filterItem[i].invoiceAmount = x.data.data.invoiceAmount;
                filterItem[i].amount = x.data.data.amount || x.data.data.invoiceAmount;
            } else {
                // 验证失败
                filterItem[i].status = 2;
            }
            // 验证完成后取消选择checked选中状态
            if (filterItem[i].clicked && filterItem[i].clicked === true) {
                filterItem[i].clicked = false;
            }
            // 取消全选状态
            const find = this.items.find(xx => !xx.clicked || !!xx.clicked && xx.clicked === false);
            if (!!find) {
                this.checkedAllStatus = false;
            } else {
                this.checkedAllStatus = true;
            }
            this.toValue();
            i++;
            this.postInitPic(filterItem, i);
        });
    }

    private fromValue() {
        this.items = XnUtils.parseObject(this.ctrl.value, []);
        this.toValue();
    }

    // 上传完后取回值
    private toValue() {
        if (this.items.length === 0) {
            this.ctrl.setValue('');
        } else {
            this.items.map(v => {
                if (v && v.keyData) {
                    delete v.keyData;
                }
                return v;
            });
            console.log('toValue items: ', this.items);
            this.ctrl.setValue(JSON.stringify(this.items));
        }

        if (this.items.filter(v => v && v.invoiceAmount).length > 0) {
            this.amountAll = this.computeSum(this.items.filter(v =>
                v && v.invoiceAmount).map(v => Number(v.invoiceAmount))).toFixed(2) || 0;
        } else {
            this.amountAll = 0;
        }

        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    private validateExcelExt(s: string): string {
        if (isNullOrUndefined(this.row.options)) {
            return '';
        }
        // 前端配置excel 文件类型
        this.row.options.excelext = 'xls,xlsx';
        if ('excelext' in this.row.options) {
            const exts = this.row.options.excelext.replace(/,/g, '|').replace(/\s+/g, ''); // 删除所有空格
            if (s.match(new RegExp('\\.(' + exts + ')$', 'i'))) {
                return '';
            } else {
                return `只支持以下文件格式: ${this.row.options.excelext}`;
            }
        } else {
            return '';
        }
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
}
