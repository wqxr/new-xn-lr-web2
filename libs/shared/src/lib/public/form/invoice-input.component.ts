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
    // ?????????????????????
    public checkedAllStatus = false;
    // ????????????
    public selectedItems: any[] = [];
    // ???????????????- ????????????
    public items: any[] = [];
    public mode: string;

    public alert = '';
    // ???????????????excel??????
    public isExcel = false;
    // ??????
    public amountAll = 0;
    public sentItems: any[] = [];
    public unfill = false;
    // ???????????? 1:?????????,2:????????????, 3:????????? , 4:????????????,99:??????
    public orgType: number;
    private ctrl: AbstractControl;
    private xnOptions: XnInputOptions;
    // ??????reader onload
    private idx = 0;
    // ???????????????
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
        // ????????????????????????
        this.orgType = this.xn.user.orgType;
        this.mode = this.row.options.mode || 'upload';
        this.ctrl = this.form.get(this.row.name);
        console.log('????????????', this.ctrl, this.row);
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
        temps.splice(i, 1); // ????????????????????????????????????
        item.temps = temps;
        item.mainFlowId = this.svrConfig.record.mainFlowId;
        XnModalUtils.openInViewContainer(this.xn, this.vcr, InvoiceEditModalComponent, item).subscribe((v: any) => {
            console.log('???????????????', v);
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
                    this.xn.msgBox.open(false, `????????????(${v.invoiceNum})????????????????????????`);
                    return;
                }
            }
            // ?????????????????????????????????
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

    // ??????????????????????????????
    computeSum(array) {
        return array.reduce((prev, curr, idx, arr) => {
            return prev + curr;
        });
    }

    onBeforeUpload(e) {
        // if (this.items.length >= 10) {
        //     e.preventDefault();
        //     this.alert = '?????????????????????10???????????????Excel???????????????????????????';
        //     $(e.target).val('');  // ???file input???????????????????????????????????????????????????????????????????????????
        //     return;
        // }
        // // ???????????????
        // if (!this.row.options.multi && this.items.length > 0) {
        //     e.preventDefault();
        //     this.alert = '???????????????????????????????????????????????????????????????????????????????????????';
        //     $(e.target).val('');  // ???file input???????????????????????????????????????????????????????????????????????????
        //     return;
        // }
        return;
    }

    // ??????????????????
    onRemove(fileId: string) {
        console.log(fileId);
        this.xn.api.post(`/attachment/delete`, { key: fileId }).subscribe(json => {
            // ???this.files?????????fileId
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
        // ???this.files?????????invoiceNum
        for (let i = 0; i < this.items.length; ++i) {
            if (this.items[i].invoiceNum === invoiceNum) {
                this.items.splice(i, 1);
                this.sentItems = this.sentItems.filter(v => v !== invoiceNum); // ????????????????????????
                // ?????????????????????????????????????????????
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

    // ??????excel
    onUploadExcel(e) {
        if (e.target.files.length === 0) {
            return;
        }
        const err = this.validateExcelExt(e.target.files[0].name);
        if (!XnUtils.isEmpty(err)) {
            this.alert = err;

            // ???file input???????????????????????????????????????????????????????????????????????????
            $(e.target).val('');
            return;
        }

        const fd = new FormData();
        fd.append('checkerId', this.row.checkerId);
        fd.append('file_data', e.target.files[0], e.target.files[0].name);
        this.loadingService.open();
        // ??????excel??????
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
                            this.xn.msgBox.open(false, '???????????????????????????' + repeats.join(', '));
                        }
                    }
                    this.isExcel = true;
                    console.log(this.items);
                    // ?????????excel???????????????????????????
                    for (let i = 0; i < this.items.length; i++) {
                        if (this.sentItems.indexOf(this.items[i].invoiceNum) !== -1) { // sentItems?????????????????????
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
                    this.xn.msgBox.open(false, '??????????????????');
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

                // ???file input???????????????????????????????????????????????????????????????????????????
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
            // ????????????
            this.arrCache = arr1;
            // ?????????????????????????????????????????????????????????
            const data = [];
            const repeatFiles = XnUtils.distinctArray2(arr1, 'md5');
            // ???????????????????????????
            repeatFiles.map(val => {
                if (!this.filesMap.has(val.md5)) {
                    data.push(val);
                }
            });
            console.log('?????????????????????', data);
            if (data.length < 1) {
                this.xn.msgBox.open(false, '???????????????');
            }
            this.uploadImg(data, 0);
            $(e.target).val('');
        }
    }

    // ????????????
    private uploadImg(files: any[], index: number) {
        if (files.length === index) {
            this.items.sort(function (a: any, b: any): number {
                if (a.prevName > b.prevName) {
                    return 1;
                } else {
                    return -1;
                }
            });
            // ?????????????????????
            this.loading.close();
            // ??????????????????????????????????????????
            if (files.length < this.arrCache.length) {
                this.xn.msgBox.open(false, '???????????????????????????');
            }
            return;
        }
        // ??????loading,????????????????????????????????????????????????
        this.loading.open(files.length, index);
        this.uploadPicService.compressImage(files[index], this.alert, this.row, (blob, file) => {
            const fd = new FormData();
            fd.append('checkerId', this.row.checkerId);
            // FormData.append??????????????????????????????????????????filename?????????blob, file && file.name???????????????file????????????
            fd.append('file_data', blob, file && file.name);
            this.xn.api.upload('/attachment/upload', fd).subscribe({
                next: v => {
                    if (v.type === 'progress') {
                        this.alert = this.uploadPicService.onProgress(v.data.originalEvent);
                    } else if (v.type === 'complete') {
                        if (v.data.ret === 0) {
                            const prevFileName = (file && file.name) || (blob && blob.name); // filename??????????????????blobname
                            v.data.data.prevName = prevFileName;
                            console.log(files[index]);
                            // ???md5 ??????????????????
                            v.data.data.md5 = files[index].md5;
                            this.alert = '';
                            this.items.push(v.data.data);
                            this.filesMap.set(files[index].md5, files[index].md5); // ?????????????????????
                            this.toValue();
                        } else {
                            this.xn.msgBox.open(false, v.data.msg);
                            // ????????????
                        }
                        index++;
                        setTimeout(() => {
                            this.uploadImg(files, index);
                        }, 1000);
                    } else {
                        // ????????????
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

    // ????????????
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
     *  ???????????????
     */
    deleteAll() {
        // ???????????????
        this.items = this.items.filter((x: any) => x.clicked === undefined || x.clicked === false);
        if (this.items.length === 0) {
            this.checkedAllStatus = false;
        }
        this.toValue();
    }

    // ????????????
    public handleSelect(index) {
        if (this.items[index].clicked && this.items[index].clicked === true) {
            this.items[index].clicked = false;
        } else {
            this.items[index].clicked = true;
        }
        // ?????????????????????clicked ??????false????????????????????????????????????
        const find = this.items.find((x: any) => x.clicked === undefined || x.clicked === false);
        if (!find) {
            this.checkedAllStatus = true;
        } else {
            this.checkedAllStatus = false;
        }

    }

    // ?????????????????????
    public handleAllSelect() {
        this.checkedAllStatus = !this.checkedAllStatus;

        if (this.checkedAllStatus) {
            this.items.map(item => item.clicked = true);
        } else {
            this.items.map(item => item.clicked = false);
        }
    }

    // excel?????????????????? - ???????????????/?????? ??????????????? 3, ???????????? 2, ???????????? 1,?????? 4, undefined ?????????);
    public handleVerification() {
        console.log('????????????', this.items);
        // ????????????excel
        const filterItem = this.items.filter((x: any) => x.fileId === undefined && x.clicked && x.clicked === true);
        console.log('?????????????????????', filterItem);
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
            // ??????????????????
            this.postInit(paramArr, 0); // ??????????????????
        } else {
            this.xn.msgBox.open(false, '????????????Excel??????', () => {
                this.items.forEach(x => {
                    if (x.clicked && x.clicked === true) {
                        x.clicked = false;
                    }
                    // ??????????????????
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

    // ??????????????????
    public handleVerificationPic() {
        // ????????????
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
            this.xn.msgBox.open(true, '??????????????????', () => {
                this.items.forEach(x => {
                    if (x.clicked && x.clicked === true) {
                        x.clicked = false;
                    }
                    // ??????????????????
                    const find = this.items.find((xx: any) => xx.clicked && xx.clicked === true);
                    if (find) {
                        this.checkedAllStatus = true;
                    } else {
                        this.checkedAllStatus = false;
                    }
                });

            });
        }
        // ??????????????????
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
                console.log('??????????????????????????????', verData);
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
                    // ???????????????????????????checked????????????
                    if (find.clicked && find.clicked === true) {
                        find.clicked = false;
                    }
                    // ??????????????????
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

    // ??????
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
                // ????????????
                filterItem[i].status = 2;
            }
            // ???????????????????????????checked????????????
            if (filterItem[i].clicked && filterItem[i].clicked === true) {
                filterItem[i].clicked = false;
            }
            // ??????????????????
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

    // ?????????????????????
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
        // ????????????excel ????????????
        this.row.options.excelext = 'xls,xlsx';
        if ('excelext' in this.row.options) {
            const exts = this.row.options.excelext.replace(/,/g, '|').replace(/\s+/g, ''); // ??????????????????
            if (s.match(new RegExp('\\.(' + exts + ')$', 'i'))) {
                return '';
            } else {
                return `???????????????????????????: ${this.row.options.excelext}`;
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
            const exts = this.row.options.fileext.replace(/,/g, '|').replace(/\s+/g, ''); // ??????????????????
            if (s.match(new RegExp('\\.(' + exts + ')$', 'i'))) {
                return '';
            } else {
                return `???????????????????????????: ${this.row.options.fileext}`;
            }
        } else {
            return '';
        }
    }
}
