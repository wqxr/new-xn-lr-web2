import { Component, OnInit, Input, ElementRef, ViewContainerRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import * as md5 from 'js-md5';
import { isNullOrUndefined } from 'util';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { InvoiceVankeEditModalComponent } from 'libs/shared/src/lib/public/modal/invoice-vanke-edit-modal.component';
import { InvoiceViewModalComponent } from 'libs/shared/src/lib/public/modal/invoice-view-modal.component';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { UploadPicService } from 'libs/shared/src/lib/services/upload-pic.service';
import { InvoiceUploadService } from 'libs/shared/src/lib/services/invoice-upload.service';
import { LoadingPercentService } from 'libs/shared/src/lib/services/loading-percent.service';

declare let $: any;

/**
 *  发票上传、验证组件
 */
@Component({
    selector: 'app-xn-invoice-input',
    templateUrl: './invoice-vanke-input.component.html',
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

            .block {
                display: block
            }

            /*.text-color {*/
            /*color: #d00000;*/
            /*}*/

            .money-color {
                color: #b10000;
            }

            .a-btn {
                margin: 0 1px;
            }

            .sorting:after, .sorting_asc:after, .sorting_desc:after {
                font-family: 'Glyphicons Halflings';
                opacity: 0.5;
            }

            .sorting:after {
                content: "\\e150";
                opacity: 0.2
            }

            .sorting_asc:after {
                content: "\\e155"
            }

            .sorting_desc:after {
                content: "\\e156"
            }

            .tag-color {
                color: #f20000;;
            }
        `
    ]
})
@DynamicForm({ type: 'invoice-vanke', formModule: 'new-agile-input' })
export class InvoiceVankeInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    // 全选框选择状态
    public checkedAllStatus = false;
    // 上传的数据- 初始状态
    public items: any[] = [];
    public alert = '';
    // 含税
    public amountAll = 0;
    public transferAmount = 0;
    // 不含税
    public preAmountAll = 0;
    public unfill = false;
    private ctrl: AbstractControl;
    private xnOptions: XnInputOptions;
    // 角色
    public orgType = this.xn.user.orgType;
    // 批量验证按钮状态
    public btnStatus = false;
    // 全选按钮控制状态
    public SelectedBtnStatus = false;
    // 人工审核按钮文本
    public btnLabel: string;
    // 计算reader onload
    private idx = 0;
    // 表头样式
    public sort = { invoiceDate: 'sorting', invoiceAmount: 'sorting', invoiceNum: 'sorting' };
    // 上传的图片
    public filesMap = new Map();
    arrCache: any[];

    constructor(private xn: XnService,
        private er: ElementRef,
        private vcr: ViewContainerRef,
        private loading: LoadingPercentService,
        private invoiceUpload: InvoiceUploadService,
        private loadingService: LoadingService,
        private uploadPicService: UploadPicService,
        private publicCommunicateService: PublicCommunicateService) {
    }

    public ngOnInit() {
        this.btnLabel = '手工查验';
        this.ctrl = this.form.get(this.row.name);

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

    public onEdit(item: any, i?: number, bool?: boolean) {
        if (bool === true) {
            return;
        }
        const temps = $.extend(true, [], this.items);
        temps.splice(i, 1); // 删除掉本身，可以做过滤用
        item.temps = temps;
        item.flowId = this.row.flowId;
        item.mainFlowId = this.svrConfig.record.mainFlowId;
        XnModalUtils.openInViewContainer(this.xn, this.vcr, InvoiceVankeEditModalComponent, item).subscribe((v: any) => {
            if (item.temps) {
                delete item.temps;
            }
            if (v.action === 'ok') {
                item.invoiceAmount = v.invoiceAmount;
                item.invoiceCode = v.invoiceCode;
                item.amount = Number(v.amount).toFixed(2);
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
        this.xn.api.post(`/attachment/delete`, { key: val.fileId }).subscribe(json => {
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
            for (let i = 0; i < this.items.length; ++i) {
                if (this.items[i].fileId === fileId) {
                    item = this.items[i];
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
        finds.map(x => {
            this.isUploadInvoiceNum({ value: x.invoiceNum, change: 0 });
            this.filesMap.delete(x.md5); // 删除键值对
        });
        this.items = this.items.filter((x: any) => x.clicked === undefined || x.clicked === false);
        if (this.items.length === 0) {
            this.checkedAllStatus = false;
            this.btnStatus = false;
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
        const params = { fileId: item.fileId, mainFlowId: this.svrConfig.record.mainFlowId };
        // XnUtils.checkLoading(this);
        this.loadingService.open();
        this.xn.api.postMap('/ljx/invoice/invoice_checkocr', params).subscribe(x => {
            if (x.ret === 0) {
                item.status = x.data.data.status;
                item.action = 'ok';
                item.invoiceCode = x.data.data.invoiceCode;
                item.invoiceNum = x.data.data.invoiceNum;
                item.invoiceDate = x.data.data.invoiceDate;
                item.invoiceAmount = x.data.data.invoiceAmount;
                item.invoiceCheckCode = x.data.data?.invoiceCheckCode || '';
                item.amount = x.data.data.amount || x.data.data.invoiceAmount;
                this.isUploadInvoiceNum({ value: item.invoiceNum, change: 1 });
                this.filterInvoiceNum();
                this.toValue();
            } else {
                // 验证失败
                item.status = 2;
                this.xn.msgBox.open(false, '发票验证失败', () => {
                    this.toValue();
                });
                // return;
            }
            this.loadingService.close();
        });
    }

    private fromValue() {
        this.items = XnUtils.parseObject(this.ctrl.value, []);
        this.toValue();
    }



    // 批量验证发票 - 验证未验证/失败 （重复验证 3, 验证失败 2, 验证成功 1,作废 4, undefined 未验证);
    public handleVerification(bool: boolean) {
        if (!bool) {
            return;
        }
        // 未验证的
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
                this.items.forEach(x => {
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

    // 查看交易流程
    viewProcess(item: any) {
        this.xn.router.navigate([`console/main-list/detail/${item}`]);
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
        console.log('files...........', files);
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

    private postInit(filterItem: any[], i: number) {
        if (filterItem.length === i) {
            this.filterInvoiceNum();
            this.toValue();
            this.loading.close();
            return;
        }
        const params = { fileId: filterItem[i].fileId,mainFlowId:this.svrConfig.record.mainFlowId };
        // XnUtils.checkLoading(this);
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
                filterItem[i].invoiceCheckCode = x.data.data?.invoiceCheckCode || '';
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
        });
    }

    // 根据 invoiceNum的值 来验证是否上传了发票
    private isUploadInvoiceNum(obj: InvoiceChangeModel) {
        this.invoiceUpload.change.emit(obj);
    }




    // 上传完后取回值
    private toValue() {
        if (this.items.length === 0) {
            this.ctrl.setValue('');
            this.amountAll = 0;
        } else {
            const contractTypeBool = []; // 必须每张发票都包含发票号，金额，开票日期
            for (let i = 0; i < this.items.length; i++) {
                contractTypeBool.push(!!(this.items[i].invoiceAmount) && !!(this.items[i].invoiceNum && !!this.items[i].invoiceDate));
            }
            contractTypeBool.indexOf(false) > -1 ? this.ctrl.setValue('') : this.ctrl.setValue(JSON.stringify(this.items));
            if (this.items.filter(v => v && v.invoiceAmount).length > 0) {
                this.amountAll = this.computeSum(this.items.filter(v =>
                    v && v.invoiceAmount).map(v => Number(v.invoiceAmount))).toFixed(2) || 0;
            } else {
                this.amountAll = 0;
            }
        }
        // 计算完金额后向外抛出的值
        this.publicCommunicateService.change.emit(this.amountAll);
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
}

// 发票是否上传
export class InvoiceChangeModel {
    value: string; // 发票代码
    change: number; // 1，添加，0 ,删除
}
